import Blog from "@/models/Blogs";
import { verifyAccessToken } from "@/utils/authMiddleware";
import { error, success } from "@/utils/responseWrapper";
import { NextRequest } from "next/server";

/**
 * @route /api/blogs/:id
 * @description - Add a comment to a specific blog post
 * @param req - {NextRequest} Next.js request object
 * @param param - route params containing the blog ID
 * @returns - success or error response
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify access token and extract user ID
    const { valid, response, _id } = await verifyAccessToken(req);
    if (!valid) return response!;

    // Extract comment text from request body
    const { text } = await req.json();

    // Find the blog by ID
    const blog = await Blog.findById(params.id);
    if (!blog) {
      return error(404, "Blog not found.");
    }

    // Add new comment to the blog's comments array
    blog.comments.push({
      user: _id,
      text,
      createdAt: new Date(),
    });

    // save the updated blog document
    await blog.save();

    return success(200, "Comment added successfully.");
  } catch (e) {
    console.log(e);
    return error(500, "Somthing went wrong.");
  }
}
