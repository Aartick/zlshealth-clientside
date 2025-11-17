import Wishlist from "@/models/Wishlist";
import { verifyAccessToken } from "@/utils/authMiddleware";
import { error, success } from "@/utils/responseWrapper";
import { NextRequest } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/dbConnect/dbConnect";

interface WishlistProduct {
  productId: string;
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const { products } = await req.json();

    if (!Array.isArray(products)) {
      return error(400, "Products are required.");
    }

    // Verify JWT and extract user ID
    const { valid, response, _id } = await verifyAccessToken(req);
    if (!valid) return response!;

    // Normalize product IDs to ObjectIds
    const formattedProducts = products.map((p: WishlistProduct) => ({
      productId: new mongoose.Types.ObjectId(p.productId),
    }));

    const wishlist = await Wishlist.findOne({ customerId: _id });

    if (!wishlist) {
      // Create new wishlist if not exists
      await Wishlist.create({
        customerId: _id,
        products: formattedProducts,
      });
    } else {
      // Build set of existing product IDs
      const existingIds = new Set(
        wishlist.products.map((p: WishlistProduct) => p.productId.toString())
      );

      // Filter new unique products
      const uniqueNewProducts = formattedProducts.filter(
        (id) => !existingIds.has(id.productId.toString())
      );

      if (uniqueNewProducts.length === 0) {
        return success(200, "Nothing to merge.");
      }

      // Append unique products
      uniqueNewProducts.forEach((id) => {
        wishlist.products.push(id);
      });

      await wishlist.save();
    }

    return success(200, "Wishlist merged successfully");
  } catch (e) {
    console.log(e);
    return error(500, "Something went wrong while merging wishlist.");
  }
}
