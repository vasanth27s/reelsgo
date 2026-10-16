import mongoose from "mongoose";

const UserSettingsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
  preferences: { type: mongoose.Schema.Types.Mixed, default: {} },
  blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  restrictedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  hiddenStoryUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true, minimize: false });

export default mongoose.models.UserSettings || mongoose.model("UserSettings", UserSettingsSchema);
