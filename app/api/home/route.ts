import dbConnect from "@/dbConnect/dbConnect";
import Product from "@/models/Product";
import User from "@/models/User";
import { error, success } from "@/utils/responseWrapper";

export async function GET() {
  try {
    await dbConnect();

    const users = await User.countDocuments();
    const products = await Product.countDocuments();

    return success(200, { users, products, years: 8 });
  } catch (e) {
    console.log(e);
    return error(500, "Something went wrong.");
  }
}
