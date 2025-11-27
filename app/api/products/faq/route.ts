import Faqs from "@/models/Faqs";
import { error, success } from "@/utils/responseWrapper";
import { NextRequest } from "next/server";

/**
 * @method GET
 * @route /api/faq?productId=productId
 * @description Get FAQs for a specific product
 * @access Private
 * @param req
 * @returns FAQs or error message
 */
export async function GET(req: NextRequest) {
  try {
    // Extract productId from query parameters
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");
    
    if (!productId) {
      return error(400, "Product ID is required.");
    }

    // Find FAQs for the specified product
    const faqs = await Faqs.findOne({ productId });
    
    // Return the found FAQs
    return success(200, faqs);
  } catch (e) {
    console.log(e); // Handles any unexpected errors
    return error(500, "Something went wrong.");
  }
}
