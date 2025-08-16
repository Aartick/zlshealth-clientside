import ProductType from "@/models/ProductType";
import { verifyAccessToken } from "@/utils/authMiddleware";
import { error, success } from "@/utils/responseWrapper";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { valid, response } = await verifyAccessToken(req);
    if (!valid) return response!;

    const { name } = await req.json();

    if (!name) {
      return NextResponse.json(error(400, "Product type name is required."));
    }

    await ProductType.create({ name });

    return NextResponse.json(
      success(201, "Product type created successfully.")
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json(error(500, "Something went wrong."));
  }
}

export async function GET(req: NextRequest){
    try {
        const productTypes = await ProductType.find()
        return NextResponse.json(success(200, productTypes))
    } catch (e) {
        console.log(e)
        return NextResponse.json(error(500, "Something went wrong."))
    }
}