import dbConnect from "@/dbConnect/dbConnect";
import Blog from "@/models/Blogs";
import { verifyAccessToken } from "@/utils/authMiddleware";
import { error, success } from "@/utils/responseWrapper";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { valid, response, _id } = await verifyAccessToken(req);
    if (!valid) return response!;

    await dbConnect();
    const { text } = await req.json();

    const blog = await Blog.findById(params.id);
    if (!blog) {
      return NextResponse.json(error(404, "Blog not found."));
    }

    blog.comments.push({
      user: _id,
      text,
      createdAt: new Date(),
    });

    await blog.save();

    return NextResponse.json(success(200, "Comment added successfully."));
  } catch (e) {
    console.log(e);
    return NextResponse.json(error(500, "Somthing went wrong."));
  }
}
