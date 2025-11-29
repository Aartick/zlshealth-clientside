/**
 * Health Condition Model
 *
 * Mongoose model to store product health conditions.
 * Each health condition has a unique name.
 *
 * Interface:
 * - IHealthCondition: Defines the structure of a health condition document.
 *
 * Schema:
 * - name: Name of the health condition (required, unique).
 *
 * Usage:
 * - Use the Health Condition model to create, read, update, and delete health conditions in the database.
 */

import mongoose, { Document, Schema } from "mongoose";

// Interface for a Benefit document
interface IHealthCondition extends Document {
  name: string;
}

// Mongoose schema for the Benefit model
const healthConditionsSchema: Schema<IHealthCondition> = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

// Create or reuse the Benefit model
const HealthConditions =
  mongoose.models.HealthConditions ||
  mongoose.model<IHealthCondition>("HealthConditions", healthConditionsSchema);

// Export the Benefit model
export default HealthConditions;
