import express from "express";
import auth from "../middleware/auth.js";
import User from "../models/User.js";
import Follow from "../models/Follow.js";
import Notification from "../models/Notification.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| FOLLOW USER
|--------------------------------------------------------------------------
| Public account  -> accepted immediately
| Private account -> pending request
*/
router.post("/:userId", auth, async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    const currentUserId = req.user.id;

    if (String(targetUserId) === String(currentUserId)) {
      return res.status(400).json({
        message: "You cannot follow yourself",
      });
    }

    const target = await User.findById(targetUserId);
    const me = await User.findById(currentUserId);

    if (!target) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!me) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    const existing = await Follow.findOne({
      follower: me._id,
      following: target._id,
    });

    if (existing) {
      return res.json({
        following: existing.status === "accepted",
        status: existing.status,
        requestId: existing._id,
      });
    }

    const status = target.isPrivate ? "pending" : "accepted";

    const follow = await Follow.create({
      follower: me._id,
      following: target._id,
      status,
    });

    /*
    |--------------------------------------------------------------------------
    | Update counts only when immediately accepted
    |--------------------------------------------------------------------------
    */
    if (status === "accepted") {
      await User.findByIdAndUpdate(me._id, {
        $inc: {
          followingCount: 1,
        },
      });

      await User.findByIdAndUpdate(target._id, {
        $inc: {
          followersCount: 1,
        },
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Notification
    |--------------------------------------------------------------------------
    */
    await Notification.create({
      recipient: target._id,
      actor: me._id,
      type: status === "pending" ? "follow_request" : "follow",
      text:
        status === "pending"
          ? `${me.username} requested to follow you`
          : `${me.username} started following you`,
    });

    return res.json({
      following: status === "accepted",
      status,
      requestId: follow._id,
    });
  } catch (error) {
    console.error("Follow error:", error);

    return res.status(500).json({
      message: "Unable to follow user",
      error: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| UNFOLLOW USER / CANCEL FOLLOW REQUEST
|--------------------------------------------------------------------------
*/
router.delete("/:userId", auth, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const targetUserId = req.params.userId;

    const existing = await Follow.findOneAndDelete({
      follower: currentUserId,
      following: targetUserId,
    });

    if (!existing) {
      return res.json({
        following: false,
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Only decrease counters if the relationship was accepted
    |--------------------------------------------------------------------------
    */
    if (existing.status === "accepted") {
      await User.findByIdAndUpdate(currentUserId, {
        $inc: {
          followingCount: -1,
        },
      });

      await User.findByIdAndUpdate(targetUserId, {
        $inc: {
          followersCount: -1,
        },
      });
    }

    return res.json({
      following: false,
      status: null,
    });
  } catch (error) {
    console.error("Unfollow error:", error);

    return res.status(500).json({
      message: "Unable to unfollow user",
      error: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| GET FOLLOW REQUESTS
|--------------------------------------------------------------------------
*/
router.get("/requests", auth, async (req, res) => {
  try {
    const rows = await Follow.find({
      following: req.user.id,
      status: "pending",
    })
      .populate(
        "follower",
        "name username isPrivate updatedAt"
      )
      .sort({
        createdAt: -1,
      });

    return res.json({
      requests: rows,
    });
  } catch (error) {
    console.error("Follow requests error:", error);

    return res.status(500).json({
      message: "Unable to load follow requests",
      error: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| ACCEPT FOLLOW REQUEST
|--------------------------------------------------------------------------
*/
router.post(
  "/requests/:requestId/accept",
  auth,
  async (req, res) => {
    try {
      const request = await Follow.findOne({
        _id: req.params.requestId,
        following: req.user.id,
        status: "pending",
      });

      if (!request) {
        return res.status(404).json({
          message: "Follow request not found",
        });
      }

      request.status = "accepted";

      await request.save();

      /*
      |--------------------------------------------------------------------------
      | Update both counters
      |--------------------------------------------------------------------------
      */
      await User.findByIdAndUpdate(request.follower, {
        $inc: {
          followingCount: 1,
        },
      });

      await User.findByIdAndUpdate(request.following, {
        $inc: {
          followersCount: 1,
        },
      });

      /*
      |--------------------------------------------------------------------------
      | Notify requester
      |--------------------------------------------------------------------------
      */
      await Notification.create({
        recipient: request.follower,
        actor: request.following,
        type: "follow_accepted",
        text: "accepted your follow request",
      });

      return res.json({
        accepted: true,
        status: "accepted",
      });
    } catch (error) {
      console.error("Accept request error:", error);

      return res.status(500).json({
        message: "Unable to accept follow request",
        error: error.message,
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| REJECT FOLLOW REQUEST
|--------------------------------------------------------------------------
*/
router.post(
  "/requests/:requestId/decline",
  auth,
  async (req, res) => {
    try {
      const request = await Follow.findOneAndDelete({
        _id: req.params.requestId,
        following: req.user.id,
        status: "pending",
      });

      if (!request) {
        return res.status(404).json({
          message: "Follow request not found",
        });
      }

      return res.json({
        declined: true,
      });
    } catch (error) {
      console.error("Decline request error:", error);

      return res.status(500).json({
        message: "Unable to decline follow request",
        error: error.message,
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| CHECK WHETHER VIEWER CAN SEE CONNECTION LISTS
|--------------------------------------------------------------------------
|
| PUBLIC ACCOUNT:
|     Anyone authenticated can see Followers / Following.
|
| PRIVATE ACCOUNT:
|     Owner can see their own lists.
|
|     Another user can see the lists ONLY if:
|
|       viewer -> target = accepted
|       target -> viewer = accepted
|
|     In other words:
|
|       A follows B
|       B follows A
|
|     Both relationships must be accepted.
|--------------------------------------------------------------------------
*/
async function canViewConnections(viewerId, targetId) {
  /*
  |--------------------------------------------------------------------------
  | Account owner
  |--------------------------------------------------------------------------
  */
  if (String(viewerId) === String(targetId)) {
    return true;
  }

  /*
  |--------------------------------------------------------------------------
  | Get target privacy
  |--------------------------------------------------------------------------
  */
  const target = await User.findById(targetId)
    .select("isPrivate")
    .lean();

  if (!target) {
    return null;
  }

  /*
  |--------------------------------------------------------------------------
  | Public account
  |--------------------------------------------------------------------------
  */
  if (!target.isPrivate) {
    return true;
  }

  /*
  |--------------------------------------------------------------------------
  | Private account
  |--------------------------------------------------------------------------
  | Check BOTH directions.
  |--------------------------------------------------------------------------
  */
  const [viewerFollowsTarget, targetFollowsViewer] =
    await Promise.all([
      Follow.exists({
        follower: viewerId,
        following: targetId,
        status: "accepted",
      }),

      Follow.exists({
        follower: targetId,
        following: viewerId,
        status: "accepted",
      }),
    ]);

  return (
    !!viewerFollowsTarget &&
    !!targetFollowsViewer
  );
}

/*
|--------------------------------------------------------------------------
| GET FOLLOWERS
|--------------------------------------------------------------------------
|
| GET:
| /api/follows/:userId/followers
|--------------------------------------------------------------------------
*/
router.get(
  "/:userId/followers",
  auth,
  async (req, res) => {
    try {
      const targetUserId = req.params.userId;
      const viewerId = req.user.id;

      const allowed = await canViewConnections(
        viewerId,
        targetUserId
      );

      /*
      |--------------------------------------------------------------------------
      | User doesn't exist
      |--------------------------------------------------------------------------
      */
      if (allowed === null) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | Private account and viewer is not mutual
      |--------------------------------------------------------------------------
      */
      if (!allowed) {
        return res.status(403).json({
          message:
            "Followers list is available only to approved mutual followers",
          code: "CONNECTIONS_PRIVATE",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | Get accepted followers
      |--------------------------------------------------------------------------
      */
      const rows = await Follow.find({
        following: targetUserId,
        status: "accepted",
      })
        .populate(
          "follower",
          "name username isPrivate updatedAt"
        )
        .sort({
          createdAt: -1,
        });

      const users = rows
        .map((row) => row.follower)
        .filter(Boolean);

      return res.json({
        users,
      });
    } catch (error) {
      console.error("Followers list error:", error);

      return res.status(500).json({
        message: "Unable to load followers",
        error: error.message,
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| GET FOLLOWING
|--------------------------------------------------------------------------
|
| GET:
| /api/follows/:userId/following
|--------------------------------------------------------------------------
*/
router.get(
  "/:userId/following",
  auth,
  async (req, res) => {
    try {
      const targetUserId = req.params.userId;
      const viewerId = req.user.id;

      const allowed = await canViewConnections(
        viewerId,
        targetUserId
      );

      /*
      |--------------------------------------------------------------------------
      | User doesn't exist
      |--------------------------------------------------------------------------
      */
      if (allowed === null) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | Private account and viewer is not mutual
      |--------------------------------------------------------------------------
      */
      if (!allowed) {
        return res.status(403).json({
          message:
            "Following list is available only to approved mutual followers",
          code: "CONNECTIONS_PRIVATE",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | Get accepted following users
      |--------------------------------------------------------------------------
      */
      const rows = await Follow.find({
        follower: targetUserId,
        status: "accepted",
      })
        .populate(
          "following",
          "name username isPrivate updatedAt"
        )
        .sort({
          createdAt: -1,
        });

      const users = rows
        .map((row) => row.following)
        .filter(Boolean);

      return res.json({
        users,
      });
    } catch (error) {
      console.error("Following list error:", error);

      return res.status(500).json({
        message: "Unable to load following",
        error: error.message,
      });
    }
  }
);

export default router;