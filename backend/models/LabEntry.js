import mongoose from "mongoose";

const labEntrySchema = new mongoose.Schema({
  kind: { type: String, enum: ["community", "live", "collection", "map"], required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, default: "", trim: true, maxlength: 1200 },
  location: { type: String, default: "", trim: true, maxlength: 200 },
  latitude: { type: Number, min: -90, max: 90 },
  longitude: { type: Number, min: -180, max: 180 },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  isActive: { type: Boolean, default: true, index: true }
}, { timestamps: true });

labEntrySchema.index({ kind: 1, createdAt: -1 });
labEntrySchema.index({ title: "text", description: "text", location: "text" });

export default mongoose.models.LabEntry || mongoose.model("LabEntry", labEntrySchema);
