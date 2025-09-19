import Benefit from "@/models/Benefits";
import Category from "@/models/Category";
import Product from "@/models/Product";
import ProductType from "@/models/ProductType";
import { verifyAccessToken } from "@/utils/authMiddleware";
import { error, success } from "@/utils/responseWrapper";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

/**
 * @description - Create a new product.
 * 1. Verifies authentication token.
 * 2. Validates request body fields.
 * 3. Resolves related 'Category', 'ProductType', and 'Benefit' references.
 * 4. Creates product and updates category with reference.
 * @param req
 * @returns
 */

export async function POST(req: NextRequest) {
  try {
    // Verify JWT token
    const { valid, response } = await verifyAccessToken(req);
    if (!valid) return response!;

    // Extract fields from request body
    const {
      categoryName,
      productType,
      benefits,
      name,
      imageUrl,
      about,
      tags,
      price,
      discount,
      quantity,
      shortDescription,
      highlights,
      sku,
      brand,
      additionalInfo,
      appliedFor,
    } = await req.json();

    // Validate required fields
    if (
      !categoryName ||
      !productType ||
      !benefits ||
      !name ||
      !imageUrl.url ||
      !imageUrl.public_id ||
      !about ||
      !Array.isArray(tags) ||
      !price ||
      !discount ||
      !quantity ||
      !shortDescription ||
      !highlights ||
      !Array.isArray(highlights) ||
      !sku ||
      !brand ||
      !additionalInfo ||
      !appliedFor ||
      !Array.isArray(appliedFor)
    ) {
      return error(400, "All fields are required.");
    }

    // Resolve references
    const category = await Category.findOne({ name: categoryName });
    const prodTypeDocs = await ProductType.find({ name: { $in: productType } });
    const benefitDocs = await Benefit.find({ name: { $in: benefits } });

    if (!category) {
      return error(404, "No such category found.");
    }

    if (prodTypeDocs.length === 0) {
      return error(404, "No such product types found.");
    }

    if (benefitDocs.length === 0) {
      return error(404, "No such benefits found.");
    }

    // Create product
    const product = await Product.create({
      category: category._id,
      productTypes: prodTypeDocs.map((p) => p._id),
      benefits: benefitDocs.map((b) => b._id),
      name,
      imageUrl,
      about,
      tags,
      price,
      discount,
      quantity,
      shortDescription,
      highlights,
      sku,
      brand,
      additionalInfo,
      appliedFor,
    });

    // Update category reference
    category.products.push(product._id);
    await category.save();

    return success(201, "Product created successfully.");
  } catch (e) {
    console.log(e);
    return error(500, "Something went wrong.");
  }
}

/**
 * @description - Fetch products.
 * 1. Supports two modes:
 *    - 'type=all': Filter products by category, productTypes, and benefits.
 *    - 'type=productId': Fetch single product by ID.
 * @param req
 * @returns
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  if (!type) {
    return error(404, "Type is required.");
  }

  try {
    if (type === "all") {
      const category = searchParams.get("category");
      const productTypes = searchParams.getAll("productTypes");
      const benefits = searchParams.getAll("benefits");

      const filter: Record<string, unknown> = {};

      // Category filter
      if (category && mongoose.Types.ObjectId.isValid(category)) {
        filter.category = new mongoose.Types.ObjectId(category);
      }

      // Product types filter
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

      // Benefits filter
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

      // Find all the products according to filter ID's
      const products = await Product.find(filter)
        .populate("description")
        .populate("faqs");

      return success(200, products);
    } else if (type === "productId") {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get("id");

      if (!id) {
        return error(400, "Invalid Product Id.");
      }

      // Find the product details by ID
      const product = await Product.findById(id)
        .populate("description")
        .populate("faqs");

      if (!product) {
        return error(404, "Product not found.");
      }

      return success(200, product);
    }
  } catch (e) {
    console.log(e);
    return error(500, "Something went wrong.");
  }
}

/**
 * @description
 * Update a product by ID.
 * 1. Verfies authentication.
 * 2. Update the product
 * @param req
 * @returns
 */
export async function PUT(req: NextRequest) {
  try {
    // Verify JWT token
    const { valid, response } = await verifyAccessToken(req);
    if (!valid) return response!;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const body = await req.json();

    if (!id) {
      return error(400, "Product Id is required.");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return error(400, "Invalid Product ID.");
    }

    // Find the product by ID and update it and then returns the updated product.
    const updatedProduct = await Product.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return error(404, "Product not found");
    }

    return success(200, "Product updated successfully");
  } catch (e) {
    console.log(e);
    return error(500, "Something went wrong.");
  }
}

/**
 * @description 
 * Delete a product by ID.
 * 1. Verifies authentication.
 * 2. Deletes product and removes reference from its category.
 * @param req
 * @returns
 */
export async function DELETE(req: NextRequest) {
  try {
    const { valid, response } = await verifyAccessToken(req);
    if (!valid) return response!;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return error(400, "Product ID is required.");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return error(400, "Invalid Product ID.");
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return error(404, "Product not found.");
    }

    await Category.findByIdAndUpdate(deletedProduct.category, {
      $pull: { products: deletedProduct._id },
    });

    return success(200, "Product deleted successfully.");
  } catch (e) {
    console.log(e);
    return error(500, "Something went wrong.");
  }
}
