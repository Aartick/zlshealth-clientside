import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
  category: mongoose.Types.ObjectId;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
  shortDescription: string;
  highlights: string[];
  sku: string;
  brand: string;
  description: mongoose.Types.ObjectId;
  additionalInfo: string;
  appliedFor: string[];
  faqs: mongoose.Types.ObjectId;
}

const productSchema: Schema<IProduct> = new Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },
    name: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    highlights: {
      type: [String],
      required: true,
    },
    sku: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    description: {
      type: Schema.Types.ObjectId,
      ref: "Description",
    },
    additionalInfo: {
      type: String,
    },
    appliedFor: {
      type: [String],
    },
    faqs: {
      type: Schema.Types.ObjectId,
      ref: "Faqs",
    },
  },
  {
    timestamps: true,
  }
);

const Product =
  mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema);

export default Product;
