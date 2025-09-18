import Benefit from "@/models/Benefits";
import { error, success } from "@/utils/responseWrapper";

/**
 * @route GET /api/benefits
 * @returns all the benefits available in db
 */
export async function GET() {
  try {
    // find all the benefits from db
    const benefits = await Benefit.find();
    return success(200, benefits);
  } catch (e) {
    console.log(e);
    return error(500, "Something went wrong.");
  }
}
