import mongoose, { Document, Schema } from "mongoose";

interface IproductType extends Document {
  name: string;
}

const productTypeSchema: Schema<IproductType> = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

const ProductType =
  mongoose.models.ProductType ||
  mongoose.model<IproductType>("ProductType", productTypeSchema);

export default ProductType;
