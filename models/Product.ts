/**
 * Product Model
 * 
 * Mongoose model for products in the catalog.
 * Supports categories, product types, benefits, images, pricing, tags, descriptions, FAQs, ratings, and more.
 *
 * Interface:
 * - IProduct: Extends mongoose Document, contains all product detail fields.
 *
 * Schema:
 * - category: ObjectId reference to Category, required.
 * - productTypes: Array of ObjectIds referencing ProductType, required.
 * - benefits: Array of ObjectIds referencing Benefit, required.
 * - imageUrl: Object with public_id and url for product image.
 * - name: string, required.
 * - about: string, required.
 * - tags: array of strings, required.
 * - price: number, required.
 * - discount: number, required.
 * - quantity: number.
 * - shortDescription: string, required.
 * - highlights: array of strings, required.
 * - sku: string, required.
 * - brand: string, required.
 * - description: ObjectId reference to Description.
 * - additionalInfo: string.
 * - appliedFor: array of strings.
 * - faqs: ObjectId reference to Faqs.
 * - averageRating: number.
 * - numReviews: number.
 *
 * Usage:
 * - Use Product model to create, read, update, or delete products in MongoDB.
 */

import mongoose, { Document, Schema } from "mongoose";

// Interface for a Product document
export interface IProduct extends Document {
  category: mongoose.Types.ObjectId;         // Reference to Category
  productTypes: mongoose.Types.ObjectId[];   // Array of ProductType references
  benefits: mongoose.Types.ObjectId[];       // Array of Benefit references
  imageUrl: {                               // Product image info
    public_id: string;
    url: string;
  };
  name: string;                             // Product name
  about: string;                            // Short about text
  tags: string[];                           // Array of tags
  price: number;                            // Product price
  discount: number;                         // Discount percentage
  shortDescription: string;                 // Short description
  quantity: number;                         // Stock quantity
  highlights: string[];                     // Array of highlights
  sku: string;                              // SKU code
  brand: string;                            // Brand name
  description: mongoose.Types.ObjectId;     // Reference to Description
  additionalInfo: string;                   // Additional info
  appliedFor: string[];                     // Applied for (targeted uses)
  faqs: mongoose.Types.ObjectId;            // Reference to Faqs
  averageRating: number;                    // Average rating
  numReviews: number;                       // Number of reviews
}

// Mongoose schema for Product
const productSchema: Schema<IProduct> = new Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true, // Product must have a category
    },
    productTypes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductType",
        required: true, // Product must have at least one type
      },
    ],
    benefits: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Benefit",
        required: true, // Product must have at least one benefit
      },
    ],
    name: {
      type: String,
      required: true, // Product name is required
    },
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
    about: {
      type: String,
      required: true, // About text is required
    },
    tags: [
      {
        type: String,
        required: true, // At least one tag is required
      },
    ],
    price: {
      type: Number,
      required: true, // Price is required
      default: 0,
    },
    discount: {
      type: Number,
      required: true, // Discount is required
      default: 0,
    },
    quantity: {
      type: Number,
      default: 0, // Default quantity is 0
    },
    shortDescription: {
      type: String,
      required: true, // Short description is required
    },
    highlights: {
      type: [String],
      required: true, // At least one highlight is required
    },
    sku: {
      type: String,
      required: true, // SKU is required
    },
    brand: {
      type: String,
      required: true, // Brand is required
    },
    description: {
      type: Schema.Types.ObjectId,
      ref: "Description", // Reference to Description model
    },
    additionalInfo: {
      type: String, // Optional additional info
    },
    appliedFor: {
      type: [String], // Optional appliedFor array
    },
    faqs: {
      type: Schema.Types.ObjectId,
      ref: "Faqs", // Reference to Faqs model
    },
    averageRating: {
      type: Number,
      default: 0, // Default rating is 0
    },
    numReviews: {
      type: Number,
      default: 0, // Default number of reviews is 0
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Create or reuse Product model
const Product =
  mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema);

// Export the Product model
export default Product;
