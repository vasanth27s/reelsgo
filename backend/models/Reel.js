import mongoose from "mongoose";

const reelSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  mediaId: { type: mongoose.Schema.Types.ObjectId, ref: "Media", required: true },
  coverMediaId: { type: mongoose.Schema.Types.ObjectId, ref: "Media", default: null },
  caption: { type: String, default: "" },
  hashtags: [String],
  mentions: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  location: { type: String, default: "" },
  music: { type: String, default: "" },
  likesCount: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 },
  sharesCount: { type: Number, default: 0 },
  savesCount: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("Reel", reelSchema);
