import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  targetType: { type: String, required: true },
  targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
  reason: { type: String, required: true },
  details: { type: String, default: "" },
  status: { type: String, enum: ["open", "reviewed", "closed"], default: "open" }
}, { timestamps: true });

export default mongoose.model("Report", reportSchema);
