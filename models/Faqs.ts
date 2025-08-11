import mongoose, { Document, Schema } from "mongoose";

interface IFaqItem {
  question: string;
  answer: string;
}

export interface IFaqs extends Document {
  productId?: mongoose.Types.ObjectId;
  items: IFaqItem[];
}

const faqSchema: Schema<IFaqs> = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    items: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

const Faqs = mongoose.models.Faqs || mongoose.model<IFaqs>("Faqs", faqSchema);

export default Faqs;
