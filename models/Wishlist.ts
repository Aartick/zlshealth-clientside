/**
 * Wishlist Model
 *
 * Mongoose model for storing user wishlists.
 * Each wishlist is associated with a customer (User) and contains an array of products.
 * Allows users to save products they are interested in for future reference.
 *
 * Interface:
 * - IProductWishlist: Represents a single product in the wishlist (productId reference).
 * - IWishlist: Extends mongoose Document, contains customerId (reference to User)
 *   and an array of products (references to Product).
 *
 * Schema:
 * - customerId: ObjectId reference to User (required).
 * - products: Array of objects, each containing a productId (reference to Product, required).
 *
 * Usage:
 * - Use Wishlist model to create, read, update, or delete wishlists.
 * - Each user can have a single wishlist that stores multiple products.
 */

import mongoose, { Document, Schema } from "mongoose";

// Interface for a single product in the wishlist
interface IProductWishlist {
  productId: mongoose.Types.ObjectId; // Reference to Product
}

// Interface for the Wishlist document
interface IWishlist extends Document {
  customerId: mongoose.Types.ObjectId; // Reference to User who owns the wishlist
  products: IProductWishlist[]; // Array of products in the wishlist
}

// Mongoose schema for Wishlist
const WishlistSchema: Schema<IWishlist> = new Schema({
  customerId: {
    type: Schema.Types.ObjectId,
    ref: "User", // Reference to User model
    required: true, // Must be provided
  },
  products: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product", // Reference to Product model
        required: true, // Each product entry must have a valid productId
      },
    },
  ],
});

// Create or reuse Wishlist model
const Wishlist =
  mongoose.models.Wishlist ||
  mongoose.model<IWishlist>("Wishlist", WishlistSchema);

// Export the Wishlist model
export default Wishlist;
