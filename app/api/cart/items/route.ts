import dbConnect from "@/dbConnect/dbConnect";
import Cart from "@/models/Cart";
import { verifyAccessToken } from "@/utils/authMiddleware";
import { error, success } from "@/utils/responseWrapper";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const { valid, response, _id } = await verifyAccessToken(req);
    if (!valid) return response!;

    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json(error(400, "Product ID is required."));
    }

    await dbConnect();

    let cart = await Cart.findOne({ customerId: _id });

    if (!cart) {
      return NextResponse.json(error(404, "Cart not found."));
    }

    const productIndex = cart.products.findIndex(
      (p: any) => p.productId.toString() === productId
    );

    if (productIndex === -1) {
      return NextResponse.json(error(404, "Product not found in cart."));
    }

    cart.products[productIndex].items -= 1;

    if (cart.products[productIndex].items <= 0) {
      cart.products.splice(productIndex, 1);
    }

    await cart.save();

    return NextResponse.json(success(200, "Product quantity updated."));
  } catch (e) {
    console.error(e);
    return NextResponse.json(error(500, "Something went wrong."));
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { valid, response, _id } = await verifyAccessToken(req);
    if (!valid) return response!;

    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json(error(400, "Product ID is required."));
    }

    await dbConnect();

    const cart = await Cart.findOne({ customerId: _id });
    if (!cart) {
      return NextResponse.json(error(404, "Cart not found."));
    }

    const productIndex = cart.products.findIndex(
      (p: any) => p.productId.toString() === productId
    );

    if (productIndex === -1) {
      return NextResponse.json(error(404, "Product not found in cart."));
    }

    cart.products.splice(productIndex, 1);

    await cart.save();

    return NextResponse.json(success(200, "Product removed from cart."));
  } catch (e) {
    console.error(e);
    return NextResponse.json(error(500, "Something went wrong."));
  }
}
