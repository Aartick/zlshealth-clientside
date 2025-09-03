/**
 * Faqs Model
 * 
 * Mongoose model for storing FAQs related to products.
 * Each FAQ document can be associated with a product and contains an array of question-answer items.
 *
 * Interfaces:
 * - IFaqItem: Represents a single FAQ item (question and answer).
 * - IFaqs: Main FAQ document interface (optional productId and items array).
 *
 * Schema:
 * - productId: ObjectId reference to Product (optional).
 * - items: Array of FAQ items (question and answer), required.
 *
 * Usage:
 * - Use Faqs model to create, read, update, or delete FAQs for products in MongoDB.
 */

import mongoose, { Document, Schema } from "mongoose";

// Interface for a single FAQ item
interface IFaqItem {
  question: string; // FAQ question
  answer: string;   // FAQ answer
}

// Main FAQ document interface
export interface IFaqs extends Document {
  productId?: mongoose.Types.ObjectId; // Optional reference to Product
  items: IFaqItem[];                   // Array of FAQ items
}

// Mongoose schema for FAQs
const faqSchema: Schema<IFaqs> = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product", // Reference to Product model
    },
    items: [
      {
        question: { type: String, required: true }, // FAQ question
        answer: { type: String, required: true },   // FAQ answer
      },
    ],
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

// Create or reuse Faqs model
const Faqs = mongoose.models.Faqs || mongoose.model<IFaqs>("Faqs", faqSchema);

// Export the Faqs model
export default Faqs;
