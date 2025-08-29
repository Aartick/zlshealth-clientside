import dbConnect from "@/dbConnect/dbConnect";
import Blog from "@/models/Blogs";
import { error, success } from "@/utils/responseWrapper";

export async function GET() {
  try {
    await dbConnect();
    const blogs = await Blog.find()
      .populate("category", "name")
      .populate("author", "name email")
      .populate("comments.user", "name email")
      .sort({ postedOn: -1 });

    return success(200, blogs);
  } catch (e) {
    console.log(e);
    return error(500, "Somthing went wrong.");
  }
}
