import express from "express";
import auth from "../middleware/auth.js";
import { uploadImage } from "../middleware/upload.js";

import User from "../models/User.js";
import Follow from "../models/Follow.js";
import Post from "../models/Post.js";
import Reel from "../models/Reel.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| POST VIEW
|--------------------------------------------------------------------------
*/
function postView(post) {
  const obj = post.toObject
    ? post.toObject()
    : post;

  obj.media = (obj.media || []).map((media) => ({
    ...media,
    url: media.mediaId
      ? `/api/media/${media.mediaId}`
      : null,
  }));

  return obj;
}

/*
|--------------------------------------------------------------------------
| REEL VIEW
|--------------------------------------------------------------------------
*/
function reelView(reel) {
  const obj = reel.toObject
    ? reel.toObject()
    : reel;

  return {
    ...obj,

    mediaUrl: obj.mediaId
      ? `/api/media/${obj.mediaId}`
      : null,

    coverUrl: obj.coverMediaId
      ? `/api/media/${obj.coverMediaId}`
      : null,
  };
}

/*
|--------------------------------------------------------------------------
| SAFE USER
|--------------------------------------------------------------------------
*/
function safe(user) {
  const obj = user.toObject
    ? user.toObject()
    : { ...user };

  delete obj.password;

  if (obj.avatar) {
    delete obj.avatar.data;
  }

  return obj;
}

/*
|--------------------------------------------------------------------------
| GET CURRENT USER
|--------------------------------------------------------------------------
*/
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password -avatar.data");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.json({
      user,
    });
  } catch (error) {
    console.error("Get me error:", error);

    return res.status(500).json({
      message: "Unable to load user",
      error: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| UPDATE CURRENT USER
|--------------------------------------------------------------------------
*/
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

/*
|--------------------------------------------------------------------------
| UPLOAD AVATAR
|--------------------------------------------------------------------------
*/
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

        avatarUrl:
          `/api/users/${user._id}/avatar`,
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

/*
|--------------------------------------------------------------------------
| GET AVATAR
|--------------------------------------------------------------------------
*/
router.get("/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(
      req.params.id
    ).select("avatar");

    if (!user?.avatar?.data) {
      return res.status(404).send(
        "Avatar not found"
      );
    }

    res.set(
      "Content-Type",
      user.avatar.contentType ||
        "image/jpeg"
    );

    res.set(
      "Cache-Control",
      "public, max-age=3600"
    );

    return res.send(user.avatar.data);
  } catch (error) {
    console.error("Get avatar error:", error);

    return res.status(500).send(
      "Unable to load avatar"
    );
  }
});

