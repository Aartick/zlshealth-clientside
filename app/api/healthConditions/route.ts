import HealthConditions from "@/models/HealthCondition";
import { error, success } from "@/utils/responseWrapper";

export async function GET() {
  try {
    const productTypes = await HealthConditions.find();
    const limitedProductTypes = productTypes.slice(0, 5);
    return success(200, limitedProductTypes);
  } catch (e) {
    console.log(e);
    return error(500, "Something went wrong while getting health conditions.");
  }
}
