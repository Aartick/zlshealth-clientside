import { Address } from "@/interfaces/user";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import { verifyAccessToken } from "@/utils/authMiddleware";
import { formatAddress } from "@/utils/formatAddress";
import { getShiprocketToken } from "@/utils/getShiprocketToken";
import { error, success } from "@/utils/responseWrapper";
import axios from "axios";
import { Types } from "mongoose";
import { NextRequest } from "next/server";

/**
 * @route POST /api/orders
 * @description Create a new order for the authenticated user
 * @access Private (JWT required)
 * @param req
 * @returns
 */

export async function POST(req: NextRequest) {
  try {
    // Verify JWT token
    const { valid, response, _id } = await verifyAccessToken(req);
    if (!valid) return response!;

    // Extract cart from request body
    const { cart } = await req.json();

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return error(400, "At least one product is required.");
    }

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
        quantity: item.quantity,
        totalAmount,
      });
    }

    // Get user details and Shiprocket token
    const user = await User.findById(_id);
    const token = await getShiprocketToken();

    // Calculate subtotal
    const sub_total = productDetails.reduce(
      (acc, item) => acc + item.totalAmount,
      0
    );

    // Get default address
    const defaultAddress = user.addresses.find(
      (addr: Address) => addr.isDefault
    );

    // Create order in Shiprocket
    const shippingResponse = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
      {
        order_id: `ORD-alskdjf`,
        order_date: new Date().toISOString().slice(0, 16).replace("T", " "),
        pickup_location: "Home",
        company_name: "Zealous",
        billing_customer_name: defaultAddress.fullName || user.fullName,
        billing_last_name: "",
        billing_address: `${formatAddress(defaultAddress)}`,
        billing_city: defaultAddress.cityTown,
        billing_pincode: Number(defaultAddress.pinCode),
        billing_state: defaultAddress.state,
        billing_country: "India",
        billing_email: defaultAddress.email || user.email,
        billing_phone: Number(defaultAddress.phone || user.phone),
        billing_alternate_phone: Number(user.phone),
        shipping_is_billing: 1,
        order_items: productDetails.map((product) => ({
          name: product.name,
          sku: "SKU123",
          units: product.quantity,
          selling_price: product.totalAmount / product.quantity,
        })),
        payment_method: "COD",
        sub_total,
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

    // Save order in DB
    await Order.create({
      customerId: _id,
      orderId: shippingResponse.data.order_id,
      products: productDetails,
    });

    return success(201, "Ordered successfully.");
  } catch (e) {
    console.error(e);
    return error(500, "Something went wrong while making order");
  }
}

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
  imageUrl: { url: string };
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
        select: "name price imageUrl",
      })
      .sort({ createdAt: -1 });

    // Transform resposne for client
    const responseWrapper = orders.map((data) => ({
      _id: data._id,
      customerId: data.customerId,
      orderStatus: data.orderStatus,
      paymentStatus: data.paymentStatus,
      paymentMethod: data.paymentMethod,
      products: data.products.map((pro: OrderProduct) => ({
        _id: pro._id,
        imgUrl: pro.productId.imageUrl.url,
        name: pro.productId.name,
        price: pro.productId.price,
        quantity: pro.quantity,
        totalAmount: pro.totalAmount,
      })),
    }));

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
