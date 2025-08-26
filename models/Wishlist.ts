import mongoose, { Document, Schema } from "mongoose";

interface IProductWishlist {
  productId: mongoose.Types.ObjectId;
}

interface IWishlist extends Document {
  customerId: mongoose.Types.ObjectId;
  products: IProductWishlist[];
}

const WishlistSchema: Schema<IWishlist> = new Schema({
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
    },
  ],
});

const Wishlist =
  mongoose.models.Wishlist ||
  mongoose.model<IWishlist>("Wishlist", WishlistSchema);

export default Wishlist;
