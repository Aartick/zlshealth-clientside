import dbConnect from "@/dbConnect/dbConnect";
import Blog from "@/models/Blogs";
import BlogCategory from "@/models/BlogsCategory";
import { verifyAccessToken } from "@/utils/authMiddleware";
import { error, success } from "@/utils/responseWrapper";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { valid, response, _id } = await verifyAccessToken(req);
    if (!valid) return response!;

    const { category, title, content, imageUrl } = await req.json();

    if (!category || !title || !Array.isArray(content) || imageUrl) {
      return NextResponse.json(error(400, "All fields are required."));
    }
    await dbConnect();

    const blogCategory = await BlogCategory.findOne({ name: category });

    if (!blogCategory) {
      return NextResponse.json(error(404, "No such blog category found."));
    }

    const blog = await Blog.create({
      category: blogCategory._id,
      title,
      content,
      imageUrl,
      author: _id,
    });

    blogCategory.blogs.push(blog._id);
    await blogCategory.save();

    return NextResponse.json(success(201, "Blog uploaded successfully."));
  } catch (e) {
    console.log(e);
    return NextResponse.json(error(500, "Somthing went wrong."));
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const blogs = await Blog.find()
      .populate("category", "name")
      .populate("author", "name email")
      .populate("comments.user", "name email")
      .sort({ postedOn: -1 });

    return NextResponse.json(success(200, blogs));
  } catch (e) {
    console.log(e);
    return NextResponse.json(error(500, "Somthing went wrong."));
  }
}
