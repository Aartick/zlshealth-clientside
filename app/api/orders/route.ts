import Order from "@/models/Order";
import { verifyAccessToken } from "@/utils/authMiddleware";
import { getShiprocketToken } from "@/utils/getShiprocketToken";
import { error, success } from "@/utils/responseWrapper";
import axios from "axios";
import { Types } from "mongoose";
import { NextRequest } from "next/server";

/**
 * @route GET /api/orders
 * @description Get all orders of the authenticated user
 * @access Private (JWT required)
 * @param req
 * @returns
 */

interface ProductDoc {
  _id: Types.ObjectId;
  name: string;
  price: number;
  productImg: { url: string };
  about: string;
}

interface OrderProduct {
  _id: Types.ObjectId;
  productId: ProductDoc;
  quantity: number;
  totalAmount: number;
}

export async function GET(req: NextRequest) {
  try {
    // Verify JWT token
    const { valid, response, _id } = await verifyAccessToken(req);
    if (!valid) return response!;

    // Fetch orders and populate product details
    const orders = await Order.find({ customerId: _id })
      .populate({
        path: "products.productId",
        select: "orderId name price productImg about",
      })
      .sort({ createdAt: -1 });

    const token = await getShiprocketToken();

    // Fetch status for each order concurrently
    const orderStatuses = await Promise.all(
      orders.map(async (order) => {
        try {
          const { data } = await axios.get(
            `https://apiv2.shiprocket.in/v1/external/orders/show/${order.orderId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          return {
            orderId: order.orderId,
            paymentMethod: data.data.payment_method,
            paymentStatus: data.data.payment_status,
            shiprocketStatus: data.data.shipments.status || "Unknown",
          };
        } catch (error: any) {
          console.error(
            `Failed to fetch status for order ${order.orderId}:`,
            error.message
          );
          return {
            orderId: order.orderId,
            shiprocketStatus: "Unavailable",
          };
        }
      })
    );

    // Transform resposne for client
    const responseWrapper = orders.map((data) => {
      const matchedStatus = orderStatuses.find(
        (o) => o.orderId === data.orderId
      );

      return {
        _id: data._id,
        customerId: data.customerId,
        orderStatus: matchedStatus?.shiprocketStatus,
        paymentStatus: matchedStatus?.paymentStatus,
        paymentMethod: matchedStatus?.paymentMethod,
        orderDate: data.createdAt,
        products: data.products.map((pro: OrderProduct) => ({
          _id: pro.productId._id,
          imgUrl: pro.productId.productImg.url,
          name: pro.productId.name,
          price: pro.productId.price,
          about: pro.productId.about,
          quantity: pro.quantity,
          totalAmount: pro.totalAmount,
        })),
      };
    });

    return success(200, responseWrapper);
  } catch (e) {
    console.log(e);
    return error(500, "Something went wrong.");
  }
}

/**
 * @route PUT /api/orders?id=<orderId>
 * @description Cancel an order
 * @access Private (JWT required)
 * @param req
 * @returns
 */

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const { valid, response } = await verifyAccessToken(req);
    if (!valid) return response!;

    // Find order in DB
    const order = await Order.findById(id);

    if (!order) {
      return error(400, "No such order found");
    }

    if (!order.orderId) {
      return error(400, "Order ID not found");
    }

    // Cancel order in Shiprocket
    const token = await getShiprocketToken();

    const shippingResponse = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/orders/cancel",
      { ids: [order.orderId] },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Update order status in DB
    order.orderStatus = "Canceled";
    await order.save();

    const statusCode = shippingResponse.data.status_code;
    const message = shippingResponse.data.message;

    return success(statusCode, message);
  } catch (e) {
    console.log(e);
    return error(500, "Something went wrong.");
  }
}
