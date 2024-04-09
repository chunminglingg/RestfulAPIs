import mongoose from "mongoose";
import { Schema } from "mongoose";


const bookSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    pages: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Books", bookSchema);