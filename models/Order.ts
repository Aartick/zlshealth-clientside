import mongoose, { Document, Schema } from "mongoose";

interface IProductInOrder {
  productId: mongoose.Types.ObjectId;
  quantity: string;
  totalAmount: number;
}

interface IOrder extends Document {
  customerId: mongoose.Types.ObjectId;
  products: IProductInOrder[];
  orderId: number;
  orderStatus:
    | "Pending"
    | "Packed"
    | "Shipped"
    | "Out for delivery"
    | "Delivered"
    | "Canceled"
    | "Returned";
  paymentStatus: "Pending" | "Completed" | "Failed";
  paymentMethod: string;
  paymentId: string;
  paymentOrderId: string;
  paymentAmount: number;
  paymentDate: Date;
}

const orderSchema: Schema<IOrder> = new Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: String,
          required: true,
        },
        totalAmount: {
          type: Number,
          required: true,
        },
      },
    ],
    orderId: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: String,
      enum: [
        "Pending",
        "Packed",
        "Shipped",
        "Out for delivery",
        "Delivered",
        "Canceled",
        "Returned",
      ],
      default: "Pending",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
    },
    paymentMethod: {
      type: String,
      default: "Cash",
    },
    paymentId: String,
    paymentOrderId: String,
    paymentAmount: Number,
    paymentDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Order =
  mongoose.models.Order || mongoose.model<IOrder>("Order", orderSchema);

export default Order;
