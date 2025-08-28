import dbConnect from "@/dbConnect/dbConnect";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import { verifyAccessToken } from "@/utils/authMiddleware";
import { getShiprocketToken } from "@/utils/getShiprocketToken";
import { error, success } from "@/utils/responseWrapper";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { valid, response, _id } = await verifyAccessToken(req);
    if (!valid) return response!;

    await dbConnect();

    const { cart } = await req.json();

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json(error(400, "At least one product is required."));
    }

    const productDetails = [];

    for (const item of cart) {
      if (!item._id || !item.quantity) {
        return NextResponse.json(
          error(400, "Each product must have productId and quantity.")
        );
      }

      const product = await Product.findById(item._id);
      if (!product) {
        return NextResponse.json(error(404, `Product not found: ${item._id}`));
      }

      // if (product.quantity < item.quantity) {
      //   return NextResponse.json(
      //     error(400, `Not enough stock for product: ${product.name}`)
      //   );
      // }

      const totalAmount = product.price * item.quantity;

      productDetails.push({
        productId: product._id,
        quantity: item.quantity,
        totalAmount,
      });
    }

    const user = await User.findById(_id);
    const token = await getShiprocketToken();

    const sub_total = productDetails.reduce(
      (acc, item) => acc + item.totalAmount,
      0
    );

    const shippingResponse = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
      {
        order_id: `ORD-${Date.now()}`,
        order_date: new Date().toISOString(),
        pickup_location: "Home",
        reseller_name: "",
        company_name: "Zealous",
        billing_customer_name: user.firstName,
        billing_last_name: user.lastName,
        billing_address: `${user.houseNo ?? ""}, 
          ${user.streetAddress} 
          ${user.landmark},
          ${user.city},
          ${user.state},
          ${user.country},
          ${user.pinCode}`,
        billing_address_2: "",
        billing_isd_code: "",
        billing_city: user.city,
        billing_pincode: user.pinCode,
        billing_state: user.state,
        billing_country: user.country,
        billing_email: user.email,
        billing_phone: user.phone,
        billing_alternate_phone: "",
        shipping_is_billing: 1,
        order_items: cart.map((product) => ({
          name: product.name,
          sku: "SKU123",
          units: 1,
          selling_price: product.price,
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

    console.log(shippingResponse.data.order_id);

    await Order.create({
      customerId: _id,
      orderId: shippingResponse.data.order_id,
      products: productDetails,
    });

    return NextResponse.json(success(201, "Ordered successfully."));
  } catch (e) {
    console.error(e);
    return NextResponse.json(error(500, "Something went wrong."));
  }
}

export async function GET(req: NextRequest) {
  try {
    const { valid, response, _id } = await verifyAccessToken(req);
    if (!valid) return response!;

    const orders = await Order.find({ customerId: _id })
      .populate({
        path: "products.productId",
        select: "name price imageUrl",
      })
      .sort({ createdAt: -1 });

    const responseWrapper = orders.map((data) => ({
      _id: data._id,
      customerId: data.customerId,
      orderStatus: data.orderStatus,
      paymentStatus: data.paymentStatus,
      paymentMethod: data.paymentMethod,
      products: data.products.map((pro: any) => ({
        _id: pro._id,
        imgUrl: pro.productId.imageUrl.url,
        name: pro.productId.name,
        price: pro.productId.price,
        quantity: pro.quantity,
        totalAmount: pro.totalAmount,
      })),
    }));

    return NextResponse.json(success(200, responseWrapper));
  } catch (e) {
    console.log(e);
    return NextResponse.json(error(500, "Something went wrong."));
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const { valid, response } = await verifyAccessToken(req);
    if (!valid) return response!;

    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json(error(400, "No such order found"));
    }

    if (!order.orderId) {
      return NextResponse.json(error(400, "Order ID not found"));
    }

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

    order.orderStatus = "Canceled";
    await order.save();

    const statusCode = shippingResponse.data.status_code;
    const message = shippingResponse.data.message;

    return NextResponse.json(success(statusCode, message));
  } catch (e) {
    console.log(e);
    return NextResponse.json(error(500, "Something went wrong."));
  }
}
