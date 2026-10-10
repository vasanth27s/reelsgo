import express from "express";
import auth from "../middleware/auth.js";
import { uploadImage } from "../middleware/upload.js";

import User from "../models/User.js";
import Follow from "../models/Follow.js";
import Post from "../models/Post.js";
import Reel from "../models/Reel.js";

const router = express.Router();

/* --------------------------------------------------
   POST VIEW
-------------------------------------------------- */

function postView(post) {
  const obj = post.toObject ? post.toObject() : { ...post };

  obj.media = (obj.media || []).map((media) => ({
    ...media,
    url: media.mediaId ? `/api/media/${media.mediaId}` : null,
  }));

  return obj;
}

/* --------------------------------------------------
   REEL VIEW
-------------------------------------------------- */

function reelView(reel) {
  const obj = reel.toObject ? reel.toObject() : { ...reel };

  return {
    ...obj,
    mediaUrl: obj.mediaId ? `/api/media/${obj.mediaId}` : null,
    coverUrl: obj.coverMediaId
      ? `/api/media/${obj.coverMediaId}`
      : null,
  };
}

/* --------------------------------------------------
   SAFE USER
-------------------------------------------------- */

function safe(user) {
  const obj = user.toObject ? user.toObject() : { ...user };

  delete obj.password;

  if (obj.avatar) {
    delete obj.avatar.data;
  }

  return obj;
}

/* --------------------------------------------------
   GET CURRENT USER
   GET /api/users/me
-------------------------------------------------- */

router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password -avatar.data");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.json({ user });
  } catch (error) {
    console.error("Get me error:", error);

    return res.status(500).json({
      message: "Unable to load user",
      error: error.message,
    });
  }
});

/* --------------------------------------------------
   CLOSE FRIENDS
   GET /api/users/me/close-friends
-------------------------------------------------- */

router.get("/me/close-friends", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password -avatar.data")
      .populate(
        "closeFriends",
        "name username avatar isPrivate"
      );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.json({
      closeFriends: user.closeFriends || [],
    });
  } catch (error) {
    console.error("Get Close Friends error:", error);

    return res.status(500).json({
      message: "Unable to load Close Friends",
      error: error.message,
    });
  }
});

/* --------------------------------------------------
   ADD CLOSE FRIEND
   POST /api/users/me/close-friends

   Request body:
   { "userId": "USER_OBJECT_ID" }
-------------------------------------------------- */

router.post("/me/close-friends", auth, async (req, res) => {
  try {
    const { userId } = req.body || {};

    if (!userId || !/^[a-f\d]{24}$/i.test(String(userId))) {
      return res.status(400).json({
        message: "A valid userId is required",
      });
    }

    if (String(userId) === String(req.user.id)) {
      return res.status(400).json({
        message: "You cannot add yourself",
      });
    }

    const person = await User.findById(userId).select("_id");

    if (!person) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $addToSet: {
          closeFriends: person._id,
        },
      },
      { new: true, runValidators: true }
    ).populate(
      "closeFriends",
      "name username avatar isPrivate"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.json({
      message: "Close Friend added successfully",
      closeFriends: user.closeFriends || [],
    });
  } catch (error) {
    console.error("Add Close Friend error:", error);

    return res.status(500).json({
      message: "Unable to add Close Friend",
      error: error.message,
    });
  }
});

/* --------------------------------------------------
   REMOVE CLOSE FRIEND
   DELETE /api/users/me/close-friends/:userId
-------------------------------------------------- */

router.delete(
  "/me/close-friends/:userId",
  auth,
  async (req, res) => {
    try {
      const { userId } = req.params;

      if (!/^[a-f\d]{24}$/i.test(String(userId))) {
        return res.status(400).json({
          message: "Invalid user id",
        });
      }

      const user = await User.findByIdAndUpdate(
        req.user.id,
        {
          $pull: {
            closeFriends: userId,
          },
        },
        { new: true, runValidators: true }
      ).populate(
        "closeFriends",
        "name username avatar isPrivate"
      );

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      return res.json({
        message: "Close Friend removed successfully",
        closeFriends: user.closeFriends || [],
      });
    } catch (error) {
      console.error("Remove Close Friend error:", error);

      return res.status(500).json({
        message: "Unable to remove Close Friend",
        error: error.message,
      });
    }
  }
);

/* --------------------------------------------------
   UPDATE CURRENT USER
   PUT /api/users/me
-------------------------------------------------- */

router.put("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    for (const field of [
      "name",
      "bio",
      "website",
      "isPrivate",
    ]) {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    }

    await user.save();

    return res.json({
      user: safe(user),
    });
  } catch (error) {
    console.error("Update user error:", error);

    return res.status(500).json({
      message: "Unable to update profile",
      error: error.message,
    });
  }
});

/* --------------------------------------------------
   UPLOAD AVATAR
   POST /api/users/me/avatar
-------------------------------------------------- */

