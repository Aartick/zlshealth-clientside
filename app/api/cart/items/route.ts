import dbConnect from "@/dbConnect/dbConnect";
import Cart from "@/models/Cart";
import { verifyAccessToken } from "@/utils/authMiddleware";
import { error, success } from "@/utils/responseWrapper";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { products } = await req.json();

    if (!products || !Array.isArray(products)) {
      return NextResponse.json(error(400, "Products are required"));
    }

    const { valid, response, _id } = await verifyAccessToken(req);
    if (!valid) return response!;

    let cart = await Cart.findOne({ customerId: _id });

    if (!cart) {
      cart = await Cart.create({
        customerId: _id,
        products,
      });
    } else {
      for (let p of products) {
        const existing = cart.products.find(
          (prod: any) => prod.productId.toString() === p.productId
        );
        if (existing) {
          existing.quantity += p.quantity;
        } else {
          cart.products.push(p);
        }
      }
      await cart.save();
    }

    return NextResponse.json(success(200, "Cart merged successfully."));
  } catch (e) {
    console.log(e);
    return NextResponse.json(error(500, "Something went wrong."));
  }
}

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

    cart.products[productIndex].quantity -= 1;

    if (cart.products[productIndex].quantity <= 0) {
      cart.products.splice(productIndex, 1);
    }

    await cart.save();

    const updatedCart = await cart.populate("products.productId");

    const responseWrapper = updatedCart.products.map((pro: any) => {
      return {
        _id: pro.productId._id,
        name: pro.productId.name,
        img: pro.productId.imageUrl.url,
        price: pro.productId.price,
        quantity: pro.quantity,
      };
    });

    return NextResponse.json(success(200, responseWrapper));
  } catch (e) {
    console.error(e);
    return NextResponse.json(error(500, "Something went wrong."));
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(error(400, "Product ID is required."));
    }

    const { valid, response, _id } = await verifyAccessToken(req);
    if (!valid) return response!;

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
