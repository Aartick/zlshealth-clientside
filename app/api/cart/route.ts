import Cart from "@/models/Cart";
import { verifyAccessToken } from "@/utils/authMiddleware";
import { error, success } from "@/utils/responseWrapper";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { productId, quantity } = await req.json();

    if (!productId || !quantity) {
      return error(400, "All fields are required.");
    }

    const { valid, response, _id } = await verifyAccessToken(req);
    if (!valid) return response!;

    let cart = await Cart.findOne({ customerId: _id });

    if (!cart) {
      cart = await Cart.create({
        customerId: _id,
        products: [{ productId, quantity }],
      });
    } else {
      const existingProduct = cart.products.find(
        (p: any) => p.productId.toString() === productId
      );

      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        cart.products.push({ productId, quantity });
      }

      await cart.save();
    }

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

    return success(201, responseWrapper);
  } catch (e) {
    console.error(e);
    return error(500, "Something went wrong.");
  }
}

export async function GET(req: NextRequest) {
  try {
    const { valid, response, _id } = await verifyAccessToken(req);
    if (!valid) return response!;

    const cart = await Cart.findOne({ customerId: _id }).populate(
      "products.productId"
    );

    if (!cart) {
      return error(404, "Cart not found.");
    }

    const responseWrapper = cart.products.map((pro: any) => {
      return {
        _id: pro.productId._id,
        name: pro.productId.name,
        img: pro.productId.imageUrl.url,
        price: pro.productId.price,
        quantity: pro.quantity,
      };
    });

    return success(201, responseWrapper);
  } catch (e) {
    console.error(e);
    return error(500, "Something went wrong.");
  }
}
