import express from "express";

import auth from "../middleware/auth.js";

import {
  uploadMedia
} from "../middleware/upload.js";

import Media from "../models/Media.js";
import Story from "../models/Story.js";
import User from "../models/User.js";
import Follow from "../models/Follow.js";
import StoryView from "../models/StoryView.js";

const router =
  express.Router();

/*
=========================================================
GET STORIES
=========================================================
*/

router.get(
  "/",
  auth,
  async (req, res) => {
    try {
      /*
       * Get accounts followed by
       * current user.
       */
      const following =
        await Follow.find({
          follower:
            req.user.id,

          status:
            "accepted"
        })
          .select(
            "following"
          )
          .lean();

      const followingIds =
        following.map(
          f => f.following
        );

      const authorIds = [
        req.user.id,
        ...followingIds
      ];

      /*
       * Only active stories.
       */
      const stories =
        await Story.find({
          author: {
            $in:
              authorIds
          },

          expiresAt: {
            $gt:
              new Date()
          }
        })
          .populate(
            "author",
            "name username isPrivate"
          )
          .sort({
            createdAt: -1
          })
          .limit(100)
          .lean();

      /*
       * Find private story authors.
       */
      const privateAuthorIds =
        stories
          .filter(
            s =>
              s.author?.isPrivate &&
              String(
                s.author._id
              ) !==
                String(
                  req.user.id
                )
          )
          .map(
            s =>
              s.author._id
          );

      /*
       * Find accepted private follows.
       */
      const acceptedPrivate =
        privateAuthorIds.length
          ? await Follow.find({
              follower:
                req.user.id,

              following: {
                $in:
                  privateAuthorIds
              },

              status:
                "accepted"
            })
              .select(
                "following"
              )
              .lean()
          : [];

      const acceptedPrivateSet =
        new Set(
          acceptedPrivate.map(
            x =>
              String(
                x.following
              )
          )
        );

      /*
       * Filter visible stories.
       */
      const visible =
        stories.filter(
          s =>
            String(
              s.author?._id
            ) ===
              String(
                req.user.id
              ) ||

            !s.author?.isPrivate ||

            acceptedPrivateSet.has(
              String(
                s.author?._id
              )
            )
        );

      res.json({
        stories:
          visible.map(
            s => ({
              ...s,

              mediaUrl:
                s.mediaId
                  ? `/api/media/${s.mediaId}`
                  : null,

              canView:
                true,

              isOwner:
                String(
                  s.author?._id
                ) ===
                String(
                  req.user.id
                )
            })
          )
      });
    } catch (e) {
      console.error(e);

      res.status(500).json({
        message:
          e.message
      });
    }
  }
);

/*
=========================================================
CREATE STORY
=========================================================
*/

router.post(
  "/",
  auth,
  uploadMedia.single(
    "media"
  ),
  async (req, res) => {
    try {
      /*
       * Story expires after 24 hours.
       */
      const expiresAt =
        new Date(
          Date.now() +
            24 *
              60 *
              60 *
              1000
        );

      let mediaId =
        null;

      let kind =
        "text";

      /*
       * Save media if provided.
       */
      if (req.file) {
        kind =
          req.file.mimetype.startsWith(
            "video/"
          )
            ? "video"
            : "image";

        const media =
          await Media.create({
            owner:
              req.user.id,

            kind,

            contentType:
              req.file.mimetype,

            data:
              req.file.buffer,

            fileName:
              req.file.originalname,

            size:
              req.file.size
          });

        mediaId =
          media._id;
      }

      /*
       * Create story.
       */
      const story =
        await Story.create({
          author:
            req.user.id,

          mediaId,

          kind,

          text:
            req.body.text ||
            "",

          background:
            req.body.background ||
            "",

          closeFriends:
            req.body.closeFriends ===
              "true" ||
            req.body.closeFriends ===
              true,

          expiresAt
        });

      res.status(201).json({
        story: {
          ...story.toObject(),

          mediaUrl:
            mediaId
              ? `/api/media/${mediaId}`
              : null
        }
      });
    } catch (e) {
      console.error(e);

      res.status(500).json({
        message:
          e.message
      });
    }
  }
);

/*
=========================================================
DELETE STORY
=========================================================
*/

