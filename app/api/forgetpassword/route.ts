import User from "@/models/User";
import { error, success } from "@/utils/responseWrapper";
import { NextRequest } from "next/server";
import dbConnect from "@/dbConnect/dbConnect";
import { sendEmail } from "@/utils/sendEmail";

/**
 * @method POST
 * @route /api/forgetpassword
 * @description Handles forgot password request - sends reset link to user's email
 * @param req Next.js request object
 * @returns success or error response
 * @access Public
 */

export async function POST(req: NextRequest) {
  try {
    await dbConnect(); // Ensure MongoDB connection is established

    const { email } = await req.json();

    // Validate email input
    if (!email) {
      return error(400, "Email is required.");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return error(400, "Please provide a valid email address.");
    }

    // Search for user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    // User does not exist
    if (!user) {
      return error(404, "No account found with this email address.");
    }

    // Get domain URL from environment variable
    const domainUrl = process.env.DOMAIN_URL || process.env.NEXT_PUBLIC_DOMAIN_URL;

    if (!domainUrl) {
      console.error("DOMAIN_URL environment variable is not set");
      return error(500, "Server configuration error. Please contact support.");
    }

    // Create reset password link with user ID as parameter
    const resetLink = `${domainUrl}/reset-password?param=${user._id}`;

    // Send email with reset link using Mailgun
    try {
      await sendEmail({
        to: email,
        subject: "Reset Your Password - Zealous Health",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #092C16;">Reset Your Password</h2>
            <p>Hi ${user.fullName || 'there'},</p>
            <p>You requested to reset your password. Click the button below to create a new password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #092C16; color: white; text-decoration: none; border-radius: 10px;">Reset Password</a>
            </div>
            <p>Or copy and paste this link into your browser:</p>
            <p style="color: #71BF45; word-break: break-all;">${resetLink}</p>
            <p style="margin-top: 30px;">This link will expire in 30 minutes for security reasons.</p>
            <p style="color: #666; font-size: 14px;">If you didn't request this password reset, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #e3e3e3; margin: 30px 0;">
            <p style="color: #666; font-size: 12px; text-align: center;">Zealous Health - Your trusted health partner</p>
          </div>
        `
      });

      console.log(`Password reset email sent to: ${email}`);
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      return error(500, "Failed to send reset email. Please try again later.");
    }

    // Return success response
    return success(200, "Password reset link has been sent to your email.");
  } catch (e) {
    console.error("Error in forgot password:", e);
    // Handle unexpected errors
    return error(500, "Something went wrong. Please try again.");
  }
}
