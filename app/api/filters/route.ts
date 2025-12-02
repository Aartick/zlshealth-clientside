import { error, success } from "@/utils/responseWrapper";
import Category from "@/models/Category";
import dbConnect from "@/dbConnect/dbConnect";
import Benefit from "@/models/Benefits";
import ProductType from "@/models/ProductType";

/**
 * @route GET /api/filters
 * @returns all categories, benefits, and productTypes from db
 */
export async function GET() {
  try {
    await dbConnect();
    // Find all the categories in db
    const categories = await Category.find();
    // find all the benefits from db
    const benefits = await Benefit.find();
    // find all the product types from db
    const productTypes = await ProductType.find();
    return success(200, { categories, benefits, productTypes });
  } catch (e) {
    console.log(e);
    return error(500, "Something went wrong getting filters.");
  }
}
