import mongoose from "mongoose";

const userSettingsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true
    },

    settings: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },

    blockedUsers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],

    restrictedUsers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }]
  },
  {
    timestamps: true,
    minimize: false
  }
);

export default mongoose.models.UserSettings ||
  mongoose.model("UserSettings", userSettingsSchema);