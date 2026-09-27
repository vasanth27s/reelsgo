import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    text: {
      type: String,
      default: ""
    },

    mediaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Media",
      default: null
    },

    kind: {
      type: String,
      enum: ["text", "image", "video", "voice"],
      default: "text"
    },

    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null
    },

    reactions: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },

        emoji: {
          type: String
        }
      }
    ],

    /*
     * Users who have seen this message.
     */
    seenBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    /*
     * Exact time when the message was first seen.
     *
     * Example:
     * Seen just now
     * Seen 1 min ago
     * Seen 2 mins ago
     * Seen 1 hr ago
     */
    seenAt: {
      type: Date,
      default: null
    },

    /*
     * Users for whom this message was deleted.
     */
    deletedFor: [
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
  "Message",
  messageSchema
);