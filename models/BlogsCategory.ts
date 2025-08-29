import mongoose, { Document, Schema } from "mongoose";

interface IBlogsCategory extends Document {
  name: string;
  blogs: mongoose.Types.ObjectId;
}

const blogCategorySchema: Schema<IBlogsCategory> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    blogs: [
      {
        type: Schema.Types.ObjectId,
        ref: "Blog",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

const BlogCategory =
  mongoose.models.BlogCategory ||
  mongoose.model<IBlogsCategory>("BlogCategory", blogCategorySchema);

export default BlogCategory;
