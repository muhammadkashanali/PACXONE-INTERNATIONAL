import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.model("Category", categorySchema);
