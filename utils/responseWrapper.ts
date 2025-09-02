import { NextResponse } from "next/server";

/**
 * @function success
 * @description Wraps successful responses in a consistent JSON structure.
 * @param {number} statusCode - HTTP status code (e.g., 200, 201).
 * @param {any} result - The payload or data to return.
 * @returns - JSON response with 'status: "ok"'
 */
export function success(statusCode: number, result: any) {
  return NextResponse.json({
    status: "ok",
    statusCode,
    result,
  });
}

/**
 * @function error
 * @description Wraps error responses in a consistent JSON structure.
 * @param {number} statusCode - HTTP error code (e.g., 400, 500).
 * @param {any} result - The error message or details.
 * @returns - JSON response with 'status: "error"'.
 */
export function error(statusCode: number, result: any) {
  return NextResponse.json({
    status: "error",
    statusCode,
    result,
  });
}
