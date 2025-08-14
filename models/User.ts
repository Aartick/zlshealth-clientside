import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  displayName: string;
  googleId: string;
  email: string;
  password: string;
  hasAgreedToPrivacyPolicy: boolean;
  VAT_Number: string;
  SSN_Number: string;
  GSTIN_Number: string;
  billingAddress: string;
  shippingAddress: string;
  wishlist: mongoose.Types.ObjectId;
}

const userSchema: Schema<IUser> = new Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  displayName: {
    type: String,
  },
  googleId: String,
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
  },
  password: {
    type: String,
    select: false,
  },
  hasAgreedToPrivacyPolicy: {
    type: Boolean,
    required: true,
    default: false,
  },
  VAT_Number: {
    type: String,
  },
  SSN_Number: {
    type: String,
  },
  GSTIN_Number: {
    type: String,
  },
  billingAddress: {
    type: String,
  },
  shippingAddress: {
    type: String,
  },
  wishlist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Wishlist",
  },
});

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
