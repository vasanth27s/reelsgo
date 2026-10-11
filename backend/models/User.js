
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: 100,
    },

    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
      match: [
        /^[a-z0-9._]+$/,
        "Username can contain only lowercase letters, numbers, dots, and underscores",
      ],
      index: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
      index: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },

    bio: {
      type: String,
      default: "",
      trim: true,
      maxlength: 150,
    },

    website: {
      type: String,
      default: "",
      trim: true,
      maxlength: 2048,
    },

    avatar: {
      data: Buffer,
      contentType: String,
      fileName: String,
    },

    isPrivate: {
      type: Boolean,
      default: false,
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    phoneVerified: {
      type: Boolean,
      default: false,
    },

    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },

    followersCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    followingCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    postsCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    settings: {
      type: mongoose.Schema.Types.Mixed,
      default: () => ({}),
    },

    blockedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    restrictedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    closeFriends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Keep usernames normalized when documents are saved.
userSchema.pre("save", function (next) {
  if (this.username) {
    this.username = this.username.replace(/^@/, "").toLowerCase();
  }

  if (this.email) {
    this.email = this.email.trim().toLowerCase();
  }

  next();
});

const User =
  mongoose.models.User || mongoose.model("User", userSchema);

export default User;
