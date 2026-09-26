import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema({
  mediaId: { type: mongoose.Schema.Types.ObjectId, ref: "Media" },
  kind: { type: String, enum: ["image", "video"] },
  caption: { type: String, default: "" },
  altText: { type: String, default: "" },
  width: Number,
  height: Number
}, { _id: false });

const postSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  media: [mediaSchema],
  caption: { type: String, default: "" },
  hashtags: [String],
  mentions: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  location: { type: String, default: "" },
  commentsDisabled: { type: Boolean, default: false },
  hideLikeCount: { type: Boolean, default: false },
  sharingDisabled: { type: Boolean, default: false },
  pinned: { type: Boolean, default: false },
  archived: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
  likesCount: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 },
  sharesCount: { type: Number, default: 0 },
  savesCount: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("Post", postSchema);
