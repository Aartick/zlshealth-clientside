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

      // Extract category, productTypes, benefits from query params
      const category = searchParams.get("category");
      const productTypes = searchParams.getAll("productTypes");
      const benefits = searchParams.getAll("benefits");

      // Build filter object dynamically
      const filter: Record<string, unknown> = {};

      // Category filter
      if (category && mongoose.Types.ObjectId.isValid(category)) {
        filter.category = new mongoose.Types.ObjectId(category);
      }

      // Product types filter (array of ObjectIds)
      if (productTypes.length > 0) {
        const validProductTypes = productTypes.filter((id) =>
          mongoose.Types.ObjectId.isValid(id)
        );
        if (validProductTypes.length > 0) {
          filter.productTypes = {
            $in: validProductTypes.map((id) => new mongoose.Types.ObjectId(id)),
          };
        }
      }

      // Benefits filter (array of ObjectIds)
      if (benefits.length > 0) {
        const validBenefits = benefits.filter((id) =>
          mongoose.Types.ObjectId.isValid(id)
        );
        if (validBenefits.length > 0) {
          filter.benefits = {
            $in: validBenefits.map((id) => new mongoose.Types.ObjectId(id)),
          };
        }
      }

      // Fetch products that match filters
      products = await Product.find(filter).limit(limit); // apply limit
    }

    // Return the list of products
    return success(200, products);
  } catch (e) {
    // Log error and return 500 response
    console.log(e);
    return error(500, "Something went wrong.");
  }
}
