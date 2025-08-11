import mongoose, { Schema, Document } from "mongoose";

export interface IDescription extends Document {
  description: string;
  benefits: string[];
  dosage: string;
  productAttributes: string[];
  packSize: string;
  ingredients: string[];
  safety: string;
}

const descriptionSchema: Schema<IDescription> = new Schema(
  {
    description: {
      type: String,
      required: true,
    },
    benefits: {
      type: [String],
      required: true,
    },
    dosage: {
      type: String,
      required: true,
    },
    productAttributes: {
      type: [String],
      required: true,
    },
    packSize: {
      type: String,
      required: true,
    },
    ingredients: {
      type: [String],
      required: true,
    },
    safety: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Description =
  mongoose.models.Description ||
  mongoose.model<IDescription>("Description", descriptionSchema);

export default Description;
