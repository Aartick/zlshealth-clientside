import ProductType from "@/models/ProductType";
import { error, success } from "@/utils/responseWrapper";

/**
 * @route GET /api/productTypes
 * @returns all product types available in db
 */
export async function GET() {
  try {
    // find all the product types from db
    const productTypes = await ProductType.find();
    return success(200, productTypes);
  } catch (e) {
    console.log(e);
    return error(500, "Something went wrong.");
  }
}
