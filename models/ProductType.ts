/**
 * ProductType Model
 * 
 * Mongoose model for product types (e.g., Tablet, Syrup, Capsule).
 * Each product type has a unique name.
 *
 * Interface:
 * - IproductType: Extends mongoose Document, contains 'name' field.
 *
 * Schema:
 * - name: string, required, unique.
 *
 * Usage:
 * - Use ProductType model to create, read, update, or delete product types in MongoDB.
 */

import mongoose, { Document, Schema } from "mongoose";

// Interface for a ProductType document
interface IproductType extends Document {
  name: string; // Name of the product type (e.g., Tablet, Syrup)
}

// Mongoose schema for ProductType
const productTypeSchema: Schema<IproductType> = new Schema({
  name: {
    type: String,     // Product type name
    required: true,   // Must be provided
    unique: true,     // Must be unique
    trim: true,
  },
});

// Create or reuse ProductType model
const ProductType =
  mongoose.models.ProductType ||
  mongoose.model<IproductType>("ProductType", productTypeSchema);

// Export the ProductType model
export default ProductType;
