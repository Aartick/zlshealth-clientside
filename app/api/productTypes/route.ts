import ProductType from "@/models/ProductType";
import { error, success } from "@/utils/responseWrapper";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        const productTypes = await ProductType.find()
        return NextResponse.json(success(200, productTypes))
    } catch (e) {
        console.log(e)
        return NextResponse.json(error(500, "Something went wrong."))
    }
}