import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, maxlength: 60, required: true },
  music: { type: String, default: "" },
  audience: { type: String, enum: ["followers", "close_friends"], default: "followers" },
  expiresAt: { type: Date, required: true, index: true }
}, { timestamps: true });

export default mongoose.model("Note", noteSchema);
