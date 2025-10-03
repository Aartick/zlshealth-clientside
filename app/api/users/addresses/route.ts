import User from "@/models/User";
import { verifyAccessToken } from "@/utils/authMiddleware";
import { error, success } from "@/utils/responseWrapper";
import { NextRequest } from "next/server";

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

    const newAddress = await req.json();

    // Validate all the required fields

    // If this is the first address, automatically make it default
    const user = await User.findById(_id);

    if (user.addresses.length === 0) {
      newAddress.isDefault = true;
    }

    // If user marks this as default, unset other defaults first
    if (newAddress.isDefault) {
      await User.updateOne(
        { _id },
        { $set: { "addresses.$[].isDefault": false } }
      );
    }

    // Find the user by ID and push the new address
    // const updatedUser =
    await User.findByIdAndUpdate(
      _id,
      { $push: { addresses: newAddress } },
      { new: true }
    );
    // updatedUser?.addresses
    return success(200, "Profile updated successfully");
  } catch (e) {
    console.log(e);
    return error(500, "Something went wrong.");
  }
}

/**
 * @route DELETE /api/users
 * @description - Delete the user address
 * @param req
 * @returns
 */
export async function DELETE(req: NextRequest) {
  try {
    // Verify JWT token and extract customer ID
    const { valid, response, _id } = await verifyAccessToken(req);
    if (!valid) return response!;

    const { searchParams } = new URL(req.url);
    const addressId = searchParams.get("addressId");

    // Validate the required fields
    if (!addressId) {
      return error(400, "Address ID is required");
    }

    const user = await User.findById(_id);

    // Find the address being deleted
    const addressToDelete = user.addresses.id(addressId);
    if (!addressToDelete) {
      return error(404, "Address not found");
    }

    const wasDefault = addressToDelete.isDefault;

    // Remove the address
    // user.addresses = user.addresses.filter(
    //   (addr: any) => addr._id.toString() !== addressId
    // );

    // If the deleted address was default, assign another one as default
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true; // pick the first one as default
    }

    await user.save();
    return success(200, "Address removed successfully");
  } catch (e) {
    console.log(e);
    return error(500, "Something went wrong.");
  }
}
