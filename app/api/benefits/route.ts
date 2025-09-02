import Benefit from "@/models/Benefits";
import { error, success } from "@/utils/responseWrapper";

/**
 * @route GET /api/benefits
 * @returns all the product types available in db
 */
export async function GET() {
  try {
    // find all the benefits from db
    const productTypes = await Benefit.find();
    return success(200, productTypes);
  } catch (e) {
    console.log(e);
    return error(500, "Something went wrong.");
  }
}
