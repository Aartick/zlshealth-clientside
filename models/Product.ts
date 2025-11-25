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
 * - descriptionImg: Object with public_id and url for product description image.
 * - productImg: Object with public_id and url for product image.
 * - thirdImg: Object with public_id and url for product third image.
 * - fourthImg: Object with public_id and url for product fourth image.
 * - name: string, required.
 * - about: string, required.
 * - price: number, required.
 * - discount: number, required.
 * - stock: number.
 * - expiryMonths: number.
 * - form: string.
 * - packSize: string.
 * - appliedFor: string;
 * - suitableFor: string;
 * - safetyNote: string;
 * - faqs: mongoose.Types.ObjectId;
 * - averageRating: number;
 * - numReviews: number;
 *
 * Usage:
 * - Use Product model to create, read, update, or delete products in MongoDB.
 */

import mongoose, { Document, Schema } from "mongoose";

// Interface for a Product document
export interface IProduct extends Document {
  category: mongoose.Types.ObjectId; // Reference to Category
  productTypes: mongoose.Types.ObjectId[]; // Array of ProductType references
  benefits: mongoose.Types.ObjectId[]; // Array of Benefit references
  healthConditions: String[]; // Array of health conditions
  // Different image fields with public_id and url for each unique images
  descriptionImg: {
    public_id: string;
    url: string;
  };
  productImg: {
    public_id: string;
    url: string;
  };
  thirdImg: {
    public_id: string;
    url: string;
  };
  fourthImg: {
    public_id: string;
    url: string;
  };
  name: string; // Product name
  about: string; // Brief about the product
  price: number; // Product price
  discount: number; // Discount percentage
  description: string; // Description of the product
  stock: number; // Stock quantity
  expiryMonths: number; // Product expiry in months
  form: string; // Caplet or tablet with weight
  packSize: string; // Number of caplet or tablets
  appliedFor: string; // Product benefits
  suitableFor: string; // Age specific
  safetyNote: string; // Describes products safety usage
  faqs: mongoose.Types.ObjectId; // Reference to FAQs
  averageRating: number; // Average rating
  numReviews: number; // Number of reviews
  sku: string; // The sku id of the product.
  length: number; // Length of the product (in cms, must be more then 0.5)
  breadth: number; // Breadth of the product (in cms, must be more then 0.5)
  height: number; // Height of the product (in cms, must be more then 0.5)
  weight: number; // Weight of the product (in kgs, must be more then 0)
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
    healthConditions: [
      {
        type: String,
      },
    ],
    descriptionImg: {
      public_id: {
        type: String,
        default: "",
      },
      url: {
        type: String,
        default: "",
      },
    },
    productImg: {
      public_id: {
        type: String,
        default: "",
      },
      url: {
        type: String,
        default: "",
      },
    },
    thirdImg: {
      public_id: {
        type: String,
        default: "",
      },
      url: {
        type: String,
        default: "",
      },
    },
    fourthImg: {
      public_id: {
        type: String,
        default: "",
      },
      url: {
        type: String,
        default: "",
      },
    },
    name: {
      type: String,
      required: true, // Product name is required
    },
    about: {
      type: String,
      required: true, // About text is required
    },
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
    description: {
      type: String,
      required: true, // Description is required
    },
    stock: {
      type: Number,
      default: 0, // Default stock quantity is 0
    },
    expiryMonths: {
      type: Number,
      default: 0, // Default stock quantity is 0
    },
    form: {
      type: String,
      required: true,
    },
    packSize: {
      type: String,
      required: true,
    },
    appliedFor: {
      type: String,
      required: true,
    },
    suitableFor: {
      type: String,
      required: true,
    },
    safetyNote: {
      type: String,
      required: true,
    },
    faqs: {
      type: Schema.Types.ObjectId,
      ref: "Faqs", // Reference to FAQ's model
    },
    averageRating: {
      type: Number,
      default: 0, // Default rating is 0
    },
    numReviews: {
      type: Number,
      default: 0, // Default number of reviews is 0
    },
    sku: {
      type: String,
      required: true,
    },
    length: {
      type: Number,
      required: true,
    },
    breadth: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
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
