import Product from "@/models/Product";
import Category from "@/models/Category";
import Benefit from "@/models/Benefits";
import HealthCondition from "@/models/HealthCondition";
import { error, success } from "@/utils/responseWrapper";
import { NextRequest } from "next/server";
import dbConnect from "@/dbConnect/dbConnect";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get("keyword");

  // If no keyword is provided, return empty array
  if (!keyword || keyword.trim() === "") {
    return success(200, []);
  }

  try {
    await dbConnect();

    // Search for matching categories, benefits, and health conditions
    const [matchingCategories, matchingBenefits, matchingHealthConditions] = await Promise.all([
      Category.find({ name: { $regex: keyword, $options: "i" } }).select("_id").lean(),
      Benefit.find({ name: { $regex: keyword, $options: "i" } }).select("_id").lean(),
      HealthCondition.find({ name: { $regex: keyword, $options: "i" } }).select("_id").lean()
    ]);

    const categoryIds = matchingCategories.map((c: { _id: unknown }) => c._id);
    const benefitIds = matchingBenefits.map((b: { _id: unknown }) => b._id);
    const healthConditionIds = matchingHealthConditions.map((h: { _id: unknown }) => h._id);

    // Use regex to perform a case-insensitive search across multiple fields
    const products = await Product.find({
      $or: [
        // Search by product name
        { name: { $regex: keyword, $options: "i" } },
        // Search by about/description
        { about: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        // Search by appliedFor/suitableFor
        { appliedFor: { $regex: keyword, $options: "i" } },
        { suitableFor: { $regex: keyword, $options: "i" } },
        // Search by matching category
        ...(categoryIds.length > 0 ? [{ category: { $in: categoryIds } }] : []),
        // Search by matching benefits
        ...(benefitIds.length > 0 ? [{ benefits: { $in: benefitIds } }] : []),
        // Search by matching health conditions
        ...(healthConditionIds.length > 0 ? [{ healthConditions: { $in: healthConditionIds } }] : []),
      ],
    })
    .populate("category", "name")
    .select("name productImg price discount about category")
    .limit(10)
    .lean();

    return success(200, products);
  } catch (e) {
    console.error("Error searching products:", e);
    return error(500, "Error searching products.");
  }
}
