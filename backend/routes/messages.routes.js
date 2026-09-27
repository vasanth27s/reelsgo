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

      /*
       * Count unread messages.
       *
       * A message is unread when:
       * - It was sent by another user
       * - Current user has not seen it
       * - It was not deleted for current user
       */

      const conversationsWithUnread =
        await Promise.all(
          conversations.map(
            async conversation => {
              const unreadCount =
                await Message.countDocuments({
                  conversation:
                    conversation._id,

                  sender: {
                    $ne:
                      req.user.id
                  },

                  seenBy: {
                    $ne:
                      req.user.id
                  },

                  deletedFor: {
                    $ne:
                      req.user.id
                  }
                });

              return {
                ...conversation,
                unreadCount
              };
            }
          )
        );

      res.json({
        conversations:
          conversationsWithUnread
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

      /*
       * Always include current user.
       */
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

      /*
       * Verify all users exist.
       */
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

      /*
       * Find existing conversation.
       */
      let conversation =
        await Conversation.findOne({
          members: {
            $all:
              uniqueMembers
          },

          $expr: {
            $eq: [
              {
                $size:
                  "$members"
              },
              uniqueMembers.length
            ]
          }
        });

      /*
       * Create if it does not exist.
       */
      if (!conversation) {
        conversation =
          await Conversation.create({
            members:
              uniqueMembers
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

      /*
       * Validate conversation ID.
       */
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

      /*
       * Find conversation.
       */
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

      /*
       * Verify membership.
       */
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

      /*
       * Load messages.
       *
       * seenAt is automatically included.
       */
      const messages =
        await Message.find({
          conversation:
            conversationId,

          deletedFor: {
            $ne:
              req.user.id
          }
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

      /*
       * Message cannot be empty.
       */
      if (!text) {
        return res.status(400).json({
          message:
            "Message cannot be empty"
        });
      }

      /*
       * Validate conversation ID.
       */
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

      /*
       * Find conversation.
       */
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

      /*
       * Verify membership.
       */
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

      /*
       * Create message.
       *
       * Sender has already seen their
       * own message.
       *
       * seenAt stays null because the
       * receiver has not seen it yet.
       */
      const message =
        await Message.create({
          conversation:
            conversationId,

          sender:
            req.user.id,

          text,

          seenBy: [
            req.user.id
          ],

          seenAt: null
        });

      /*
       * Update last message.
       */
      conversation.lastMessage =
        message._id;

      await conversation.save();

      /*
       * Populate sender.
       */
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

      /*
       * Validate message ID.
       */
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

      /*
       * Find message.
       */
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
       * Find conversation.
       */
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

      /*
       * Verify that current user belongs
       * to the conversation.
       */
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

      /*
       * Check whether current user already
       * exists in seenBy.
       */
      const alreadySeen =
        (message.seenBy || []).some(
          id =>
            String(id) ===
            String(req.user.id)
        );

      /*
       * If this is the first time this
       * message is seen by the receiver:
       *
       * 1. Add receiver to seenBy
       * 2. Store exact current time in seenAt
       */
      if (!alreadySeen) {
        message.seenBy =
          message.seenBy || [];

        message.seenBy.push(
          req.user.id
        );

        message.seenAt =
          new Date();

        await message.save();
      }

      /*
       * For older messages that already
       * have seenBy but don't have seenAt,
       * create a seenAt value.
       */
      else if (!message.seenAt) {
        message.seenAt =
          new Date();

        await message.save();
      }

      res.json({
        ok: true,

        seenAt:
          message.seenAt
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
*/

router.delete(
  "/messages/:messageId",
  auth,
  async (req, res) => {
    try {
      const {
        messageId
      } = req.params;

      /*
       * Validate message ID.
       */
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

      /*
       * Find message.
       */
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
       * Only original sender can delete
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

      /*
       * Find conversation.
       */
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

      /*
       * Verify membership.
       */
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

      /*
       * Permanently delete the message.
       */
      await Message.deleteOne({
        _id:
          deletedId
      });

      /*
       * If the deleted message was the
       * conversation's last message,
       * restore the previous message.
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
          previous?._id ||
          null;

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