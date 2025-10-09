import { error, success } from "@/utils/responseWrapper";
import Category from "@/models/Category";
import dbConnect from "@/dbConnect/dbConnect";

/**
 * @route GET /api/categories
 * @returns all categories in db
 */
export async function GET() {
  try {
    await dbConnect();
    // Find all the categories in db
    const categories = await Category.find();
    return success(200, categories);
  } catch (e) {
    console.log(e);
    return error(500, "Something went wrong.");
  }
}
