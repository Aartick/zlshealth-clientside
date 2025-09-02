import User from "@/models/User";
import { error, success } from "@/utils/responseWrapper";
import { NextRequest } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import dbConnect from "@/dbConnect/dbConnect";
import {
  generateAccessToken,
  generateRefreshToken,
} from "@/utils/generateTokens";

/**
 * @method POST
 * @route /api/auth?type=<register | login>
 * @description Handles user registration, login, and JWT token creation
 * @param req Next.js request object
 * @query {string} type - Must be either 'register' or 'login'
 * @returns succes or error response
 * @access Public
 */

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  // Determine the type of operation (registration or login)
  const type = searchParams.get("type");

  if (!type) {
    return error(404, "Type is required.");
  }

  try {
    await dbConnect(); // Ensure MongoDB connection is established
    if (type === "register") {
      // Registration flow
      const { email, password } = await req.json();

      // Validate required fields
      if (!email || !password) {
        return error(400, "Email and Password are required");
      }

      const oldUser = await User.findOne({ email });

      // Prevent duplicate registration
      if (oldUser) {
        return error(409, "User is already registered.");
      }

      // Hash password for security
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user in the database
      await User.create({
        email,
        password: hashedPassword,
      });

      // Registration success response
      return success(201, "Sign in successfully.");
    } else if (type === "login") {
      // Login flow
      const { email, password } = await req.json();

      // Validate required fields
      if (!email || !password) {
        return error(400, "Email and Password are required.");
      }

      // Fetch user and include password field
      const user = await User.findOne({ email }).select("+password");

      // User does not exist
      if (!user) {
        return error(404, "User is not registered.");
      }

      // Compare hashed password
      const matched = await bcrypt.compare(password, user.password);

      // Invalid password
      if (!matched) {
        return error(403, "Incorrect password.");
      }

      // Generate JWT access and refresh tokens
      const accessToken = generateAccessToken({
        _id: user._id,
      });

      const refreshToken = generateRefreshToken({
        _id: user._id,
      });

      // Store refresh token in HttpOnly cookie
      (await cookies()).set("jwt", refreshToken, {
        httpOnly: true,
        secure: true,
      });

      // Return access token to client
      return success(201, { accessToken });
    }
  } catch (e) {
    console.log(e);
    // Handle unexpected errors
    return error(500, "Something went wrong.");
  }
}

/**
 * @method GET
 * @route /api/auth?type=<refreshToken | logout>
 * @description - Handles token refresh and logout
 * @param req - Next.js request object
 * @query {string} type - Must be either 'refreshToken' or 'logout'
 * @returns - JSON success or error response
 * @access Public (or protected if auth required)
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  // Determin opeartion: refreshToken or logout
  const type = searchParams.get("type");

  try {
    if (type === "refreshToken") {
      // Refresh access token using refresh token from cookie
      const cookie = req.cookies.get("jwt");

      // Refresh token must exist
      if (!cookie) {
        return error(401, "Refresh token in cookie is required.");
      }

      const refreshToken = cookie.value;

      // Verify refresh token
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_PRIVATE_KEY!
      ) as { _id: string };

      const _id = decoded._id;
      // Generate new access token
      const accessToken = generateAccessToken({ _id });

      // Return new access token
      return success(201, { accessToken });
    } else if (type === "logout") {
      // Logout flow: remove refresh token cookie
      const cookieStore = cookies();
      (await cookieStore).set("jwt", "", {
        httpOnly: true,
        secure: true,
        expires: new Date(0), // Expire the cookie immediately
      });

      // Logout success response
      return success(200, "Logged out successfully");
    }
  } catch (e) {
    console.log(e);
    // Handle unexpected errors
    return error(500, "Something went wrong.");
  }
}
