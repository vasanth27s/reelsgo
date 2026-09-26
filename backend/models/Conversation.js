import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
  group: { type: Boolean, default: false },
  title: { type: String, default: "" },
  admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message", default: null },
  pinnedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  mutedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
}, { timestamps: true });

export default mongoose.model("Conversation", conversationSchema);
