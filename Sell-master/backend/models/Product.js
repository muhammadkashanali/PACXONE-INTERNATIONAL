import mongoose from "mongoose";

const specSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false },
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    categoryId: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: false },
    description: { type: String, required: true },
    image: { type: String, default: "" },
    datasheet: { type: String, default: "", trim: true },
    features: [{ type: String }],
    applications: [{ type: String }],
    specs: [specSchema],
    availability: { type: String, enum: ["In Stock", "On Order", "Limited"], default: "In Stock" },
    featured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.model("Product", productSchema);
