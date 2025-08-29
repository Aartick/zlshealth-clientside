import dbConnect from "@/dbConnect/dbConnect";
import Order from "@/models/Order";
import { verifyAccessToken } from "@/utils/authMiddleware";
import { error, success } from "@/utils/responseWrapper";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { valid, response, _id } = await verifyAccessToken(req);
    if (!valid) return response!;

    await dbConnect();

    const order = await Order.findOne({
      _id: params.id,
      customerId: _id,
    }).populate({
      path: "products.productId",
      select: "name price imageUrl sku brand",
    });

    if (!order) {
      return error(404, "Order not found");
    }

    return success(200, order);
  } catch (e) {
    console.log(e);
    return error(500, "Something went wrong");
  }
}
