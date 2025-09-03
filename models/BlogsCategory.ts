/**
 * BlogCategory Model
 *
 * Mongoose model for blog categories.
 * Each category has a name and an array of associated blog post IDs.
 *
 * Interface:
 * - IBlogsCategory: Extends mongoose Document, contains 'name' and 'blogs' fields.
 *
 * Schema:
 * - name: string, required.
 * - blogs: array of ObjectIds referencing Blog documents, required.
 *
 * Usage:
 * - Use BlogCategory model to create, read, update, or delete blog categories in MongoDB.
 */

import mongoose, { Document, Schema } from "mongoose";

// Interface for a BlogCategory document
interface IBlogsCategory extends Document {
  name: string; // Category name
  blogs: mongoose.Types.ObjectId[]; // Array of Blog IDs
}

// Mongoose schema for BlogCategory
const blogCategorySchema: Schema<IBlogsCategory> = new Schema(
  {
    name: {
      type: String,
      required: true, // Category name is required
    },
    blogs: [
      {
        type: Schema.Types.ObjectId, // Reference to Blog document
        ref: "Blog",
        required: true, // Each blog reference is required
      },
    ],
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

// Create or reuse BlogCategory model
const BlogCategory =
  mongoose.models.BlogCategory ||
  mongoose.model<IBlogsCategory>("BlogCategory", blogCategorySchema);

// Export the BlogCategory model
export default BlogCategory;
