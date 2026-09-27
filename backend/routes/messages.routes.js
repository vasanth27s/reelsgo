import express from "express";
import mongoose from "mongoose";

import auth from "../middleware/auth.js";

import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

const router = express.Router();

/*
=========================================================
HELPERS
=========================================================
*/

function safeUser(user) {
  if (!user) return null;

  const obj =
    user.toObject
      ? user.toObject()
      : { ...user };

  delete obj.password;

  if (obj.avatar) {
    delete obj.avatar.data;
  }

  return obj;
}

function isMember(conversation, userId) {
  return (
    conversation?.members || []
  ).some(
    member =>
      String(
        member?._id ||
        member
      ) === String(userId)
  );
}

/*
=========================================================
GET CONVERSATIONS
=========================================================
*/

router.get(
  "/conversations",
  auth,
  async (req, res) => {
    try {
      const conversations =
        await Conversation.find({
          members: req.user.id
        })
          .populate(
            "members",
            "-password -avatar.data"
          )
          .populate(
            "lastMessage"
          )
          .sort({
            updatedAt: -1
          })
          .lean();

      res.json({
        conversations
      });
    } catch (e) {
      console.error(e);

      res.status(500).json({
        message:
          e.message ||
          "Unable to load conversations"
      });
    }
  }
);

/*
=========================================================
CREATE / FIND CONVERSATION
=========================================================
*/

router.post(
  "/conversations",
  auth,
  async (req, res) => {
    try {
      const members =
        Array.isArray(req.body.members)
          ? req.body.members
          : [];

      const uniqueMembers = [
        ...new Set([
          String(req.user.id),
          ...members.map(String)
        ])
      ];

      if (uniqueMembers.length < 2) {
        return res.status(400).json({
          message:
            "A conversation needs another user"
        });
      }

      const users =
        await User.find({
          _id: {
            $in: uniqueMembers
          }
        }).select(
          "_id name username isPrivate"
        );

      if (
        users.length !==
        uniqueMembers.length
      ) {
        return res.status(404).json({
          message:
            "One or more users were not found"
        });
      }

      let conversation =
        await Conversation.findOne({
          members: {
            $all: uniqueMembers
          },
          $expr: {
            $eq: [
              {
                $size: "$members"
              },
              uniqueMembers.length
            ]
          }
        });

      if (!conversation) {
        conversation =
          await Conversation.create({
            members: uniqueMembers
          });
      }

      await conversation.populate(
        "members",
        "-password -avatar.data"
      );

      res.json({
        conversation
      });
    } catch (e) {
      console.error(e);

      res.status(500).json({
        message:
          e.message ||
          "Unable to create conversation"
      });
    }
  }
);

/*
=========================================================
GET MESSAGES
=========================================================
*/

router.get(
  "/conversations/:conversationId/messages",
  auth,
  async (req, res) => {
    try {
      const {
        conversationId
      } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          conversationId
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid conversation ID"
        });
      }

      const conversation =
        await Conversation.findById(
          conversationId
        );

      if (!conversation) {
        return res.status(404).json({
          message:
            "Conversation not found"
        });
      }

      if (
        !isMember(
          conversation,
          req.user.id
        )
      ) {
        return res.status(403).json({
          message:
            "You are not a member of this conversation"
        });
      }

      const messages =
        await Message.find({
          conversation:
            conversationId
        })
          .populate(
            "sender",
            "-password -avatar.data"
          )
          .sort({
            createdAt: 1
          })
          .lean();

      res.json({
        messages
      });
    } catch (e) {
      console.error(e);

      res.status(500).json({
        message:
          e.message ||
          "Unable to load messages"
      });
    }
  }
);

/*
=========================================================
SEND MESSAGE
=========================================================
*/

