// models/coupon.model.ts
import mongoose, { Schema, Model, Document } from "mongoose";

export interface ICoupon extends Document {
  code: string;
  discountPercentage: number;
  maxDiscountAmount: number;
  minOrderAmount: number; // mandatory order size
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    discountPercentage: {
      type: Number,
      required: true,
    },
    maxDiscountAmount: {
      type: Number,
      required: true,
    },
    minOrderAmount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

// Avoid recompilation issues in Next.js
const Coupon: Model<ICoupon> =
  mongoose.models.Coupon || mongoose.model<ICoupon>("Coupon", CouponSchema);

export default Coupon;