router.delete(
  "/:id",
  auth,
  async (req, res) => {
    try {
      /*
       * Find story belonging ONLY
       * to the current user.
       */
      const story =
        await Story.findOne({
          _id:
            req.params.id,

          author:
            req.user.id
        });

      if (!story) {
        return res.status(404).json({
          message:
            "Story not found or you are not the owner"
        });
      }

      /*
       * Save media ID before deleting
       * story document.
       */
      const mediaId =
        story.mediaId;

      /*
       * Delete story views.
       */
      await StoryView.deleteMany({
        story:
          story._id
      });

      /*
       * Delete story.
       */
      await Story.deleteOne({
        _id:
          story._id
      });

      /*
       * Delete associated media.
       *
       * Text stories don't have media,
       * so this is skipped when mediaId
       * is null.
       */
      if (mediaId) {
        await Media.deleteOne({
          _id:
            mediaId,

          owner:
            req.user.id
        });
      }

      res.json({
        ok: true,

        message:
          "Story deleted successfully",

        storyId:
          String(
            story._id
          )
      });
    } catch (e) {
      console.error(e);

      res.status(500).json({
        message:
          e.message ||
          "Unable to delete story"
      });
    }
  }
);

/*
=========================================================
VIEW STORY
=========================================================
*/

router.post(
  "/:id/view",
  auth,
  async (req, res) => {
    try {
      const story =
        await Story.findById(
          req.params.id
        ).populate(
          "author",
          "isPrivate"
        );

      if (!story) {
        return res.status(404).json({
          message:
            "Story not found"
        });
      }

      /*
       * Check expiration.
       */
      if (
        story.expiresAt <=
        new Date()
      ) {
        return res.status(410).json({
          message:
            "Story expired"
        });
      }

      const isOwner =
        String(
          story.author._id
        ) ===
        String(
          req.user.id
        );

      /*
       * Owner can view own story.
       */
      if (!isOwner) {
        /*
         * User must follow the author.
         */
        const following =
          await Follow.findOne({
            follower:
              req.user.id,

            following:
              story.author._id,

            status:
              "accepted"
          });

        if (!following) {
          return res.status(403).json({
            message:
              "Follow this account to view this story"
          });
        }

        /*
         * Close-friends protection.
         */
        if (
          story.closeFriends
        ) {
          return res.status(403).json({
            message:
              "This story is for close friends"
          });
        }

        /*
         * Add user to story views.
         */
        await Story.findByIdAndUpdate(
          story._id,
          {
            $addToSet: {
              views:
                req.user.id
            }
          }
        );

        /*
         * Store exact view time.
         */
        await StoryView.findOneAndUpdate(
          {
            story:
              story._id,

            viewer:
              req.user.id
          },

          {
            $set: {
              viewedAt:
                new Date()
            }
          },

          {
            upsert:
              true,

            new:
              true,

            setDefaultsOnInsert:
              true
          }
        );
      }

      res.json({
        ok:
          true
      });
    } catch (e) {
      console.error(e);

      res.status(500).json({
        message:
          e.message
      });
    }
  }
);

/*
=========================================================
GET STORY VIEWERS
=========================================================
*/

router.get(
  "/:id/viewers",
  auth,
  async (req, res) => {
    try {
      const story =
        await Story.findById(
          req.params.id
        )
          .select(
            "author views expiresAt"
          )
          .lean();

      if (!story) {
        return res.status(404).json({
          message:
            "Story not found"
        });
      }

      /*
       * Only owner can see viewers.
       */
      if (
        String(
          story.author
        ) !==
        String(
          req.user.id
        )
      ) {
        return res.status(403).json({
          message:
            "Only the story owner can see viewers"
        });
      }

      const rows =
        await StoryView.find({
          story:
            story._id
        })
          .populate(
            "viewer",
            "name username isPrivate"
          )
          .sort({
            viewedAt: -1
          })
          .lean();

      const seen =
        new Set();

      const viewers =
        [];

      for (
        const row of rows
      ) {
        if (
          !row.viewer?._id
        ) {
          continue;
        }

        const id =
          String(
            row.viewer._id
          );

        if (
          seen.has(id)
        ) {
          continue;
        }

        seen.add(id);

        viewers.push({
          ...row.viewer,

          viewedAt:
            row.viewedAt
        });
      }

      /*
       * Support old views that may exist
       * only inside Story.views.
       */
      const legacyIds =
        (
          story.views ||
          []
        ).map(
          x =>
            String(x)
        );

      const missingLegacy =
        legacyIds.filter(
          id =>
            !seen.has(id)
        );

      if (
        missingLegacy.length
      ) {
        const users =
          await User.find({
            _id: {
              $in:
                missingLegacy
            }
          })
            .select(
              "name username isPrivate"
            )
            .lean();

        for (
          const u of users
        ) {
          viewers.push({
            ...u,

            viewedAt:
              null
          });
        }
      }

      res.json({
        viewers,

        count:
          viewers.length
      });
    } catch (e) {
      console.error(e);

      res.status(500).json({
        message:
          e.message
      });
    }
  }
);

export default router;