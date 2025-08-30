import ProductType from "@/models/ProductType";
import { error, success } from "@/utils/responseWrapper";

export async function GET() {
  try {
    const productTypes = await ProductType.find();
    return success(200, productTypes);
  } catch (e) {
    console.log(e);
    return error(500, "Something went wrong.");
  }
}
