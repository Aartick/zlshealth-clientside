import Review from "@/models/Review";
import { verifyAccessToken } from "@/utils/authMiddleware";
import { error, success } from "@/utils/responseWrapper";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

async function updateProductRating(productId: string) {
  const result = await Review.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId) } },
    {
      $group: {
        _id: "$product",
        avgRating: { $avg: "$rating" },
        numReviews: { $sum: 1 },
      },
    },
  ]);

  await mongoose.model("Product").findByIdAndUpdate(productId, {
    averageRating: result.length > 0 ? result[0].avgRating : 0,
    numReviews: result.length > 0 ? result[0].numReviews : 0,
  });
}

export async function POST(req: NextRequest) {
  try {
    const { valid, response, _id } = await verifyAccessToken(req);
    if (!valid) return response!;

    const { productId, rating, comment } = await req.json();

    if (!productId || !rating || !comment) {
      return error(400, "Product ID and rating are required.");
    }

    if (
      typeof rating !== "number" ||
      !Number.isFinite(rating) ||
      rating < 1 ||
      rating > 5
    ) {
      return error(400, "Rating must be an integer between 1 and 5.");
    }

    const review = await Review.create({
      user: _id,
      product: productId,
      rating,
      comment,
    });

    await updateProductRating(productId);

    return success(201, review);
  } catch (e: any) {
    if (e.code === 11000) {
      return error(400, "You have already reviewed this product.");
    }
    return error(500, "Something went wrong.");
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { valid, response } = await verifyAccessToken(req);
    if (!valid) return response!;

    const { searchParams } = new URL(req.url);
    const reviewId = searchParams.get("reviewId");

    if (!reviewId) {
      return error(400, "Review ID is required.");
    }

    const deletedReview = await Review.findByIdAndDelete(reviewId);

    if (!deletedReview) {
      return error(404, "Review not found.");
    }

    await updateProductRating(deletedReview.product.toString());

    return success(200, "Review deleted successfully.");
  } catch (e) {
    console.log(e);
    return error(500, "Something went wrong.");
  }
}
