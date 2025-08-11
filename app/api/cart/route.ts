import dbConnect from "@/dbConnect/dbConnect";
import Cart from "@/models/Cart";
import { verifyAccessToken } from "@/utils/authMiddleware";
import { error, success } from "@/utils/responseWrapper";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { valid, response, _id } = await verifyAccessToken(req);
    if (!valid) return response!;

    const { productId, items, quantity } = await req.json();

    if (!productId || !items || !quantity) {
      return NextResponse.json(error(400, "All fields are required."));
    }

    await dbConnect();

    let cart = await Cart.findOne({ customerId: _id });

    if (!cart) {
      cart = await Cart.create({
        customerId: _id,
        products: [{ productId, items, quantity }],
      });
    } else {
      const existingProduct = cart.products.find(
        (p: any) => p.productId.toString() === productId
      );

      if (existingProduct) {
        existingProduct.items += items;
        existingProduct.quantity = quantity;
      } else {
        cart.products.push({ productId, items, quantity });
      }

      await cart.save();
    }

    return NextResponse.json(success(201, "Product added to cart."));
  } catch (e) {
    console.error(e);
    return NextResponse.json(error(500, "Something went wrong."));
  }
}

export async function GET(req: NextRequest) {
  try {
    const { valid, response, _id } = await verifyAccessToken(req);
    if (!valid) return response!;

    await dbConnect();

    const cart = await Cart.findOne({ customerId: _id }).populate(
      "products.productId"
    );

    if (!cart) {
      return NextResponse.json(error(404, "Cart not found."));
    }

    return NextResponse.json(success(200, cart));
  } catch (e) {
    console.error(e);
    return NextResponse.json(error(500, "Something went wrong."));
  }
}
