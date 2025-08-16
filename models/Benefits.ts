import mongoose, { Document, Schema } from "mongoose";

interface IBenefits extends Document {
  name: string;
}

const benefitsSchema: Schema<IBenefits> = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

const Benefit =
  mongoose.models.Benefit ||
  mongoose.model<IBenefits>("Benefit", benefitsSchema);

export default Benefit;
