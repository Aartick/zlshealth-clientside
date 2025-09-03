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
}

// Mongoose schema for Category
const categorySchema: Schema<Categories> = new Schema(
  {
    name: {
      type: String,
      required: true, // Category name is required
    },
    products: {
      type: [
        {
          type: Schema.Types.ObjectId, // Reference to Product document
          ref: "Product",
        },
      ],
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

// Create or reuse Category model
const Category =
  mongoose.models.Category ||
  mongoose.model<Categories>("Category", categorySchema);

// Export the Category
export default Category;
