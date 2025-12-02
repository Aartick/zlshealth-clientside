import dbConnect from "@/dbConnect/dbConnect";
import Product from "@/models/Product";
import { error, success } from "@/utils/responseWrapper";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const healthCondition = searchParams.get("healthCondition");
  const limit = searchParams.get("limit");

  if (!healthCondition) {
    return error(400, "Health Condition is required.");
  }

  try {
    await dbConnect();

    const query = {
      healthConditions: { $in: [healthCondition] },
    };

    // Perform the query
    const baseQuery = Product.find(query);

    const products = limit
      ? await baseQuery.limit(4).lean()
      : await baseQuery.lean();

    return success(200, products);
  } catch (e) {
    console.error("Error fetching products by health condition:", e);
    return error(500, "Something went wrong while fetching products.");
  }
}
