/**
 * Review Model
 *
 * Mongoose model for product reviews.
 * Each review is associated with a user and a product, and contains a rating and optional comment.
 * Ensures a user can only review a product once (unique index on user + product).
 *
 * Interface:
 * - IReview: Extends mongoose Document, contains user, product, rating, comment, createdAt, updatedAt.
 *
 * Schema:
 * - user: ObjectId reference to User, required.
 * - product: ObjectId reference to Product, required.
 * - rating: Integer (1-5), required, validated.
 * - comment: Optional string, trimmed.
 * - timestamps: Adds createdAt and updatedAt fields.
 *
 * Usage:
 * - Use Review model to create, read, update, or delete product reviews in MongoDB.
 */

import mongoose, { Schema, Document, Model } from "mongoose";

// Interface for a Review document
export interface IReview extends Document {
  user: mongoose.Types.ObjectId; // Reference to User
  product: mongoose.Types.ObjectId; // Reference to Product
  rating: number; // Rating value (1-5)
  comment?: string; // Optional review comment
  createdAt: Date; // Timestamp for creation
  updatedAt: Date; // Timestamp for update
}

// Mongoose schema for Review
const ReviewSchema: Schema<IReview> = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User", // Reference to User model
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product", // Reference to Product model
      required: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"], // Rating must be provided
      min: [1, "Rating must be at least 1"], // Minimum rating value
      max: [5, "Rating cannot exceed 5"], // Maximum rating value
      validate: {
        validator: Number.isInteger, // Must be integer
        message: "Rating must be an integer value",
      },
    },
    comment: {
      type: String,
      trim: true, // Trim whitespace
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

// Ensure a user can only review a product once
ReviewSchema.index({ user: 1, product: 1 }, { unique: true });

// Create or reuse Review model
const Review: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);

// Export the Review
export default Review;
