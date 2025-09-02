import dbConnect from "@/dbConnect/dbConnect";
import Product from "@/models/Product";
import User from "@/models/User";
import { error, success } from "@/utils/responseWrapper";

/**
 * @route GET /api/home
 * @returns success containing users, products and years count
 */
export async function GET() {
  try {
    await dbConnect(); // make sure db connection

    const users = await User.countDocuments(); // return the number of users registered
    const products = await Product.countDocuments(); //return the number of products available

    return success(200, { users, products, years: 8 });
  } catch (e) {
    console.log(e);
    return error(500, "Something went wrong.");
  }
}
