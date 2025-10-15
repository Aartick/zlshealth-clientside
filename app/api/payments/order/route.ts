import { error, success } from "@/utils/responseWrapper";
import { NextRequest } from "next/server";
import crypto from "crypto";
import Razorpay from "razorpay";

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const { amount } = await req.json();

    if (!amount) {
      return error(400, "Amount is required.");
    }

    const options = {
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    const order = await instance.orders.create(options);

    return success(200, order);
  } catch (e) {
    console.log(e);
    return error(500, "Something went wrong.");
  }
}
