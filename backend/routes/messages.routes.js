import express from "express";
import auth from "../middleware/auth.js";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Helper
|--------------------------------------------------------------------------
*/

function uniqueIds(ids = []) {
  return [...new Set(ids.map(String))];
}

function isMember(conversation, userId) {
  return conversation.members.some(
    id => String(id?._id || id) === String(userId)
  );
}

/*
|--------------------------------------------------------------------------
| GET CONVERSATIONS
|--------------------------------------------------------------------------
*/

router.get("/conversations", auth, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      members: req.user.id
    })
      .populate(
        "members",
        "name username isPrivate updatedAt"
      )
      .populate({
        path: "lastMessage",
        populate: {
          path: "sender",
          select: "name username"
        }
      })
      .sort({
        updatedAt: -1
      })
      .lean();

    const result = conversations.map(c => ({
      ...c,

      members: c.members || [],

      lastMessage: c.lastMessage
        ? {
            ...c.lastMessage,
            text: c.lastMessage.text || "",
            createdAt: c.lastMessage.createdAt
          }
        : null
    }));

    res.json({
      conversations: result
    });
  } catch (error) {
    console.error("GET conversations:", error);

    res.status(500).json({
      message: error.message
    });
  }
});

/*
|--------------------------------------------------------------------------
| CREATE / FIND ONE-TO-ONE CONVERSATION
|--------------------------------------------------------------------------
*/

router.post("/conversations", auth, async (req, res) => {
  try {
    const requestedMembers = Array.isArray(req.body.members)
      ? req.body.members
      : [];

    const memberIds = uniqueIds([
      req.user.id,
      ...requestedMembers
    ]);

    if (memberIds.length < 2) {
      return res.status(400).json({
        message: "Select another user to start a conversation"
      });
    }

    /*
     * This project supports one-to-one and group conversations.
     */

    const existing = await Conversation.findOne({
      members: {
        $all: memberIds,
        $size: memberIds.length
      }
    })
      .populate(
        "members",
        "name username isPrivate updatedAt"
      )
      .populate("lastMessage");

    if (existing) {
      return res.json({
        conversation: existing
      });
    }

    /*
     * Verify users actually exist.
     */

    const users = await User.find({
      _id: {
        $in: memberIds
      }
    }).select(
      "name username isPrivate"
    );

    if (users.length !== memberIds.length) {
      return res.status(404).json({
        message: "One or more users were not found"
      });
    }

    const conversation =
      await Conversation.create({
        members: memberIds,
        group: memberIds.length > 2,
        title: req.body.title || "",
        admins: [req.user.id]
      });

    const populated =
      await Conversation.findById(
        conversation._id
      )
        .populate(
          "members",
          "name username isPrivate updatedAt"
        )
        .populate("lastMessage");

    res.status(201).json({
      conversation: populated
    });
  } catch (error) {
    console.error(
      "CREATE conversation:",
      error
    );

    res.status(500).json({
      message: error.message
    });
  }
});

/*
|--------------------------------------------------------------------------
| GET MESSAGES
|--------------------------------------------------------------------------
*/

router.get(
  "/conversations/:id/messages",
  auth,
  async (req, res) => {
    try {
      const conversation =
        await Conversation.findOne({
          _id: req.params.id,
          members: req.user.id
        });

      if (!conversation) {
        return res.status(403).json({
          message:
            "You are not a member of this conversation"
        });
      }

      const messages =
        await Message.find({
          conversation: conversation._id,

          deletedFor: {
            $ne: req.user.id
          }
        })
          .populate(
            "sender",
            "name username isPrivate updatedAt"
          )
          .populate({
            path: "replyTo",
            populate: {
              path: "sender",
              select: "name username"
            }
          })
          .sort({
            createdAt: 1
          })
          .limit(500);

      res.json({
        messages
      });
    } catch (error) {
      console.error(
        "GET messages:",
        error
      );

      res.status(500).json({
        message: error.message
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| SEND MESSAGE
|--------------------------------------------------------------------------
*/

router.post(
  "/conversations/:id/messages",
  auth,
  async (req, res) => {
    try {
      const conversation =
        await Conversation.findOne({
          _id: req.params.id,
          members: req.user.id
        });

      if (!conversation) {
        return res.status(403).json({
          message:
            "You are not a member of this conversation"
        });
      }

      const text = String(
        req.body.text || ""
      ).trim();

      if (!text) {
        return res.status(400).json({
          message: "Message cannot be empty"
        });
      }

      if (text.length > 5000) {
        return res.status(400).json({
          message:
            "Message must be 5000 characters or less"
        });
      }

      const message =
        await Message.create({
          conversation:
            conversation._id,

          sender:
            req.user.id,

          text,

          replyTo:
            req.body.replyTo || null
        });

      conversation.lastMessage =
        message._id;

      await conversation.save();

      const populated =
        await Message.findById(
          message._id
        )
          .populate(
            "sender",
            "name username isPrivate updatedAt"
          )
          .populate({
            path: "replyTo",
            populate: {
              path: "sender",
              select: "name username"
            }
          });

      /*
       * Create notification for every other
       * conversation member.
       */

      const recipients =
        conversation.members
          .map(id => String(id))
          .filter(
            id =>
              id !==
              String(req.user.id)
          );

      if (recipients.length) {
        await Notification.insertMany(
          recipients.map(recipient => ({
            recipient,

            actor:
              req.user.id,

            type: "message",

            targetId:
              conversation._id,

            text:
              "sent you a message"
          }))
        );
      }

      res.status(201).json({
        message: populated,

        conversation
      });
    } catch (error) {
      console.error(
        "SEND message:",
        error
      );

      res.status(500).json({
        message: error.message
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| MARK MESSAGE SEEN
|--------------------------------------------------------------------------
*/

router.post(
  "/messages/:id/seen",
  auth,
  async (req, res) => {
    try {
      const message =
        await Message.findById(
          req.params.id
        );

      if (!message) {
        return res.status(404).json({
          message: "Message not found"
        });
      }

      const conversation =
        await Conversation.findOne({
          _id: message.conversation,
          members: req.user.id
        });

      if (!conversation) {
        return res.status(403).json({
          message:
            "You are not a member of this conversation"
        });
      }

      await Message.findByIdAndUpdate(
        message._id,
        {
          $addToSet: {
            seenBy: req.user.id
          }
        }
      );

      res.json({
        ok: true
      });
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| MESSAGE REACTION
|--------------------------------------------------------------------------
*/

router.post(
  "/messages/:id/react",
  auth,
  async (req, res) => {
    try {
      const message =
        await Message.findById(
          req.params.id
        );

      if (!message) {
        return res.status(404).json({
          message: "Message not found"
        });
      }

      const conversation =
        await Conversation.findOne({
          _id: message.conversation,
          members: req.user.id
        });

      if (!conversation) {
        return res.status(403).json({
          message:
            "You are not a member of this conversation"
        });
      }

      message.reactions =
        message.reactions.filter(
          reaction =>
            String(
              reaction.user
            ) !==
            String(req.user.id)
        );

      message.reactions.push({
        user: req.user.id,
        emoji:
          req.body.emoji || "❤️"
      });

      await message.save();

      res.json({
        message
      });
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  }
);

export default router;