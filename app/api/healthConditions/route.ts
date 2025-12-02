import HealthConditions from "@/models/HealthCondition";
import { error, success } from "@/utils/responseWrapper";
import dbConnect from "@/dbConnect/dbConnect";

export async function GET() {
  try {
    await dbConnect();
    const productTypes = await HealthConditions.find();
    const limitedProductTypes = productTypes.slice(0, 5);
    return success(200, limitedProductTypes);
  } catch (e) {
    console.error("Error fetching health conditions:", e);
    return error(500, "Something went wrong while getting health conditions.");
  }
}
