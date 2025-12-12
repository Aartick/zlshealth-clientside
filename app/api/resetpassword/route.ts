import User from "@/models/User";
import { error, success } from "@/utils/responseWrapper";
import { NextRequest } from "next/server";
import bcrypt from "bcrypt";
import dbConnect from "@/dbConnect/dbConnect";

/**
 * @method POST
 * @route /api/resetpassword
 * @description Handles password reset with user ID parameter
 * @param req Next.js request object
 * @returns success or error response
 * @access Public
 */

export async function POST(req: NextRequest) {
  try {
    await dbConnect(); // Ensure MongoDB connection is established

    const { param, password } = await req.json();

    // Validate required fields
    if (!param || !password) {
      return error(400, "User ID and password are required.");
    }

    // Validate password length
    if (password.length < 8) {
      return error(400, "Password must be at least 8 characters long.");
    }

    // Validate password strength
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return error(
        400,
        "Password must contain at least one special character, one uppercase letter, one lowercase letter, and one number."
      );
    }

    // Find user by ID
    const user = await User.findById(param);

    // User does not exist
    if (!user) {
      return error(404, "Invalid or expired reset link.");
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password
    user.password = hashedPassword;
    await user.save();

    // Return success response
    return success(200, "Password reset successfully! You can now log in with your new password.");
  } catch (e) {
    console.error("Error in reset password:", e);
    // Handle unexpected errors
    return error(500, "Something went wrong. Please try again.");
  }
}

/**
 * @method GET
 * @route /api/resetpassword?param=<userId>
 * @description Verifies if the user ID is valid
 * @param req Next.js request object
 * @returns success or error response
 * @access Public
 */

export async function GET(req: NextRequest) {
  try {
    await dbConnect(); // Ensure MongoDB connection is established

    const { searchParams } = new URL(req.url);
    const param = searchParams.get("param");

    // Validate param
    if (!param) {
      return error(400, "User ID parameter is required.");
    }

    // Find user by ID
    const user = await User.findById(param);

    // User does not exist
    if (!user) {
      return error(404, "Invalid or expired reset link.");
    }

    // Return success response
    return success(200, "Valid reset link.");
  } catch (e) {
    console.error("Error in verify reset link:", e);
    // Handle unexpected errors
    return error(500, "Something went wrong. Please try again.");
  }
}
