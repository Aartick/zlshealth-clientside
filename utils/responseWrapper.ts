import { NextResponse } from "next/server";

export function success(statusCode: number, result: any) {
  return NextResponse.json({
    status: "ok",
    statusCode,
    result,
  });
}

export function error(statusCode: number, result: any) {
  return NextResponse.json({
    status: "error",
    statusCode,
    result,
  });
}
