import dbConnect from "@/dbConnect/dbConnect";
import Blog from "@/models/Blogs";
import { error, success } from "@/utils/responseWrapper";

/**
 * @route - GET /api/blogs
 * @description - Fetch all blogs from the database along with related information
 * @returns - List of blogs with category, author, and comments populated.
 */
export async function GET() {
  try {
    await dbConnect(); // Ensure database connection

    // Fetch all blogs and populate related fields
    const blogs = await Blog.find()
      .populate("category", "name") // Include category name
      .populate("author", "name email") // Include author's name and email
      .populate("comments.user", "name email") // Include name & email of users who commented
      .sort({ postedOn: -1 }); // Sort blogs by posted date (lates first)

    return success(200, blogs); // Return blogs with success response
  } catch (e) {
    console.log(e);
    return error(500, "Somthing went wrong."); // Handle unexpected error
  }
}
