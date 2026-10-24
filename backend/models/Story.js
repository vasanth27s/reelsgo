
import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
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
    audience: {
      type: String,
      enum: [
        "everyone",
        "contacts",
        "close_friends",
        "selected_contacts"
      ],
      default: "everyone",
      index: true
    },
    selectedContacts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],
    excludedUsers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],
    allowScreenshots: {
      type: Boolean,
      default: true
    },
    keepOnMyPage: {
      type: Boolean,
      default: false
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
    allowComments: {
      type: Boolean,
      default: true
    },
    views: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }]
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Story", storySchema);
