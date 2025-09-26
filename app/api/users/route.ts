import User from "@/models/User";
import { verifyAccessToken } from "@/utils/authMiddleware";
import { error, success } from "@/utils/responseWrapper";
import { NextRequest } from "next/server";

/**
 * @route GET /api/users?type=<me | "">
 * @description - Fetch Products
 * 1. Supports two modes:
 *    - 'type=me': Fetch single user by ID.
 *    - 'type= ' : Fetch all the users in DB.
 * @param req
 * @returns
 */

export async function GET(req: NextRequest) {
  try {
    // Verify JWT token and extract customer ID
    const { valid, response, _id } = await verifyAccessToken(req);
    if (!valid) return response!;

    // Fetch user (exclude password)
    const user = await User.findById(_id);

    if (!user) {
      return error(404, "User not found");
    }

    return success(200, user);
  } catch (e) {
    console.log(e);
    return error(500, "Something went wrong.");
  }
}

/**
 * @route PUT /api/users
 * @description - Updates the user profile
 * @param req
 * @returns
 */
export async function PUT(req: NextRequest) {
  try {
    // Verify JWT token and extract customer ID
    const { valid, response, _id } = await verifyAccessToken(req);
    if (!valid) return response!;

    const { fullName, dob, phone, gender, email } = await req.json();

    // Validate all the required fields
    if (!fullName || !dob || !phone || !gender || !email) {
      return error(400, "All fields are required.");
    }

    // Find the user by ID and udpate the provided details
    await User.findByIdAndUpdate(
      _id,
      {
        fullName,
        dob,
        phone,
        gender,
        email,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return success(200, "Profile updated successfully");
  } catch (e) {
    console.log(e);
    return error(500, "Something went wrong.");
  }
}

/**
 * @route DELETE /api/users
 * @description - Delete the user profile
 * @param req
 * @returns
 */
export async function DELETE(req: NextRequest) {
  try {
    // Verify JWT token and extract customer ID
    const { valid, response, _id } = await verifyAccessToken(req);
    if (!valid) return response!;

    // Find the user by ID and delete
    const deletedUser = await User.findByIdAndDelete(_id);

    // if user not found
    if (!deletedUser) {
      return error(404, "User not found.");
    }

    return success(200, "User deleted successfully.");
  } catch (e) {
    console.log(e);
    return error(500, "Something went wrong.");
  }
}
