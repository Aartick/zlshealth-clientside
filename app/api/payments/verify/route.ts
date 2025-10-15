import { error, success } from "@/utils/responseWrapper";
import { NextRequest } from "next/server";
import crypto from "crypto";
import Order from "@/models/Order";
import { instance } from "@/utils/razorpayInstance";

export async function POST(req: NextRequest) {
  try {
    const orderId = req.nextUrl.searchParams.get("orderId");

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
    } = await req.json();

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !amount
    ) {
      return error(400, "Invalid payment data");
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return error(400, "Payment verification failed!");
    }

    const order = await Order.findOne({ orderId });

    if (!order) {
      return error(400, "Order not found!");
    }

    const paymentDetails = await instance.payments.fetch(razorpay_payment_id);
    const paymentMethod = paymentDetails.method;

    order.paymentStatus = "Completed";
    order.paymentId = razorpay_payment_id;
    order.paymentOrderId = razorpay_order_id;
    order.paymentAmount = amount;
    order.paymentDate = new Date();
    order.paymentMethod =
      paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1);

    await order.save();

    const orderSummary = {
      orderId: order.orderId,
      date: order.createdAt,
      paymentMethod: order.paymentMethod,
    };

    return success(200, orderSummary);
  } catch (e) {
    console.log(e);
    return error(500, "Something went wrong.");
  }
}
