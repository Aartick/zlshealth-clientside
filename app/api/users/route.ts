import dbConnect from "@/dbConnect/dbConnect";
import User from "@/models/User";
import { verifyAccessToken } from "@/utils/authMiddleware";
import { error, success } from "@/utils/responseWrapper";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  try {
    const { valid, response, _id } = await verifyAccessToken(req);
    if (!valid) return response!;

    await dbConnect();
    if (type === "me") {
      const user = await User.findById(_id);

      if (!user) {
        return error(400, "No such user found.");
      }

      const responseWrapper = {
        _id: user._id || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        country: user.country || "",
        streetAddress: user.streetAddress || "",
        houseNo: user.houseNo || "",
        landmark: user.landmark || "",
        city: user.city || "",
        state: user.state || "",
        phone: user.phone || "",
        pinCode: user.pinCode || "",
        email: user.email || "",
      };

      return success(200, responseWrapper);
    } else if (type === "") {
      const user = await User.find();

      if (!user) {
        return error(400, "No user found.");
      }

      return success(200, user);
    }
  } catch (e) {
    console.log(e);
    return error(500, "Something went wrong.");
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { valid, response, _id } = await verifyAccessToken(req);
    if (!valid) return response!;

    await dbConnect();

    const {
      firstName,
      lastName,
      country,
      streetAddress,
      houseNo,
      landmark,
      city,
      state,
      phone,
      pinCode,
      email,
    } = await req.json();

    if (
      !firstName ||
      !lastName ||
      !country ||
      !streetAddress ||
      !landmark ||
      !city ||
      !state ||
      !phone ||
      !pinCode ||
      !email
    ) {
      return error(400, "All fields are required.");
    }

    await User.findByIdAndUpdate(
      _id,
      {
        firstName,
        lastName,
        country,
        streetAddress,
        houseNo,
        landmark,
        city,
        state,
        phone,
        pinCode,
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

export async function DELETE(req: NextRequest) {
  try {
    const { valid, response, _id } = await verifyAccessToken(req);
    if (!valid) return response!;

    await dbConnect();

    const deletedUser = await User.findByIdAndDelete(_id);

    if (!deletedUser) {
      return error(404, "User not found.");
    }

    return success(200, "User deleted successfully.");
  } catch (e) {
    console.log(e);
    return error(500, "Something went wrong.");
  }
}
