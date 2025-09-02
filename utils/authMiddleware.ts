import { NextRequest } from "next/server";
import { error } from "./responseWrapper";
import jwt from "jsonwebtoken";
import dbConnect from "@/dbConnect/dbConnect";
import User from "@/models/User";

/**
 * @function verifyAccessToken
 * @description Middleware function to verify and decode the access token from Authorization header.
 * @param {NextRequest} req - The incoming Next.js request object.
 * @returns
 * - `valid: true` if token is valid, along with user data.
 * - `valid: false` with an error response if token is missing, invalid, or expired.
 */
export const verifyAccessToken = async (req: NextRequest) => {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      valid: false,
      response: error(401, "Authorization header is required."),
    };
  }

  const accessToken = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_PRIVATE_KEY!
    ) as { _id: string };

    await dbConnect();
    const user = await User.findById(decoded._id);

    if (!user) {
      return {
        valid: false,
        response: error(404, "User not found."),
      };
    }

    return { valid: true, _id: decoded._id, user };
  } catch (e) {
    return {
      valid: false,
      response: error(401, "Invalid user or token expired."),
    };
  }
};
