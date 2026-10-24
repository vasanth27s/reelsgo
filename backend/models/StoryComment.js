import mongoose from "mongoose";

const storyCommentSchema = new mongoose.Schema({
  story: { type: mongoose.Schema.Types.ObjectId, ref: "Story", required: true, index: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true, trim: true, maxlength: 1000 }
}, { timestamps: true });

export default mongoose.models.StoryComment || mongoose.model("StoryComment", storyCommentSchema);
