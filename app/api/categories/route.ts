import { error, success } from "@/utils/responseWrapper";
import { NextResponse } from "next/server";
import Category from "@/models/Category";

export async function GET() {
  try {
    const categories = await Category.find();
    return NextResponse.json(success(200, categories));
  } catch (e) {
    console.log(e);
    return NextResponse.json(error(500, "Something went wrong."));
  }
}
