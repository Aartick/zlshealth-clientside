import { error, success } from "@/utils/responseWrapper";
import { NextRequest } from "next/server";
import crypto from "crypto";
import { instance } from "@/utils/razorpayInstance";

export async function POST(req: NextRequest) {
  try {
    const { amount } = await req.json();

    // Validate amount is provided
    if (!amount) {
      return error(400, "Amount is required.");
    }

    // Validate amount is a positive number
    if (typeof amount !== "number" || amount <= 0) {
      return error(400, "Amount must be a positive number.");
    }

    // Validate amount is not too large (max 1 crore rupees = 10,000,000)
    if (amount > 10000000) {
      return error(400, "Amount exceeds maximum limit.");
    }

    const options = {
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    const order = await instance.orders.create(options);

    return success(200, order);
  } catch (e) {
    console.error("Error creating payment order:", e);
    return error(500, "Something went wrong.");
  }
}