router.post(
  "/conversations/:conversationId/messages",
  auth,
  async (req, res) => {
    try {
      const {
        conversationId
      } = req.params;

      const text =
        String(
          req.body.text || ""
        ).trim();

      if (!text) {
        return res.status(400).json({
          message:
            "Message cannot be empty"
        });
      }

      if (
        !mongoose.Types.ObjectId.isValid(
          conversationId
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid conversation ID"
        });
      }

      const conversation =
        await Conversation.findById(
          conversationId
        );

      if (!conversation) {
        return res.status(404).json({
          message:
            "Conversation not found"
        });
      }

      if (
        !isMember(
          conversation,
          req.user.id
        )
      ) {
        return res.status(403).json({
          message:
            "You are not a member of this conversation"
        });
      }

      const message =
        await Message.create({
          conversation:
            conversationId,
          sender:
            req.user.id,
          text,
          seenBy: [
            req.user.id
          ]
        });

      conversation.lastMessage =
        message._id;

      await conversation.save();

      await message.populate(
        "sender",
        "-password -avatar.data"
      );

      res.status(201).json({
        message
      });
    } catch (e) {
      console.error(e);

      res.status(500).json({
        message:
          e.message ||
          "Unable to send message"
      });
    }
  }
);

/*
=========================================================
MARK MESSAGE AS SEEN
=========================================================
*/

router.post(
  "/messages/:messageId/seen",
  auth,
  async (req, res) => {
    try {
      const {
        messageId
      } = req.params;

      const message =
        await Message.findById(
          messageId
        );

      if (!message) {
        return res.status(404).json({
          message:
            "Message not found"
        });
      }

      const conversation =
        await Conversation.findById(
          message.conversation
        );

      if (!conversation) {
        return res.status(404).json({
          message:
            "Conversation not found"
        });
      }

      if (
        !isMember(
          conversation,
          req.user.id
        )
      ) {
        return res.status(403).json({
          message:
            "Not allowed"
        });
      }

      const alreadySeen =
        (message.seenBy || []).some(
          id =>
            String(id) ===
            String(req.user.id)
        );

      if (!alreadySeen) {
        message.seenBy =
          message.seenBy || [];

        message.seenBy.push(
          req.user.id
        );

        await message.save();
      }

      res.json({
        ok: true
      });
    } catch (e) {
      console.error(e);

      res.status(500).json({
        message:
          e.message ||
          "Unable to mark message as seen"
      });
    }
  }
);

/*
=========================================================
DELETE MY MESSAGE
=========================================================

Only the person who originally sent the
message can delete it.
=========================================================
*/

router.delete(
  "/messages/:messageId",
  auth,
  async (req, res) => {
    try {
      const {
        messageId
      } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          messageId
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid message ID"
        });
      }

      const message =
        await Message.findById(
          messageId
        );

      if (!message) {
        return res.status(404).json({
          message:
            "Message not found"
        });
      }

      /*
       * IMPORTANT:
       * Only the sender can delete
       * their own message.
       */

      if (
        String(message.sender) !==
        String(req.user.id)
      ) {
        return res.status(403).json({
          message:
            "You can only delete your own messages"
        });
      }

      const conversation =
        await Conversation.findById(
          message.conversation
        );

      if (!conversation) {
        return res.status(404).json({
          message:
            "Conversation not found"
        });
      }

      if (
        !isMember(
          conversation,
          req.user.id
        )
      ) {
        return res.status(403).json({
          message:
            "You are not a member of this conversation"
        });
      }

      const deletedId =
        message._id;

      await Message.deleteOne({
        _id: deletedId
      });

      /*
       * If the deleted message was
       * the conversation's last message,
       * find the previous message.
       */

      if (
        String(
          conversation.lastMessage
        ) ===
        String(deletedId)
      ) {
        const previous =
          await Message.findOne({
            conversation:
              conversation._id
          })
            .sort({
              createdAt: -1
            })
            .select("_id");

        conversation.lastMessage =
          previous?._id || null;

        await conversation.save();
      }

      res.json({
        ok: true,
        messageId:
          String(deletedId)
      });
    } catch (e) {
      console.error(e);

      res.status(500).json({
        message:
          e.message ||
          "Unable to delete message"
      });
    }
  }
);

export default router;