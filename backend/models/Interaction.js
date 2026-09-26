import mongoose from "mongoose";

const interactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  targetType: { type: String, enum: ["post", "reel", "comment"], required: true },
  target: { type: mongoose.Schema.Types.ObjectId, required: true },
  type: { type: String, enum: ["like", "save"], required: true }
}, { timestamps: true });

interactionSchema.index({ user: 1, targetType: 1, target: 1, type: 1 }, { unique: true });

export default mongoose.model("Interaction", interactionSchema);
