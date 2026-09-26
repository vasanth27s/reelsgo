import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  kind: { type: String, enum: ["image", "video"], required: true },
  contentType: { type: String, required: true },
  data: { type: Buffer, required: true },
  fileName: { type: String, default: "" },
  size: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("Media", mediaSchema);
