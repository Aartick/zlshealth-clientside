/**
 * Order Model
 *
 * Mongoose model for customer orders.
 * Each order is associated with a customer and contains an array of products, order status, payment details, and timestamps.
 *
 * Interfaces:
 * - IProductInOrder: Represents a product in the order (productId, quantity, totalAmount).
 * - IOrder: Main order document interface (customerId, products, orderId, orderStatus, payment info).
 *
 * Schema:
 * - customerId: ObjectId reference to User, required.
 * - products: Array of product objects (productId, quantity, totalAmount), required.
 * - orderId: Unique order number, required.
 * - orderStatus: Enum for order status, default "Pending".
 * - paymentStatus: Enum for payment status, default "Pending".
 * - paymentMethod: Payment method, default "Cash".
 * - paymentId, paymentOrderId: Payment identifiers.
 * - paymentAmount: Amount paid.
 * - paymentDate: Date of payment, required.
 *
 * Usage:
 * - Use Order model to create, read, update, or delete customer orders in MongoDB.
 */

import mongoose, { Document, Schema } from "mongoose";

// Interface for a product in the order
interface IProductInOrder {
  productId: mongoose.Types.ObjectId; // Reference to Product
  quantity: string; // Quantity ordered
  totalAmount: number; // Total amount for this product
}

// Main order document interface
interface IOrder extends Document {
  customerId: mongoose.Types.ObjectId; // Reference to User
  fullName: string;
  phone: string;
  email: string;
  landmark: string;
  streetAddressHouseNo: string;
  streetAddress2?: string;
  addressType: string;
  cityTown: string;
  state: string;
  pinCode: string;
  products: IProductInOrder[]; // Array of products in the order
  orderId: number; // Unique order number
  orderStatus:
    | "Pending"
    | "Packed"
    | "Shipped"
    | "Out for delivery"
    | "Delivered"
    | "Canceled"
    | "Returned"; // Status of the order
  paymentStatus: "Pending" | "Completed" | "Failed"; // Payment status
  paymentMethod: string; // Payment method (e.g., Cash, Card)
  paymentId: string; // Payment transaction ID
  paymentOrderId: string; // Payment order ID
  paymentAmount: number; // Amount paid
  paymentDate: Date; // Date of payment
}

// Mongoose schema for Order
const orderSchema: Schema<IOrder> = new Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User model
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    landmark: String,
    streetAddressHouseNo: {
      type: String,
      required: true,
    },
    streetAddress2: String,
    addressType: String,
    cityTown: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    pinCode: {
      type: String,
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product", // Reference to Product model
          required: true,
        },
        quantity: {
          type: String, // Quantity ordered
          required: true,
        },
        totalAmount: {
          type: Number, // Total amount for this product
          required: true,
        },
      },
    ],
    orderId: {
      type: Number, // Unique order number
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
      ], // Allowed order status values
      default: "Pending",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed"], // Allowed payment status values
      default: "Pending",
    },
    paymentMethod: {
      type: String, // Payment method
      default: "Cash",
    },
    paymentId: String, // Payment transaction ID
    paymentOrderId: String, // Payment order ID
    paymentAmount: Number, // Amount paid
    paymentDate: {
      type: Date, // Date of payment
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Create or reuse Order model
const Order =
  mongoose.models.Order || mongoose.model<IOrder>("Order", orderSchema);

// Export the Order model
export default Order;
