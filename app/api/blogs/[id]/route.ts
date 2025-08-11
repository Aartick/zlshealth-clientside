import dbConnect from "@/dbConnect/dbConnect";
import Blog from "@/models/Blogs";
import { verifyAccessToken } from "@/utils/authMiddleware";
import { error, success } from "@/utils/responseWrapper";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const blog = await Blog.findById(params.id)
      .populate("category", "name")
      .populate("author", "name email")
      .populate("comments.user", "name email");

    if (!blog) {
      return NextResponse.json(error(404, "Blog not found."));
    }

    return NextResponse.json(success(200, blog));
  } catch (e) {
    console.log(e);
    return NextResponse.json(error(500, "Somthing went wrong."));
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { valid, response, _id } = await verifyAccessToken(req);
    if (!valid) return response!;

    await dbConnect();

    const blog = await Blog.findById(params.id);
    if (!blog) {
      return NextResponse.json(error(404, "Blog not found."));
    }

    if (blog.author.toString() !== _id) {
      return NextResponse.json(
        error(403, "You are not allowed to update this blog.")
      );
    }

    const body = await req.json();

    await Blog.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json(success(200, "Blog updated successfully."));
  } catch (e) {
    console.log(e);
    return NextResponse.json(error(500, "Something went wrong."));
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { valid, response, _id } = await verifyAccessToken(req);
    if (!valid) return response!;
    await dbConnect();

    const blog = await Blog.findById(params.id);
    if (!blog) {
      return NextResponse.json(error(404, "Blog not found."));
    }

    if (blog.author.toString() !== _id) {
      return NextResponse.json(
        error(403, "You are not allowed to delete this blog.")
      );
    }

    const deletedBlog = await Blog.findByIdAndDelete(params.id);

    if (!deletedBlog) {
      return NextResponse.json(error(404, "Blog not found"));
    }

    return NextResponse.json(success(200, "Blog deleted successfully."));
  } catch (e) {
    console.log(e);
    return NextResponse.json(error(500, "Somthing went wrong."));
  }
}
