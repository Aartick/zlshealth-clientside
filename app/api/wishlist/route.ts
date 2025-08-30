import Wishlist from "@/models/Wishlist";
import { verifyAccessToken } from "@/utils/authMiddleware";
import { error, success } from "@/utils/responseWrapper";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { productId } = await req.json();

    if (!productId) {
      return error(400, "Product ID is required.");
    }

    const { valid, response, _id } = await verifyAccessToken(req);
    if (!valid) return response!;

    let wishlist = await Wishlist.findOne({ customerId: _id });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        customerId: _id,
        products: [{ productId: new mongoose.Types.ObjectId(productId) }],
      });
    } else {
      const existingProduct = wishlist.products.find(
        (p: any) => p.productId.toString() === productId
      );

      if (!existingProduct) {
        wishlist.products.push({
          productId: new mongoose.Types.ObjectId(productId),
        });
        await wishlist.save();
      }
    }

    const updatedWishlist = await wishlist.populate("products.productId");

    const responseWrapper = updatedWishlist.products.map((pro: any) => {
      return {
        _id: pro.productId._id,
        name: pro.productId.name,
        img: pro.productId.imageUrl.url,
        price: pro.productId.price,
        discount: pro.productId.discount,
      };
    });

    return success(201, responseWrapper);
  } catch (e) {
    console.log(e);
    return error(500, "Something went wrong");
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { productId } = await req.json();

    if (!productId) {
      return error(400, "Product ID is required.");
    }

    const { valid, response, _id } = await verifyAccessToken(req);
    if (!valid) return response!;

    let wishlist = await Wishlist.findOne({ customerId: _id });

    if (!wishlist) {
      return error(404, "Wishlist not found.");
    }

    const productIndex = wishlist.products.findIndex(
      (p: any) => p.productId.toString() === productId
    );

    if (productIndex === -1) {
      return error(404, "Product not found in wishlist.");
    }

    wishlist.products.splice(productIndex, 1);
    await wishlist.save();

    const updatedWishlist = await wishlist.populate("products.productId");

    const responseWrapper = updatedWishlist.products.map((pro: any) => ({
      _id: pro.productId._id,
      name: pro.productId.name,
      img: pro.productId.imageUrl?.url,
      price: pro.productId.price,
      discount: pro.productId.discount,
    }));

    return success(200, responseWrapper);
  } catch (e) {
    console.log(e);
    return error(500, "Something went wrong");
  }
}

export async function GET(req: NextRequest) {
  try {
    const { valid, response, _id } = await verifyAccessToken(req);
    if (!valid) return response!;

    const cart = await Wishlist.findOne({ customerId: _id }).populate(
      "products.productId"
    );

    if (!cart) {
      return error(404, "Wishlist not found.");
    }

    const responseWrapper = cart.products.map((pro: any) => {
      return {
        _id: pro.productId._id,
        name: pro.productId.name,
        img: pro.productId.imageUrl.url,
        price: pro.productId.price,
        discount: pro.productId.discount,
      };
    });

    return success(201, responseWrapper);
  } catch (e) {
    console.error(e);
    return error(500, "Something went wrong.");
  }
}
