import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    mediaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Media",
      default: null
    },

    kind: {
      type: String,
      enum: ["image", "video", "text"],
      default: "image"
    },

    text: {
      type: String,
      default: ""
    },

    background: {
      type: String,
      default: ""
    },

    closeFriends: {
      type: Boolean,
      default: false
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true
    },

    views: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  },
  {
    timestamps: true
  }
);

export default mongoose.model(
  "Story",
  storySchema
);