import dbConnect from "@/dbConnect/dbConnect";
import Blog from "@/models/Blogs";
import { error, success } from "@/utils/responseWrapper";
import { NextRequest } from "next/server";

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
      return error(404, "Blog not found.");
    }

    return success(200, blog);
  } catch (e) {
    console.log(e);
    return error(500, "Somthing went wrong.");
  }
}
