import dbConnect from "@/dbConnect/dbConnect";
import HealthConditions from "@/models/HealthCondition";
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

  const rand = await HealthConditions.find();

  if (healthCondition === "Digestive") {
    healthCondition = rand[0]?._id;
  }

  try {
    const query = {
      healthConditions: { $in: [healthCondition] },
    };

    let products = [];

    try {
      // Try performing the query
      const baseQuery = Product.find(query);

      products = limit
        ? await baseQuery.limit(4).lean()
        : await baseQuery.lean();
    } catch (mongoErr) {
      console.log("MongoDB Query Error → returning empty array:", mongoErr);
      return success(200, []);
    }

    return success(200, products);
  } catch (e) {
    console.log(e);
    return error(500, "Something went wrong.");
  }
}