router.post(
  "/me/avatar",
  auth,
  uploadImage.single("avatar"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "Please select an image",
        });
      }

      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      user.avatar = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        fileName: req.file.originalname,
      };

      await user.save();

      return res.json({
        user: safe(user),
        avatarUrl: `/api/users/${user._id}/avatar`,
      });
    } catch (error) {
      console.error("Avatar upload error:", error);

      return res.status(500).json({
        message: "Unable to upload avatar",
        error: error.message,
      });
    }
  }
);

/* --------------------------------------------------
   GET AVATAR
   GET /api/users/:id/avatar
-------------------------------------------------- */

router.get("/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("avatar");

    if (!user?.avatar?.data) {
      return res.status(404).send("Avatar not found");
    }

    res.set(
      "Content-Type",
      user.avatar.contentType || "image/jpeg"
    );

    res.set("Cache-Control", "public, max-age=3600");

    return res.send(user.avatar.data);
  } catch (error) {
    console.error("Get avatar error:", error);

    return res.status(500).send("Unable to load avatar");
  }
});

/* --------------------------------------------------
   DELETE AVATAR
   DELETE /api/users/me/avatar
-------------------------------------------------- */

router.delete("/me/avatar", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.avatar = undefined;
    await user.save();

    return res.json({
      user: safe(user),
    });
  } catch (error) {
    console.error("Delete avatar error:", error);

    return res.status(500).json({
      message: "Unable to delete avatar",
      error: error.message,
    });
  }
});

/* --------------------------------------------------
   SEARCH USERS
   GET /api/users/search?q=username
-------------------------------------------------- */

router.get("/search", auth, async (req, res) => {
  try {
    const q = String(req.query.q || "").trim();

    if (!q) {
      return res.json({ users: [] });
    }

    const escapedQuery = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const users = await User.find({
      _id: { $ne: req.user.id },
      $or: [
        {
          username: {
            $regex: escapedQuery,
            $options: "i",
          },
        },
        {
          name: {
            $regex: escapedQuery,
            $options: "i",
          },
        },
      ],
    })
      .select("-password -avatar.data")
      .limit(30)
      .lean();

    return res.json({ users });
  } catch (error) {
    console.error("Search users error:", error);

    return res.status(500).json({
      message: "Unable to search users",
      error: error.message,
    });
  }
});

/* --------------------------------------------------
   GET USER PROFILE
   GET /api/users/:id/profile
-------------------------------------------------- */

router.get("/:id/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password -avatar.data")
      .lean();

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isSelf =
      String(user._id) === String(req.user.id);

    const relationship = isSelf
      ? null
      : await Follow.findOne({
          follower: req.user.id,
          following: user._id,
        }).lean();

    const followStatus = isSelf
      ? "self"
      : relationship?.status || "none";

    let canViewConnections = isSelf || !user.isPrivate;
    let mutualFollow = false;

    if (!isSelf && user.isPrivate) {
      const viewerFollowsOwner =
        followStatus === "accepted";

      const ownerFollowsViewer = await Follow.exists({
        follower: user._id,
        following: req.user.id,
        status: "accepted",
      });

      mutualFollow =
        viewerFollowsOwner && Boolean(ownerFollowsViewer);

      canViewConnections = mutualFollow;
    }

    const canViewContent =
      isSelf ||
      !user.isPrivate ||
      followStatus === "accepted";

    if (!canViewContent) {
      return res.json({
        user,
        followStatus,
        canViewContent: false,
        canViewConnections,
        mutualFollow,
        posts: [],
        reels: [],
        tagged: [],
      });
    }

    const posts = await Post.find({
      author: user._id,
      archived: false,
      deletedAt: null,
    })
      .populate("author", "name username isPrivate")
      .sort({ pinned: -1, createdAt: -1 })
      .limit(100)
      .lean();

    const reels = await Reel.find({
      author: user._id,
    })
      .populate("author", "name username isPrivate")
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    const tagged = await Post.find({
      mentions: user._id,
      archived: false,
      deletedAt: null,
    })
      .populate("author", "name username isPrivate")
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return res.json({
      user,
      followStatus,
      canViewContent: true,
      canViewConnections,
      mutualFollow,
      posts: posts.map(postView),
      reels: reels.map(reelView),
      tagged: tagged.map(postView),
    });
  } catch (error) {
    console.error("Profile error:", error);

    return res.status(500).json({
      message: "Unable to load profile",
      error: error.message,
    });
  }
});

/* --------------------------------------------------
   GET USER BY ID
   GET /api/users/:id
-------------------------------------------------- */

router.get("/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password -avatar.data");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const following = await Follow.findOne({
      follower: req.user.id,
      following: user._id,
      status: "accepted",
    });

    return res.json({
      user,
      following: Boolean(following),
    });
  } catch (error) {
    console.error("Get user error:", error);

    return res.status(500).json({
      message: "Unable to load user",
      error: error.message,
    });
  }
});

export default router;