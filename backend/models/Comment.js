import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true, index: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null },
  text: { type: String, required: true, maxlength: 1000 },
  likesCount: { type: Number, default: 0 },
  pinned: { type: Boolean, default: false },
  hidden: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("Comment", commentSchema);
