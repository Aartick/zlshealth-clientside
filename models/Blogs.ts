/**
 * Blog Model
 *
 * Mongoose model for blog posts.
 * Supports rich content sections, comments, author, category, and images.
 *
 * Interfaces:
 * - IContentSection: Represents a section of blog content (heading + body).
 * - IComment: Represents a comment on a blog post.
 * - IBlog: Main blog document interface.
 *
 * Schemas:
 * - contentSectionSchema: Schema for individual content sections.
 * - commentSchema: Schema for individual comments.
 * - blogSchema: Main schema for blog posts.
 *
 * Usage:
 * - Use Blog model to create, read, update, or delete blog posts in MongoDB.
 */

import mongoose, { Document, Schema } from "mongoose";

// Interface for a content section in the blog
export interface IContentSection {
  heading: string;
  body: string;
}

// Interface for a comment on the blog
export interface IComment {
  user: mongoose.Types.ObjectId;
  text: string;
  createdAt: Date;
}

// Main blog document interface
export interface IBlog extends Document {
  category: mongoose.Types.ObjectId; // Reference to BlogCategory
  title: string; // Blog title
  content: IContentSection[]; // Array of content sections
  imageUrl: {
    // Blog image
    public_id: string;
    url: string;
  };
  author: mongoose.Types.ObjectId; // Reference to User
  postedOn: Date; // Date posted
  comments: IComment[]; // Array of comments
}

// Schema for individual content sections (no _id for subdocs)
const contentSectionSchema = new Schema<IContentSection>(
  {
    heading: { type: String, required: true }, // Section heading
    body: { type: String, required: true }, // Section body
  },
  { _id: false }
);

// Schema for individual comments (no _id for subdocs)
const commentSchema = new Schema<IComment>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Comment author
    text: { type: String, required: true }, // Comment text
    createdAt: { type: Date, default: Date.now }, // Comment date
  },
  { _id: false }
);

// Main schema for blog posts
const blogSchema: Schema<IBlog> = new Schema(
  {
    category: {
      type: Schema.Types.ObjectId,
      ref: "BlogCategory",
      required: true,
    },
    title: { type: String, required: true },
    content: { type: [contentSectionSchema], required: true }, // Array of content sections
    imageUrl: {
      public_id: {
        type: String,
        default: "",
      },
      url: {
        type: String,
        default: "",
      },
    },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    postedOn: { type: Date, default: Date.now },
    comments: { type: [commentSchema], default: [] }, // Array of comments
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

// Create or reuse Blog model
const Blog = mongoose.models.Blog || mongoose.model<IBlog>("Blog", blogSchema);

// Export the Blog model
export default Blog;
