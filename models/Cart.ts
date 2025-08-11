import mongoose, { Document, Schema } from "mongoose";

interface IProductCart {
  productId: mongoose.Types.ObjectId;
  items: number;
  quantity: string;
}

interface ICart extends Document {
  customerId: mongoose.Types.ObjectId;
  products: IProductCart[];
}

const CartSchema: Schema<ICart> = new Schema({
  customerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      items: {
        type: Number,
        required: true,
        default: 1,
      },
      quantity: {
        type: String,
        required: true,
      },
    },
  ],
});

const Cart = mongoose.models.Cart || mongoose.model<ICart>("Cart", CartSchema);

export default Cart;
