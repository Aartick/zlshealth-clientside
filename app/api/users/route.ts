import User from "@/models/User";
import { verifyAccessToken } from "@/utils/authMiddleware";
import cloudinary from "@/utils/cloudinary";
import { error, success } from "@/utils/responseWrapper";
import { NextRequest } from "next/server";

/**
 * @route GET /api/users
 * @description - Fetch User
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

    // Transform data to be frontend friendly
    const responseWrapper = {
      fullName: user.fullName,
      dob: user.dob,
      phone: user.phone,
      gender: user.gender,
      email: user.email,
      img: user.img.url,
    };

    return success(200, responseWrapper);
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

    const { fullName, dob, phone, gender, email, img } = await req.json();

    // Validate all the required fields
    if (!fullName || !dob || !phone || !gender || !email || !img) {
      return error(400, "All fields are required.");
    }

    // select user img field only
    const user = await User.findById(_id).select("img");

    let cloudImg = user?.img;

    // Check if new image is provided
    if (img && typeof img === "string") {
      // Case 1: It's a data URI (new image)
      if (img.startsWith("data:")) {
        // If user already has an image, destroy it
        if (user?.img?.public_id) {
          await cloudinary.uploader.destroy(user.img.public_id);
        }

        // Upload new image
        const uploaded = await cloudinary.uploader.upload(img, {
          folder: "User",
        });

        cloudImg = {
          url: uploaded.secure_url,
          public_id: uploaded.public_id,
        };
      }

      // Case 2: It's an existing URL from DB -> skip upload/delete
      else if (img === user?.img?.url) {
        cloudImg = user.img; // keep existing
      }
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
        img: cloudImg,
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
