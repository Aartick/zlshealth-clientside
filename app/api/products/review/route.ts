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

interface MongoError extends Error {
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
    await Review.create({
      user: _id,
      product: productId,
      rating,
      comment,
    });

    // Update product's average rating and review count
    await updateProductRating(productId);

    return success(201, "Review added successfully");
  } catch (e: unknown) {
    // Handle duplicate review (user already reviewed this product)
    const err = e as MongoError;
    if (err.code === 11000) {
      return error(400, "You have already reviewed this product.");
    }
    return error(500, "Something went wrong.");
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return error(400, "Product ID is required");

    const productObjectId = new mongoose.Types.ObjectId(id);

    // Fetch one random review
    const randomReviewPipeline = [
      { $match: { product: productObjectId } },
      { $sample: { size: 1 } },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          rating: 1,
          comment: 1,
          createdAt: 1,
          "user._id": 1,
          "user.fullName": 1,
        },
      },
    ];

    const [randomReview] = await Review.aggregate(randomReviewPipeline);

    // Rating stats pipeline
    const ratingStats = await Review.aggregate([
      { $match: { product: productObjectId } },
      {
        $group: {
          _id: "$rating", // group by rating 1-5
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } }, // Sort by rating (5 → 1)
    ]);

    // Get total reviews
    const totalReviews = ratingStats.reduce((acc, r) => acc + r.count, 0);

    // Build full structure (1-5 even if no count)
    const distribution = [5, 4, 3, 2, 1].map((rating) => {
      const found = ratingStats.find((r) => r._id === rating);
      const count = found?.count || 0;
      const percent =
        totalReviews === 0 ? 0 : Math.round((count / totalReviews) * 100);

      return {
        rating,
        count,
        percent,
      };
    });

    return success(200, {
      randomReview:
        randomReview === undefined
          ? {
              _id: "",
              rating: 0,
              comment: "",
              user: {
                _id: "",
                fullName: "",
              },
            }
          : randomReview,
      totalReviews,
      distribution,
    });
  } catch (e) {
    console.log(e);
    return error(500, "Failed to fetch review data");
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
