import dbConnect from "@/dbConnect/dbConnect";
import Blog from "@/models/Blogs";
import { error, success } from "@/utils/responseWrapper";

/**
 * @route GET /api/blogs/:id
 * @description Fetch a single blog by its ID along with related information
 * @param params - Route params containing blog id
 * @returns - Blog object with category, author, and comments populated
 */
export async function GET({ params }: { params: { id: string } }) {
  try {
    await dbConnect(); // Ensure database connection

    // Fetch blog by Id and populate related fields
    const blog = await Blog.findById(params.id)
      .populate("category", "name") // Include category name
      .populate("author", "name email") // Include author's name and email
      .populate("comments.user", "name email"); // Include name & email of users who commented

    if (!blog) {
      return error(404, "Blog not found."); // Return error if blog doesn't exist
    }

    return success(200, blog); // Return blog with success response
  } catch (e) {
    console.log(e);
    return error(500, "Somthing went wrong."); // Handle unexpected error
  }
}
