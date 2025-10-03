import User from "@/models/User";
import { verifyAccessToken } from "@/utils/authMiddleware";
import { error, success } from "@/utils/responseWrapper";
import { NextRequest } from "next/server";

/**
 * @route GET /api/users
 * @description - Get the user addresses
 * @param req
 * @returns
 */
export async function GET(req: NextRequest) {
  try {
    // Verify JWT token and extract customer ID
    const { valid, response, _id } = await verifyAccessToken(req);
    if (!valid) return response!;

    const user = await User.findById(_id).select("addresses");

    return success(200, user.addresses);
  } catch (e) {
    console.log(e);
    return error(500, "Something went wrong.");
  }
}

/**
 * @route PUT /api/users
 * @description - Add/Updates the user addresses
 * @param req
 * @returns
 */

export interface IAddress {
  _id?: string;
  fullName: string;
  phone: string;
  landmark: string;
  streetAddress: string;
  city: string;
  district: string;
  state: string;
  pinCode: string;
  streetAddress2?: string;
  houseNo?: string;
  isDefault?: boolean;
}
export async function PUT(req: NextRequest) {
  try {
    // Verify JWT token and extract customer ID
    const { valid, response, _id } = await verifyAccessToken(req);
    if (!valid) return response!;

    const addressData = await req.json();

    // Validate all the required fields
    const requiredFields = [
      "fullName",
      "phone",
      "landmark",
      "streetAddress",
      "city",
      "district",
      "state",
      "pinCode",
    ];

    for (const field of requiredFields) {
      if (!addressData[field]) {
        return error(400, `Please provide required fields.`);
      }
    }

    // Fetch user
    const user = await User.findById(_id).select("addresses");

    let message = "";

    if (!user.addresses || user.addresses.length === 0) {
      // Create first address and make it default;
      addressData.isDefault = true;
      user.addresses.push(addressData);
      message = "Address added successfully";
    } else if (addressData._id) {
      // Update existing address
      const idx = user.addresses.findIndex(
        (addr: IAddress) => addr._id?.toString() === addressData._id
      );

      if (idx === -1) return error(404, "Address not found");

      // If marked as default, unset other defaults
      if (addressData.isDefault) {
        user.addresses.forEach((addr: IAddress) => (addr.isDefault = false));
      }

      // Update the specific address
      user.addresses[idx] = {
        ...user.addresses[idx].toObject(),
        ...addressData,
      };

      message = "Address updated successfully";
    } else {
      // Add new address (not first, no _id)
      if (addressData.isDefault) {
        user.addresses.forEach((addr: IAddress) => (addr.isDefault = false));
      }
      user.addresses.push(addressData);
      message = "Address added successfully";
    }

    // Save user
    await user.save();

    return success(200, { message, addresses: user.addresses });
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
    user.addresses = user.addresses.filter(
      (addr: IAddress) => addr._id?.toString() !== addressId
    );

    // If the deleted address was default, assign another one as default
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true; // pick the first one as default
    }

    await user.save();
    return success(200, {
      message: "Address removed successfully",
      addresses: user.addresses,
    });
  } catch (e) {
    console.log(e);
    return error(500, "Something went wrong.");
  }
}
