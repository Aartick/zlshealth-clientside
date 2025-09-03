/**
 * Cart Model
 * 
 * Mongoose model for user shopping carts.
 * Each cart is associated with a customer and contains an array of products.
 *
 * Interfaces:
 * - IProductCart: Represents a product in the cart (productId and quantity).
 * - ICart: Main cart document interface (customerId and products array).
 *
 * Schema:
 * - customerId: ObjectId reference to User, required.
 * - products: Array of product objects (productId and quantity), required.
 *
 * Usage:
 * - Use Cart model to create, read, update, or delete user carts in MongoDB.
 */

import mongoose, { Document, Schema } from "mongoose";

// Interface for a product in the cart
interface IProductCart {
  productId: mongoose.Types.ObjectId; // Reference to Product
  items: number;                      // (Unused, can be removed if not needed)
  quantity: string;                   // Quantity as string (should be number for consistency)
}

// Main cart document interface
interface ICart extends Document {
  customerId: mongoose.Types.ObjectId; // Reference to User
  products: IProductCart[];            // Array of products in the cart
}

// Mongoose schema for Cart
const CartSchema: Schema<ICart> = new Schema({
  customerId: {
    type: Schema.Types.ObjectId,
    ref: "User",         // Reference to User model
    required: true,      // Must be provided
  },
  products: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",  // Reference to Product model
        required: true,  // Must be provided
      },
      quantity: {
        type: Number,    // Quantity of the product
        required: true,  // Must be provided
        default: 1,      // Default quantity is 1
      },
    },
  ],
});

// Create or reuse Cart model
const Cart = mongoose.models.Cart || mongoose.model<ICart>("Cart", CartSchema);

// Export the Cart model
export default Cart;
