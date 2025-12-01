/**
 * Benefit Model
 *
 * Mongoose model for product benefits.
 * Each benefit has a unique name.
 *
 * Interface:
 * - IBenefits: Extends mongoose Document, contains 'name' field.
 *
 * Schema:
 * - name: string, required, unique.
 *
 * Usage:
 * - Use Benefit model to create, read, update, or delete product benefits in MongoDB.
 */

import mongoose, { Document, Schema } from "mongoose";

// Interface for a Benefit document
interface IBenefits extends Document {
  name: string;
  icon: string;
  description: string;
}

// Mongoose schema for Benefit
const benefitsSchema: Schema<IBenefits> = new Schema({
  name: {
    type: String, // Benefit name
    required: true, // Must be provided
    unique: true, // Must be unique
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
});

// Create or reuse Benefit model
const Benefit =
  mongoose.models.Benefit ||
  mongoose.model<IBenefits>("Benefit", benefitsSchema);

// Export the Benefit model
export default Benefit;
