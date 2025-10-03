import Product from "@/models/Product";
import { error, success } from "@/utils/responseWrapper";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

/**
 * @description - Fetch similar products.
 * 1. If `productId` is provided → find products similar to that product.
 * 2. Else fallback to category/productTypes/benefits filters.
 * 3. Sort by relevance (category > productTypes > benefits).
 * 4. Limit results (default 10).
 */
export async function GET(req: NextRequest) {
  // Extract query params from request URL
  const { searchParams } = new URL(req.url);

  try {
    // Product ID of the product currently being viewed (optional)
    const productId = searchParams.get("productId");

    // Limit for how many products to return (default: 10)
    const limit = Number(searchParams.get("limit")) || 10;

    let products; // Will hold the final list of products

    // If productId is passed → fetch products similar to this one
    if (productId && mongoose.Types.ObjectId.isValid(productId)) {
      // Fetch the product the user is currently viewing
      const baseProduct = await Product.findById(productId);

      // If product not found → return error
      if (!baseProduct) {
        return error(404, "Product not found.");
      }

      // Use MongoDB aggregation to find similar products
      products = await Product.aggregate([
        {
          // Exclude the current product itself and match similar candidates
          $match: {
            _id: { $ne: baseProduct._id }, // exclude current product
            $or: [
              { category: baseProduct.category }, // same category
              { productTypes: { $in: baseProduct.productTypes } }, // same product types
              { benefits: { $in: baseProduct.benefits } }, // same benefits
            ],
          },
        },
        {
          // Add a computed "relevance" score to each product
          $addFields: {
            relevance: {
              $add: [
                // +3 points if category matches
                {
                  $cond: [{ $eq: ["$category", baseProduct.category] }, 3, 0],
                },
                // +2 points if there is an overlap in productTypes
                {
                  $cond: [
                    {
                      $gt: [
                        {
                          $size: {
                            $setIntersection: [
                              "$productTypes",
                              baseProduct.productTypes,
                            ],
                          },
                        },
                        0,
                      ],
                    },
                    2,
                    0,
                  ],
                },
                // +1 point if there is an overlap in benefits
                {
                  $cond: [
                    {
                      $gt: [
                        {
                          $size: {
                            $setIntersection: [
                              "$benefits",
                              baseProduct.benefits,
                            ],
                          },
                        },
                        0,
                      ],
                    },
                    1,
                    0,
                  ],
                },
              ],
            },
          },
        },
        {
          // Sort products by highest relevance first
          $sort: { relevance: -1 },
        },
        {
          // Limit the number of returned products
          $limit: limit,
        },
      ]);
    } else {
      // If no productId → fallback to query param filters

      // Extract multiple query params
      const categories = searchParams.getAll("category");
      const productTypes = searchParams.getAll("productTypes");
      const benefits = searchParams.getAll("benefits");

      // Parse productIds to exclude (e.g., from cart or currently viewed)
      const excludeIds = searchParams.getAll("exclude"); // pass ?exclude=id1&exclude=id2
      const validExcludeIds = excludeIds.filter((id) =>
        mongoose.Types.ObjectId.isValid(id)
      );

      // Prepare conditions for OR filter
      const orConditions: Record<string, unknown>[] = [];

      // Category filter (support multiple)
      if (categories.length > 0) {
        const validCategories = categories.filter((id) =>
          mongoose.Types.ObjectId.isValid(id)
        );
        if (validCategories.length > 0) {
          orConditions.push({
            category: {
              $in: validCategories.map((id) => new mongoose.Types.ObjectId(id)),
            },
          });
        }
      }

      // Product types filter (support multiple)
      if (productTypes.length > 0) {
        const validProductTypes = productTypes.filter((id) =>
          mongoose.Types.ObjectId.isValid(id)
        );
        if (validProductTypes.length > 0) {
          orConditions.push({
            productTypes: {
              $in: validProductTypes.map(
                (id) => new mongoose.Types.ObjectId(id)
              ),
            },
          });
        }
      }

      // Benefits filter (support multiple)
      if (benefits.length > 0) {
        const validBenefits = benefits.filter((id) =>
          mongoose.Types.ObjectId.isValid(id)
        );
        if (validBenefits.length > 0) {
          orConditions.push({
            benefits: {
              $in: validBenefits.map((id) => new mongoose.Types.ObjectId(id)),
            },
          });
        }
      }

      // Build final filter (OR-based for recommendations)
      const filter: Record<string, unknown> =
        orConditions.length > 0 ? { $or: orConditions } : {};

      // Exclude already viewed/added products
      if (validExcludeIds.length > 0) {
        filter._id = {
          $nin: validExcludeIds.map((id) => new mongoose.Types.ObjectId(id)),
        };
      }

      // Use aggregation pipeline to randomize recommendations
      products = await Product.aggregate([
        { $match: filter },
        { $sample: { size: limit } }, // randomly pick 'limit' number of products
      ]);
    }

    // Return the list of products
    return success(200, products);
  } catch (e) {
    // Log error and return 500 response
    console.log(e);
    return error(500, "Something went wrong.");
  }
}
