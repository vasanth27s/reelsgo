import mongoose from "mongoose";

const phoneVerificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true
    },

    phoneE164: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    verifiedAt: {
      type: Date,
      required: true,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model(
  "PhoneVerification",
  phoneVerificationSchema
);