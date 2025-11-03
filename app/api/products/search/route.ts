import Product from "@/models/Product";
import { error, success } from "@/utils/responseWrapper";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get("keyword");

  // If no keyword is provided, return 404 with empty array
  if (!keyword) {
    return error(404, []);
  }

  try {
    // Use regex to perform a case-insensitive search across multiple fields
    const products = await Product.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { about: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { appliedFor: { $regex: keyword, $options: "i" } },
        { suitableFor: { $regex: keyword, $options: "i" } },
        { healthConditions: { $regex: keyword, $options: "i" } },
      ],
    }).limit(10); // limit for performance

    return success(200, products);
  } catch (e) {
    console.log(e);
    return error(500, "Error search products.");
  }
}
