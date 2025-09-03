/**
 * Description Model
 * 
 * Mongoose model for detailed product descriptions.
 * Stores product description, benefits, dosage, attributes, form, pack size, ingredients, and safety info.
 *
 * Interface:
 * - IDescription: Extends mongoose Document, contains all product detail fields.
 *
 * Schema:
 * - description: string, required.
 * - benefits: array of strings, required.
 * - dosage: string, required.
 * - productAttributes: array of strings, required.
 * - form: string, required.
 * - packSize: string, required.
 * - ingredients: array of strings, required.
 * - safety: string, required.
 *
 * Usage:
 * - Use Description model to create, read, update, or delete product descriptions in MongoDB.
 */

import mongoose, { Schema, Document } from "mongoose";

// Interface for a product description document
export interface IDescription extends Document {
  description: string;         // Main product description
  benefits: string[];          // List of product benefits
  dosage: string;              // Dosage instructions
  productAttributes: string[]; // Product attributes/features
  form: string;                // Product form (e.g., tablet, syrup)
  packSize: string;            // Pack size info
  ingredients: string[];       // List of ingredients
  safety: string;              // Safety information
}

// Mongoose schema for Description
const descriptionSchema: Schema<IDescription> = new Schema(
  {
    description: {
      type: String,
      required: true,           // Description is required
    },
    benefits: {
      type: [String],
      required: true,           // Benefits are required
    },
    dosage: {
      type: String,
      required: true,           // Dosage is required
    },
    productAttributes: {
      type: [String],
      required: true,           // Product attributes are required
    },
    form: {
      type: String,
      required: true            // Form is required
    },
    packSize: {
      type: String,
      required: true,           // Pack size is required
    },
    ingredients: {
      type: [String],
      required: true,           // Ingredients are required
    },
    safety: {
      type: String,
      required: true,           // Safety info is required
    },
  },
  { timestamps: true }          // Adds createdAt and updatedAt fields
);

// Create or reuse Description model
const Description =
  mongoose.models.Description ||
  mongoose.model<IDescription>("Description", descriptionSchema);

// Export the Description model
export default Description;
