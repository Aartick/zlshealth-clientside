import mongoose, { Document, Schema } from "mongoose";

export interface Categories extends Document {
  name: string;
  products: mongoose.Types.ObjectId[];
}

const categorySchema: Schema<Categories> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    products: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Product",
        },
      ],
    },
  },
  { timestamps: true }
);

const Category =
  mongoose.models.Category ||
  mongoose.model<Categories>("Category", categorySchema);

export default Category;
