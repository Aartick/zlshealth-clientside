import User from "@/models/User";
import { error, success } from "@/utils/responseWrapper";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import dbConnect from "@/dbConnect/dbConnect";
import {
  generateAccessToken,
  generateRefreshToken,
} from "@/utils/generateTokens";

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  if (!type) {
    return NextResponse.json(error(404, "Type is required."));
  }

  try {
    await dbConnect();
    if (type === "register") {
      const { email, password } = await req.json();

      if (!email || !password) {
        return NextResponse.json(error(400, "Email and Password are required"));
      }

      const oldUser = await User.findOne({ email });

      if (oldUser) {
        return NextResponse.json(error(409, "User is already registered."));
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await User.create({
        email,
        password: hashedPassword,
      });

      return NextResponse.json(success(201, "Sign in successfully."));
    } else if (type === "login") {
      const { email, password } = await req.json();

      if (!email || !password) {
        return NextResponse.json(
          error(400, "Email and Password are required.")
        );
      }

      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return NextResponse.json(error(404, "User is not registered."));
      }

      const matched = await bcrypt.compare(password, user.password);

      if (!matched) {
        return NextResponse.json(error(403, "Incorrect password."));
      }

      const accessToken = generateAccessToken({
        _id: user._id,
      });

      const refreshToken = generateRefreshToken({
        _id: user._id,
      });

      (await cookies()).set("jwt", refreshToken, {
        httpOnly: true,
        secure: true,
      });

      return NextResponse.json(success(201, { accessToken }));
    }
  } catch (e) {
    console.log(e);
    return NextResponse.json(error(500, "Something went wrong."));
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  try {
    if (type === "refreshToken") {
      const cookie = req.cookies.get("jwt");

      if (!cookie) {
        return NextResponse.json(
          error(401, "Refresh token in cookie is required.")
        );
      }

      const refreshToken = cookie.value;

      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_PRIVATE_KEY!
      ) as { _id: string };

      const _id = decoded._id;
      const accessToken = generateAccessToken({ _id });

      return NextResponse.json(success(201, { accessToken }));
    } else if (type === "logout") {
      const cookieStore = cookies();
      (await cookieStore).set("jwt", "", {
        httpOnly: true,
        secure: true,
        expires: new Date(0),
      });

      return NextResponse.json(success(200, "Logged out successfully"));
    }
  } catch (e) {
    console.log(e);
    return NextResponse.json(error(500, "Something went wrong."));
  }
}
