import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect/dbConnect";
import Coupon from "@/models/Coupon";

/**
 * GET /api/coupons
 * Fetches all available coupons
 */
export async function GET() {
  try {
    await dbConnect();

    // Fetch all coupons, sorted by discount percentage (highest first)
    const coupons = await Coupon.find({})
      .sort({ discountPercentage: -1 })
      .select('code discountPercentage maxDiscountAmount minOrderAmount createdAt updatedAt');

    return NextResponse.json(
      {
        status: "ok",
        statusCode: 200,
        result: coupons,
        count: coupons.length
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/coupons error:", error);
    return NextResponse.json(
      {
        status: "error",
        statusCode: 500,
        result: "Failed to fetch coupons",
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
