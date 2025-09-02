import dbConnect from "@/dbConnect/dbConnect";
import User from "@/models/User";
import {
  generateAccessToken,
  generateRefreshToken,
} from "@/utils/generateTokens";
import { error, success } from "@/utils/responseWrapper";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

/**
 * @method POST
 * @route /api/auth/google
 * @description Google OAuth sign-in/up:
 * - Accepts Google profile data, finds/creates user, links googleId if needed
 * - Issues access + refresh tokens (refresh stored in HttpOnly cookie)
 * @param req - Body: {id: string, name?: string, email: string}
 * @returns - 201 with accessToken on success; JSON error otherwise
 * @access Public
 */
export async function POST(req: NextRequest) {
  try {
    // Parse and validate body
    const { id, name, email } = await req.json();

    if (!email || !id) {
      return error(400, "Email and googleId are required.");
    }

    await dbConnect(); //Ensure DB connection

    // Try to find existing user by googleId OR email
    // - If user exists via email but not yet linked, we'll link googleId below
    let existUser = await User.findOne({
      $or: [{ googleId: id }, { email: email }],
    });

    // Create or link the user
    if (!existUser) {
      // No user found -> create one with Google details
      existUser = await User.create({
        name: name,
        googleId: id,
        email: email,
        hasAgreedToPrivacyPolicy: true,
      });
    } else if (!existUser.googleId) {
      // User exists by email but not linked to Google -> link now
      existUser.googleId = id;
      await existUser.save();
    }

    // Generate short-lived access token (for Authorization header)
    const accessToken = generateAccessToken({
      _id: existUser._id,
    });

    // Generate refresh token (longer-lived) and store in secure HttpOnly cookie
    const refreshToken = generateRefreshToken({
      _id: existUser._id,
    });

    // Set refresh token cookie (HttpOnly so JS can't read it)
    (await cookies()).set("jwt", refreshToken, {
      httpOnly: true,
      secure: true, // keep true in prod (HTTPS)
    });

    // Return access token to client (store in memory/localStorage on client)
    return success(201, { accessToken });
  } catch (e) {
    console.log(e); 
    return error(500, "Something went wrong.");
  }
}
