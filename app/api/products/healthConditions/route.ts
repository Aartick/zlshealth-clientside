import dbConnect from "@/dbConnect/dbConnect";
import Product from "@/models/Product";
import { error, success } from "@/utils/responseWrapper";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  let healthCondition = searchParams.get("healthCondition");
  const limit = searchParams.get("limit");

  if (!healthCondition) {
    return error(404, "Health Condition is required.");
  }

  await dbConnect();

  if (healthCondition === "Digestive") {
    healthCondition = "Digestive & Gut Health";
  }

  try {
    const query = {
      healthConditions: { $in: [healthCondition] },
    };

    let products;

    if (limit) {
      // If limit is provided, (true or number), send up to 4 products
      products = await Product.find(query).limit(4).lean();
    } else {
      products = await Product.find(query).lean();
    }

    return success(200, products);
  } catch (e) {
    console.log(e);
    return error(500, "Something went wrong.");
  }
}
