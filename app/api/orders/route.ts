import dbConnect from "@/dbConnect/dbConnect";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { verifyAccessToken } from "@/utils/authMiddleware";
import { error, success } from "@/utils/responseWrapper";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { valid, response, _id } = await verifyAccessToken(req);
    if (!valid) return response!;

    await dbConnect();

    const { products } = await req.json();

    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json(error(400, "At least one product is required."));
    }

    const productDetails = [];

    for (const item of products) {
      if (!item.productId || !item.quantity || !item.items) {
        return NextResponse.json(
          error(400, "Each product must have productId, items, and quantity.")
        );
      }

      const product = await Product.findById(item.productId);
      if (!product) {
        return NextResponse.json(
          error(404, `Product not found: ${item.productId}`)
        );
      }

      if (product.quantity < item.quantity) {
        return NextResponse.json(
          error(400, `Not enough stock for product: ${product.name}`)
        );
      }

      const totalAmount = product.price * item.items;

      productDetails.push({
        productId: product._id,
        items: item.items,
        quantity: item.quantity,
        totalAmount,
      });
    }

    await Order.create({
      customerId: _id,
      products: productDetails,
    });

    return NextResponse.json(success(201, "Ordered successfully."));
  } catch (e) {
    console.error(e);
    return NextResponse.json(error(500, "Something went wrong."));
  }
}

export async function GET(req: NextRequest) {
  try {
    const { valid, response, _id } = await verifyAccessToken(req);
    if (!valid) return response!;

    const orders = await Order.find({ customerId: _id })
      .populate({
        path: "products.productId",
        select: "name price imageUrl sku brand",
      })
      .sort({ createdAt: -1 });

    return NextResponse.json(success(200, orders));
  } catch (e) {
    console.log(e);
    return NextResponse.json(error(500, "Something went wrong."));
  }
}
