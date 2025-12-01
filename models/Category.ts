/**
 * Category Model
 *
 * Mongoose model for product categories.
 * Each category has a name and an array of associated product IDs.
 *
 * Interface:
 * - Categories: Extends mongoose Document, contains 'name' and 'products' fields.
 *
 * Schema:
 * - name: string, required.
 * - products: array of ObjectIds referencing Product documents.
 *
 * Usage:
 * - Use Category model to create, read, update, or delete product categories in MongoDB.
 */

import mongoose, { Document, Schema } from "mongoose";

// Interface for a Category document
export interface Categories extends Document {
  name: string; // Category name
  products: mongoose.Types.ObjectId[]; // Array of Product IDs
  icon: string; // SVG icon
  description: string;
}

// Mongoose schema for the Category model
const categorySchema: Schema<Categories> = new Schema(
  {
    name: {
      type: String,
      required: true, // Category name is required
      trim: true, // Remove whitespace
      default: "", // Default to empty string
    },
    icon: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    products: {
      type: [
        {
          type: Schema.Types.ObjectId, // Reference to Product documents
          ref: "Product",
        },
      ],
    },
  },
  { timestamps: true } // Automatically manage createdAt and updatedAt fields
);

// Create or reuse the Category model
const Category =
  mongoose.models.Category ||
  mongoose.model<Categories>("Category", categorySchema);

// Export the Category model
export default Category;
