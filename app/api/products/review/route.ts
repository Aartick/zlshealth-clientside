import Review from "@/models/Review";
import { verifyAccessToken } from "@/utils/authMiddleware";
import { error, success } from "@/utils/responseWrapper";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

/**
 * Utility function to recalculate and update a product's
 * average rating and total number of reviews whenever a
 * review is added or deleted.
 *
 * @param productId - The ID of the product being reviewed
 */

async function updateProductRating(productId: string) {
  // Aggregate reviews for the given product
  const result = await Review.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId) } },
    {
      $group: {
        _id: "$product",
        avgRating: { $avg: "$rating" }, // calculate average rating
        numReviews: { $sum: 1 }, // count total reviews
      },
    },
  ]);

  // Update product document with new average rating and number of reviews
  await mongoose.model("Product").findByIdAndUpdate(productId, {
    averageRating: result.length > 0 ? result[0].avgRating : 0,
    numReviews: result.length > 0 ? result[0].numReviews : 0,
  });
}

/**
 * @route POST /api/products/review
 * @desc Create a new review for a product
 * @access Private (required a valid access token)
 * @param req
 * @returns
 */

interface MongoError extends Error{
  code?: number;
}

export async function POST(req: NextRequest) {
  try {
    // Verify JWT token and extract customer ID
    const { valid, response, _id } = await verifyAccessToken(req);
    if (!valid) return response!;

    // Extract data from request body
    const { productId, rating, comment } = await req.json();

    // Validate required fields
    if (!productId || !rating || !comment) {
      return error(400, "Product ID and rating are required.");
    }

    // Validate rating value (must be between 1 and 5)
    if (
      typeof rating !== "number" ||
      !Number.isFinite(rating) ||
      rating < 1 ||
      rating > 5
    ) {
      return error(400, "Rating must be an integer between 1 and 5.");
    }

    // Create a new review document
    const review = await Review.create({
      user: _id,
      product: productId,
      rating,
      comment,
    });

    // Update product's average rating and review count
    await updateProductRating(productId);

    return success(201, review);
  } catch (e: unknown) {
    // Handle duplicate review (user already reviewed this product)
    const err = e as MongoError
    if (err.code === 11000) {
      return error(400, "You have already reviewed this product.");
    }
    return error(500, "Something went wrong.");
  }
}

/**
 * @route DELETE /api/products?reviewId=<id>
 * @description Delete a review by its ID
 * @access Private (requires valid access token)
 * @param req
 * @returns
 */
export async function DELETE(req: NextRequest) {
  try {
    // Verify access token
    const { valid, response } = await verifyAccessToken(req);
    if (!valid) return response!;

    // Get reviewId from query parameters
    const { searchParams } = new URL(req.url);
    const reviewId = searchParams.get("reviewId");

    if (!reviewId) {
      return error(400, "Review ID is required.");
    }

    // Find and delete the review
    const deletedReview = await Review.findByIdAndDelete(reviewId);

    if (!deletedReview) {
      return error(404, "Review not found.");
    }

    // Update product rating after review deletion.
    await updateProductRating(deletedReview.product.toString());

    return success(200, "Review deleted successfully.");
  } catch (e) {
    console.log(e);
    return error(500, "Something went wrong.");
  }
}
