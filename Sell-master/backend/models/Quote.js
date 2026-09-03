import mongoose from "mongoose";

const quoteSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    company: { type: String, default: "" },
    phone: { type: String, default: "" },
    email: { type: String, required: true, trim: true },
    productName: { type: String, default: "" },
    message: { type: String, required: true },
    status: { type: String, enum: ["new", "contacted", "quoted", "closed"], default: "new" },
    source: { type: String, default: "website" },
  },
  { timestamps: true },
);

export default mongoose.model("Quote", quoteSchema);
