import mongoose from "mongoose";

const commentModerationSchema = new mongoose.Schema({
  actor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  targetUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  reel: { type: mongoose.Schema.Types.ObjectId, ref: "Reel", required: true, index: true },
  comment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null },
  action: { type: String, enum: ["restrict", "block", "report"], required: true, index: true },
  reason: { type: String, default: "", maxlength: 500 }
}, { timestamps: true });

commentModerationSchema.index({ actor: 1, targetUser: 1, reel: 1, action: 1 });
export default mongoose.models.CommentModeration || mongoose.model("CommentModeration", commentModerationSchema);
