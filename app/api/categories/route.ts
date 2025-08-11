import { error, success } from "@/utils/responseWrapper";
import { NextRequest, NextResponse } from "next/server";
import Category from "@/models/Category";
import { verifyAccessToken } from "@/utils/authMiddleware";

export async function POST(req: NextRequest) {
  try {
    const { valid, response } = await verifyAccessToken(req);
    if (!valid) return response!;

    const { name } = await req.json();

    if (!name) {
      return NextResponse.json(error(400, "Category name is required."));
    }

    await Category.create({ name });

    return NextResponse.json(success(201, "Category created successfully."));
  } catch (e) {
    console.log(e);
    return NextResponse.json(error(500, "Something went wrong."));
  }
}

export async function GET(req: NextRequest) {
  try {
    const { valid, response } = await verifyAccessToken(req);
    if (!valid) return response!;

    const categories = await Category.find();
    return NextResponse.json(success(200, categories));
  } catch (e) {
    console.log(e);
    return NextResponse.json(error(500, "Something went wrong."));
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { valid, response } = await verifyAccessToken(req);
    if (!valid) return response!;

    const { name } = await req.json();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(error(400, "Category id is required."));
    }

    if (!name) {
      return NextResponse.json(success(400, "Name is required."));
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return NextResponse.json(error(400, "Category not found."));
    }

    return NextResponse.json(success(200, updatedCategory));
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
      return NextResponse.json(error(400, "Category id is required."));
    }

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return NextResponse.json(error(404, "Category not found."));
    }

    return NextResponse.json(success(200, "Category deleted successfully."));
  } catch (e) {
    console.log(e);
    return NextResponse.json(error(500, "Something went wrong."));
  }
}