/*
|--------------------------------------------------------------------------
| DELETE AVATAR
|--------------------------------------------------------------------------
*/
router.delete(
  "/me/avatar",
  auth,
  async (req, res) => {
    try {
      const user = await User.findById(
        req.user.id
      );

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
      console.error(
        "Delete avatar error:",
        error
      );

      return res.status(500).json({
        message: "Unable to delete avatar",
        error: error.message,
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| SEARCH USERS
|--------------------------------------------------------------------------
*/
router.get("/search", auth, async (req, res) => {
  try {
    const q = String(
      req.query.q || ""
    ).trim();

    if (!q) {
      return res.json({
        users: [],
      });
    }

    const users = await User.find({
      $or: [
        {
          username: {
            $regex: q,
            $options: "i",
          },
        },

        {
          name: {
            $regex: q,
            $options: "i",
          },
        },
      ],
    })
      .select(
        "-password -avatar.data"
      )
      .limit(30);

    return res.json({
      users,
    });
  } catch (error) {
    console.error(
      "Search users error:",
      error
    );

    return res.status(500).json({
      message: "Unable to search users",
      error: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| GET USER PROFILE
|--------------------------------------------------------------------------
|
| Important fields returned:
|
| followStatus
| canViewContent
| canViewConnections
| mutualFollow
|
|--------------------------------------------------------------------------
*/
router.get(
  "/:id/profile",
  auth,
  async (req, res) => {
    try {
      const user = await User.findById(
        req.params.id
      )
        .select(
          "-password -avatar.data"
        )
        .lean();

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const isSelf =
        String(user._id) ===
        String(req.user.id);

      /*
      |--------------------------------------------------------------------------
      | Current user's relationship to profile owner
      |--------------------------------------------------------------------------
      */
      const relationship = isSelf
        ? null
        : await Follow.findOne({
            follower: req.user.id,
            following: user._id,
          }).lean();

      const followStatus = isSelf
        ? "self"
        : relationship?.status ||
          "none";

      /*
      |--------------------------------------------------------------------------
      | CONNECTION PRIVACY
      |--------------------------------------------------------------------------
      */
      let canViewConnections =
        isSelf || !user.isPrivate;

      let mutualFollow = false;

      /*
      |--------------------------------------------------------------------------
      | Private profile
      |--------------------------------------------------------------------------
      */
      if (
        !isSelf &&
        user.isPrivate
      ) {
        /*
        |--------------------------------------------------------------------------
        | Viewer -> profile owner
        |--------------------------------------------------------------------------
        */
        const viewerFollowsOwner =
          followStatus === "accepted";

        /*
        |--------------------------------------------------------------------------
        | Profile owner -> viewer
        |--------------------------------------------------------------------------
        */
        const ownerFollowsViewer =
          await Follow.exists({
            follower: user._id,
            following: req.user.id,
            status: "accepted",
          });

        /*
        |--------------------------------------------------------------------------
        | Mutual accepted relationship
        |--------------------------------------------------------------------------
        */
        mutualFollow =
          viewerFollowsOwner &&
          !!ownerFollowsViewer;

        canViewConnections =
          mutualFollow;
      }

      /*
      |--------------------------------------------------------------------------
      | CONTENT PRIVACY
      |--------------------------------------------------------------------------
      |
      | Private account content is available to:
      |
      | - owner
      | - accepted follower
      |
      |--------------------------------------------------------------------------
      */
      const canViewContent =
        isSelf ||
        !user.isPrivate ||
        followStatus === "accepted";

      /*
      |--------------------------------------------------------------------------
      | Private account not accessible
      |--------------------------------------------------------------------------
      */
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

      /*
      |--------------------------------------------------------------------------
      | POSTS
      |--------------------------------------------------------------------------
      */
      const posts =
        await Post.find({
          author: user._id,

          archived: false,

          deletedAt: null,
        })
          .populate(
            "author",
            "name username isPrivate"
          )
          .sort({
            pinned: -1,
            createdAt: -1,
          })
          .limit(100)
          .lean();

      /*
      |--------------------------------------------------------------------------
      | REELS
      |--------------------------------------------------------------------------
      */
      const reels =
        await Reel.find({
          author: user._id,
        })
          .populate(
            "author",
            "name username isPrivate"
          )
          .sort({
            createdAt: -1,
          })
          .limit(100)
          .lean();

      /*
      |--------------------------------------------------------------------------
      | TAGGED POSTS
      |--------------------------------------------------------------------------
      */
      const tagged =
        await Post.find({
          mentions: user._id,

          archived: false,

          deletedAt: null,
        })
          .populate(
            "author",
            "name username isPrivate"
          )
          .sort({
            createdAt: -1,
          })
          .limit(100)
          .lean();

      /*
      |--------------------------------------------------------------------------
      | RESPONSE
      |--------------------------------------------------------------------------
      */
      return res.json({
        user,

        followStatus,

        canViewContent: true,

        canViewConnections,

        mutualFollow,

        posts:
          posts.map(postView),

        reels:
          reels.map(reelView),

        tagged:
          tagged.map(postView),
      });
    } catch (error) {
      console.error(
        "Profile error:",
        error
      );

      return res.status(500).json({
        message: "Unable to load profile",
        error: error.message,
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| GET USER BY ID
|--------------------------------------------------------------------------
*/
router.get(
  "/:id",
  auth,
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.params.id
        ).select(
          "-password -avatar.data"
        );

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const following =
        await Follow.findOne({
          follower: req.user.id,
          following: user._id,
          status: "accepted",
        });

      return res.json({
        user,

        following:
          !!following,
      });
    } catch (error) {
      console.error(
        "Get user error:",
        error
      );

      return res.status(500).json({
        message: "Unable to load user",
        error: error.message,
      });
    }
  }
);

export default router;