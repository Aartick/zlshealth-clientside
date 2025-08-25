import mongoose, { Document, Schema } from "mongoose";

export interface IContentSection {
  heading: string;
  body: string;
}

export interface IComment {
  user: mongoose.Types.ObjectId;
  text: string;
  createdAt: Date;
}

export interface IBlog extends Document {
  category: mongoose.Types.ObjectId;
  title: string;
  content: IContentSection[];
  imageUrl: {
    public_id: string;
    url: string;
  };
  author: mongoose.Types.ObjectId;
  postedOn: Date;
  comments: IComment[];
}

const contentSectionSchema = new Schema<IContentSection>(
  {
    heading: { type: String, required: true },
    body: { type: String, required: true },
  },
  { _id: false }
);

const commentSchema = new Schema<IComment>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const blogSchema: Schema<IBlog> = new Schema(
  {
    category: {
      type: Schema.Types.ObjectId,
      ref: "BlogCategory",
      required: true,
    },
    title: { type: String, required: true },
    content: { type: [contentSectionSchema], required: true },
    imageUrl: {
      public_id: {
        type: String,
        default: "",
      },
      url: {
        type: String,
        default: "",
      },
    },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    postedOn: { type: Date, default: Date.now },
    comments: { type: [commentSchema], default: [] },
  },
  { timestamps: true }
);

const Blog = mongoose.models.Blog || mongoose.model<IBlog>("Blog", blogSchema);

export default Blog;
