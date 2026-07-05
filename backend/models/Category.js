import mongoose from "mongoose";

const subcategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { _id: true }
);

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    isActive: { type: Boolean, default: true },
    keywords: [String],
    subcategories: [subcategorySchema],
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
