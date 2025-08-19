import Benefit from "@/models/Benefits";
import { verifyAccessToken } from "@/utils/authMiddleware";
import { error, success } from "@/utils/responseWrapper";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { valid, response } = await verifyAccessToken(req);
    if (!valid) return response!;

    const { name } = await req.json();

    if (!name) {
      return NextResponse.json(error(400, "Benefit name is required."));
    }

    await Benefit.create({ name });

    return NextResponse.json(success(201, "Benefit created successfully."));
  } catch (e) {
    console.log(e);
    return NextResponse.json(error(500, "Something went wrong."));
  }
}

export async function GET(req: NextRequest) {
  try {
    const productTypes = await Benefit.find();
    return NextResponse.json(success(200, productTypes));
  } catch (e) {
    console.log(e);
    return NextResponse.json(error(500, "Something went wrong."));
  }
}
