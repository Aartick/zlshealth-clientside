import { error, success } from "@/utils/responseWrapper";
import Category from "@/models/Category";

export async function GET() {
  try {
    const categories = await Category.find();
    return success(200, categories);
  } catch (e) {
    console.log(e);
    return error(500, "Something went wrong.");
  }
}
