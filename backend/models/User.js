import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  username: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  password: { type: String, required: true },
  bio: { type: String, default: "", maxlength: 150 },
  website: { type: String, default: "" },
  avatar: {
    data: Buffer,
    contentType: String,
    fileName: String
  },
  isPrivate: { type: Boolean, default: false },
  emailVerified: { type: Boolean, default: false },
  phoneVerified: { type: Boolean, default: false },
  twoFactorEnabled: { type: Boolean, default: false },
  followersCount: { type: Number, default: 0 },
  followingCount: { type: Number, default: 0 },
  postsCount: { type: Number, default: 0 },
  settings: { type: mongoose.Schema.Types.Mixed, default: {} },
  blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  restrictedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
}, { timestamps: true });

export default mongoose.model("User", userSchema);
