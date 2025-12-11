import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/dbConnect/dbConnect";
import Coupon from "@/models/Coupon";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { status: "error", statusCode: 400, result: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const { code, cartTotal } = body as {
      code?: string;
      cartTotal?: number;
    };

    if (!code) {
      return NextResponse.json(
        { status: "error", statusCode: 400, result: "Coupon code is required" },
        { status: 400 }
      );
    }

    const normalizedCode = String(code).trim().toUpperCase();

    const coupon = await Coupon.findOne({ code: normalizedCode });

    if (!coupon) {
      return NextResponse.json(
        { status: "error", statusCode: 404, result: "Invalid coupon code" },
        { status: 404 }
      );
    }

    // Optional: server-side minimum order validation
    if (typeof cartTotal === "number") {
      const minOrder = Number(coupon.minOrderAmount) || 0;
      if (cartTotal < minOrder) {
        return NextResponse.json(
          {
            status: "error",
            statusCode: 400,
            result: `Minimum order amount for this coupon is ₹${minOrder}`,
          },
          { status: 400 }
        );
      }
    }

    // Normalize numeric fields (defensive)
    const discountPercentage = Number(coupon.discountPercentage) || 0;
    const maxDiscountAmount =
      Number(coupon.maxDiscountAmount) || discountPercentage;
    const minOrderAmount = Number(coupon.minOrderAmount) || 0;

    // You can compute recommended discount here if you want,
    // but in your current frontend you compute it yourself.
    return NextResponse.json(
      {
        status: "ok",
        statusCode: 200,
        result: {
          _id: coupon._id,
          code: coupon.code,
          discountPercentage,
          maxDiscountAmount,
          minOrderAmount,
          createdAt: coupon.createdAt,
          updatedAt: coupon.updatedAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST /api/validateCoupon error:", error);
    return NextResponse.json(
      {
        status: "error",
        statusCode: 500,
        result: "Failed to validate coupon",
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
