import dbConnect from "@/dbConnect/dbConnect";
import User from "@/models/User";
import { verifyAccessToken } from "@/utils/authMiddleware";
import { error, success } from "@/utils/responseWrapper";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

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
        return NextResponse.json(error(400, "No such user found."));
      }

      return NextResponse.json(success(200, user));
    } else if (type === "") {
      const user = await User.find();

      if (!user) {
        return NextResponse.json(error(400, "No user found."));
      }

      return NextResponse.json(success(200, user));
    }
  } catch (e) {
    console.log(e);
    return NextResponse.json(error(500, "Something went wrong."));
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
      displayName,
      VAT_Number,
      SSN_Number,
      GSTIN_Number,
      billingAddress,
      shippingAddress,
    } = await req.json();

    if (
      !firstName ||
      !lastName ||
      !displayName ||
      !VAT_Number ||
      !SSN_Number ||
      !GSTIN_Number ||
      !billingAddress ||
      !shippingAddress
    ) {
      return NextResponse.json(error(400, "All fields are required."));
    }

    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        firstName,
        lastName,
        displayName,
        VAT_Number,
        SSN_Number,
        GSTIN_Number,
        billingAddress,
        shippingAddress,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedUser) {
      return NextResponse.json(error(404, "User not found."));
    }

    return NextResponse.json(success(200, "Profile updated successfully"));
  } catch (e) {
    console.log(e);
    return NextResponse.json(error(500, "Something went wrong."));
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { valid, response, _id } = await verifyAccessToken(req);
    if (!valid) return response!;

    await dbConnect();

    const deletedUser = await User.findByIdAndDelete(_id);

    if (!deletedUser) {
      return NextResponse.json(error(404, "User not found."));
    }

    return NextResponse.json(success(200, "User deleted successfully."));
  } catch (e) {
    console.log(e);
    return NextResponse.json(error(500, "Something went wrong."));
  }
}
