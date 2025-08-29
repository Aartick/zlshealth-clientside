import dbConnect from "@/dbConnect/dbConnect";
import User from "@/models/User";
import {
  generateAccessToken,
  generateRefreshToken,
} from "@/utils/generateTokens";
import { error, success } from "@/utils/responseWrapper";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { id, name, email } = await req.json();

    if (!email || !id) {
      return error(400, "Email and googleId are required.");
    }

    await dbConnect();

    let existUser = await User.findOne({
      $or: [{ googleId: id }, { email: email }],
    });

    if (!existUser) {
      existUser = await User.create({
        name: name,
        googleId: id,
        email: email,
        hasAgreedToPrivacyPolicy: true,
      });
    } else if (!existUser.googleId) {
      existUser.googleId = id;
      await existUser.save();
    }

    const accessToken = generateAccessToken({
      _id: existUser._id,
    });

    const refreshToken = generateRefreshToken({
      _id: existUser._id,
    });

    (await cookies()).set("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
    });

    return success(201, { accessToken });
  } catch (e) {
    console.log(e);
    return error(500, "Something went wrong.");
  }
}
