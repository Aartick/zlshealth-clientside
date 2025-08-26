import Benefit from "@/models/Benefits";
import { error, success } from "@/utils/responseWrapper";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const productTypes = await Benefit.find();
    return NextResponse.json(success(200, productTypes));
  } catch (e) {
    console.log(e);
    return NextResponse.json(error(500, "Something went wrong."));
  }
}
