import { error, success } from "@/utils/responseWrapper";
import { NextRequest } from "next/server";
import crypto from "crypto";
import Order from "@/models/Order";
import { instance } from "@/utils/razorpayInstance";
import { verifyAccessToken } from "@/utils/authMiddleware";
import { getShiprocketToken } from "@/utils/getShiprocketToken";
import Product from "@/models/Product";
import User from "@/models/User";
import { formatAddress } from "@/utils/formatAddress";
import axios from "axios";
import dbConnect from "@/dbConnect/dbConnect";

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    // Verify JWT token
    const { valid, response, _id } = await verifyAccessToken(req);
    if (!valid) return response!;

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      cart,
      address,
    } = await req.json();

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !amount ||
      !cart ||
      !address
    ) {
      return error(400, "Incomplete payment or order details.");
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return error(400, "Payment verification failed!");
    }

    // Verify payment in razorpay
    const paymentDetails = await instance.payments.fetch(razorpay_payment_id);
    const paymentMethod = paymentDetails.method;

    const productDetails = [];

    // Validate products in cart
    for (const item of cart) {
      if (!item._id || !item.quantity) {
        return error(400, "Each product must have productId and quantity.");
      }

      const product = await Product.findById(item._id);
      if (!product) {
        return error(404, `Product not found: ${item.name}`);
      }

      // Calculate total price for the product
      const totalAmount =
        product.price * item.quantity * (1 - product.discount / 100);

      productDetails.push({
        productId: product._id,
        name: product.name,
        sku: product.sku,
        quantity: item.quantity,
        totalAmount,
      });
    }

    // Get user details and Shiprocket token
    const user = await User.findById(_id);
    const token = await getShiprocketToken();

    // Calculate subtotal
    const sub_total = productDetails
      .reduce((acc, item) => acc + item.totalAmount, 0)
      .toFixed(2);

    // Create order in Shiprocket
    let shippingResponse;
    try {
      shippingResponse = await axios.post(
        "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
        {
          order_id: `ORD-${Date.now()}`,
          order_date: new Date().toISOString().slice(0, 16).replace("T", " "),
          channel_id: process.env.SHIPROCKET_CHANNEL_ID,
          billing_customer_name: address.fullName || user.fullName,
          billing_last_name: "",
          billing_address: `${formatAddress(address)}`,
          billing_city: address.cityTown,
          billing_pincode: Number(address.pinCode),
          billing_state: address.state,
          billing_country: "India",
          billing_email: address.email || user.email,
          billing_phone: Number(address.phone || user.phone),
          billing_alternate_phone: Number(user.phone || address.phone),
          shipping_is_billing: 1,
          order_items: productDetails.map((product) => ({
            name: product.name,
            sku: product.sku,
            units: product.quantity,
            selling_price: (product.totalAmount / product.quantity).toFixed(2),
          })),
          payment_method: "Prepaid",
          sub_total: sub_total,
          length: 10,
          breadth: 15,
          height: 20,
          weight: 2.5,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch {
      // console.error(
      //   "Shiprocket Error Response:",
      //   e.response?.data || e.message
      // );
      return error(500, "Something went wrong while making order");
    }

    // Save order in DB
    const order = await Order.create({
      customerId: _id,
      fullName: address.fullName,
      phone: address.phone || user.phone,
      email: address.email || user.email,
      landmark: address.landmark,
      streetAddressHouseNo: address.streetAddressHouseNo,
      streetAddress2: address.streetAddress2,
      addressType: address.addressType,
      cityTown: address.cityTown,
      state: address.state,
      pinCode: address.pinCode,
      orderId: shippingResponse.data.order_id,
      products: productDetails,
      paymentStatus: "Completed",
      paymentId: razorpay_payment_id,
      paymentOrderId: razorpay_order_id,
      paymentAmount: amount,
      paymentDate: new Date(),
      paymentMethod:
        paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1),
    });

    const orderSummary = {
      orderId: order.orderId,
      date: order.createdAt,
      paymentMethod: order.paymentMethod,
    };

    return success(200, orderSummary);
  } catch (e) {
    console.error("Error in payment verification:", e);
    return error(500, "Something went wrong.");
  }
}
