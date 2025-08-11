import Category from "@/models/Category";
import Product from "@/models/Product";
import { verifyAccessToken } from "@/utils/authMiddleware";
import { error, success } from "@/utils/responseWrapper";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { valid, response } = await verifyAccessToken(req);
    if (!valid) return response!;

    const {
      categoryName,
      name,
      imageUrl,
      price,
      quantity,
      shortDescription,
      highlights,
      sku,
      brand,
      additionalInfo,
      appliedFor,
    } = await req.json();

    if (
      !categoryName ||
      !name ||
      !imageUrl ||
      !price ||
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
      return NextResponse.json(error(400, "All fields are required."));
    }

    const category = await Category.findOne({ name: categoryName });
    console.log("Category", category);
    if (!category) {
      return NextResponse.json(error(404, "No such category found."));
    }

    const product = await Product.create({
      category: category._id,
      name,
      imageUrl,
      price,
      quantity,
      shortDescription,
      highlights,
      sku,
      brand,
      additionalInfo,
      appliedFor,
    });

    category.products.push(product._id);
    await category.save();

    return NextResponse.json(success(201, "Product created successfully."));
  } catch (e) {
    console.log(e);
    return NextResponse.json(error(500, "Something went wrong."));
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  if (!type) {
    return NextResponse.json(error(404, "Type is required."));
  }

  try {
    const { valid, response } = await verifyAccessToken(req);
    if (!valid) return response!;

    if (type === "all") {
      const products = await Product.find()
        .populate("description")
        .populate("faqs");

      return NextResponse.json(success(200, products));
    } else if (type === "productId") {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get("id");

      if (!id) {
        return NextResponse.json(error(400, "Invalid Product Id."));
      }

      const product = await Product.findById(id)
        .populate("description")
        .populate("faqs");

      if (!product) {
        return NextResponse.json(error(404, "Product not found."));
      }

      return NextResponse.json(success(200, product));
    }
  } catch (e) {
    console.log(e);
    return NextResponse.json(error(500, "Something went wrong."));
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { valid, response } = await verifyAccessToken(req);
    if (!valid) return response!;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const body = await req.json();

    if (!id) {
      return NextResponse.json(error(400, "Product Id is required."));
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(error(400, "Invalid Product ID."));
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return NextResponse.json(error(404, "Product not found"));
    }

    return NextResponse.json(success(200, "Product updated successfully"));
  } catch (e) {
    console.log(e);
    return NextResponse.json(error(500, "Something went wrong."));
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { valid, response } = await verifyAccessToken(req);
    if (!valid) return response!;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(error(400, "Product ID is required."));
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(error(400, "Invalid Product ID."));
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json(error(404, "Product not found."));
    }

    return NextResponse.json(success(200, "Product deleted successfully."));
  } catch (e) {
    console.log(e);
    return NextResponse.json(error(500, "Something went wrong."));
  }
}
