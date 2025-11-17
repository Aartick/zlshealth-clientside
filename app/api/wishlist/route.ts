import dbConnect from "@/dbConnect/dbConnect";
import Wishlist from "@/models/Wishlist";
import { verifyAccessToken } from "@/utils/authMiddleware";
import { error, success } from "@/utils/responseWrapper";
import mongoose, { Types } from "mongoose";
import { NextRequest } from "next/server";

interface ProductDoc {
  _id: Types.ObjectId;
  name: string;
  productImg: { url: string };
  price: number;
  discount: number;
  quantity: number;
  about: string;
}

interface WishlistProduct {
  productId: Types.ObjectId | ProductDoc;
  quantity: number;
}

/**
 * @route - POST /api/wishlist
 * @description - Add a product to the user's wishlist
 * @param req - NextRequest containing productId in JSON body
 * @returns - Updated wishlist with product details
 */

export async function POST(req: NextRequest) {
  try {
    const { productId } = await req.json();

    if (!productId) {
      return error(400, "Product ID is required.");
    }

    await dbConnect();

    // Verify JWT token and extract customer ID
    const { valid, response, _id } = await verifyAccessToken(req);
    if (!valid) return response!;

    // Find the user's wishlist in the database
    let wishlist = await Wishlist.findOne({ customerId: _id });

    if (!wishlist) {
      // If wishlist does not exist, creaet a new wishlist and add product
      wishlist = await Wishlist.create({
        customerId: _id,
        products: [{ productId: new mongoose.Types.ObjectId(productId) }],
      });
    } else {
      // If wishlist exists, check if product is already present
      const existingProduct = wishlist.products.find(
        (p: WishlistProduct) => p.productId.toString() === productId
      );

      if (!existingProduct) {
        // Add product to wishlist if not already present
        wishlist.products.push({
          productId: new mongoose.Types.ObjectId(productId),
        });
        await wishlist.save();
      }
    }

    // Populate product details for response
    const updatedWishlist = await wishlist.populate("products.productId");

    // Map wishlist products to response format
    const responseWrapper = updatedWishlist.products.map(
      (pro: WishlistProduct) => {
        const product = pro.productId as ProductDoc;
        return {
          _id: product._id,
          name: product.name,
          img: product.productImg.url,
          price: product.price,
          quantity: product.quantity,
          discount: product.discount,
          about: product.about,
        };
      }
    );

    return success(201, responseWrapper);
  } catch (e) {
    console.log(e);
    return error(500, "Something went wrong while adding to wishlist");
  }
}

/**
 * @route - PUT /api/wishlist
 * @description - Remove a product from the user's wishlist
 * @param req - NextRequest containing productId in JSON body
 * @returns - Updated wishlist without the removed product
 */
export async function PUT(req: NextRequest) {
  try {
    const { productId } = await req.json();

    if (!productId) {
      return error(400, "Product ID is required.");
    }

    await dbConnect();

    // Verify JWT token and extract customer ID
    const { valid, response, _id } = await verifyAccessToken(req);
    if (!valid) return response!;

    // Find user's wishlist
    const wishlist = await Wishlist.findOne({ customerId: _id });

    if (!wishlist) {
      return error(404, "Wishlist not found.");
    }

    // Find index of product to remove
    const productIndex = wishlist.products.findIndex(
      (p: WishlistProduct) => p.productId.toString() === productId
    );

    if (productIndex === -1) {
      return error(404, "Product not found in wishlist.");
    }

    // Remove product from wishlist
    wishlist.products.splice(productIndex, 1);
    await wishlist.save();

    // Populate remaining product details for response
    const updatedWishlist = await wishlist.populate("products.productId");

    // Map wishlist products to response format
    const responseWrapper = updatedWishlist.products.map(
      (pro: WishlistProduct) => {
        const product = pro.productId as ProductDoc;
        return {
          _id: product._id,
          name: product.name,
          img: product.productImg?.url,
          price: product.price,
          discount: product.discount,
          about: product.about,
          quantity: product.quantity,
        };
      }
    );

    return success(200, responseWrapper);
  } catch (e) {
    console.log(e);
    return error(500, "Something went wrong while removing form wishlist");
  }
}

/**
 * @route - GET /api/wishlist
 * @description - Retrieve all products in the user's wishlist
 * @param req - NextRequest with JWT token for user identification
 * @returns - List of wishlist products with details
 */
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    // Verify JWT token and extract customer ID
    const { valid, response, _id } = await verifyAccessToken(req);
    if (!valid) return response!;

    // Find users's wishlist
    const wishlist = await Wishlist.findOne({ customerId: _id }).populate(
      "products.productId"
    );

    if (!wishlist) {
      return success(200, []);
    }

    // Map wishlist products to response format
    const responseWrapper = wishlist?.products.map((pro: WishlistProduct) => {
      const product = pro.productId as ProductDoc;
      return {
        _id: product._id,
        name: product.name,
        img: product.productImg.url,
        price: product.price,
        discount: product.discount,
        about: product.about,
        quantity: product.quantity,
      };
    });

    return success(201, responseWrapper);
  } catch (e) {
    console.error(e);
    return error(500, "Something went wrong while getting wishlist.");
  }
}
