import express from "express";
import auth from "../middleware/auth.js";
import { uploadMedia } from "../middleware/upload.js";
import Media from "../models/Media.js";
import Story from "../models/Story.js";
import User from "../models/User.js";
import Follow from "../models/Follow.js";
import StoryView from "../models/StoryView.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const following = await Follow.find({
      follower: req.user.id,
      status: "accepted"
    }).select("following").lean();

    const followingIds = following.map(f => f.following);
    const authorIds = [req.user.id, ...followingIds];

    const stories = await Story.find({
      author: { $in: authorIds },
      expiresAt: { $gt: new Date() }
    })
      .populate("author", "name username isPrivate")
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    const privateAuthorIds = stories
      .filter(s => s.author?.isPrivate && String(s.author._id) !== String(req.user.id))
      .map(s => s.author._id);

    const acceptedPrivate = privateAuthorIds.length
      ? await Follow.find({
          follower: req.user.id,
          following: { $in: privateAuthorIds },
          status: "accepted"
        }).select("following").lean()
      : [];

    const acceptedPrivateSet = new Set(acceptedPrivate.map(x => String(x.following)));
    const visible = stories.filter(s =>
      String(s.author?._id) === String(req.user.id) ||
      !s.author?.isPrivate ||
      acceptedPrivateSet.has(String(s.author?._id))
    );

    res.json({
      stories: visible.map(s => ({
        ...s,
        mediaUrl: s.mediaId ? `/api/media/${s.mediaId}` : null,
        canView: true,
        isOwner: String(s.author?._id) === String(req.user.id)
      }))
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post("/", auth, uploadMedia.single("media"), async (req, res) => {
  try {
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    let mediaId = null;
    let kind = "text";

    if (req.file) {
      kind = req.file.mimetype.startsWith("video/") ? "video" : "image";

      const media = await Media.create({
        owner: req.user.id,
        kind,
        contentType: req.file.mimetype,
        data: req.file.buffer,
        fileName: req.file.originalname,
        size: req.file.size
      });

      mediaId = media._id;
    }

    const story = await Story.create({
      author: req.user.id,
      mediaId,
      kind,
      text: req.body.text || "",
      background: req.body.background || "",
      closeFriends: req.body.closeFriends === "true" || req.body.closeFriends === true,
      expiresAt
    });

    res.status(201).json({
      story: {
        ...story.toObject(),
        mediaUrl: mediaId ? `/api/media/${mediaId}` : null
      }
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post("/:id/view", auth, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id).populate("author", "isPrivate");
    if (!story) return res.status(404).json({ message: "Story not found" });
    if (story.expiresAt <= new Date()) return res.status(410).json({ message: "Story expired" });

    const isOwner = String(story.author._id) === String(req.user.id);
    if (!isOwner) {
      const following = await Follow.findOne({
        follower: req.user.id,
        following: story.author._id,
        status: "accepted"
      });
      if (!following) return res.status(403).json({ message: "Follow this account to view this story" });
      if (story.closeFriends) return res.status(403).json({ message: "This story is for close friends" });

      await Story.findByIdAndUpdate(story._id, { $addToSet: { views: req.user.id } });
      await StoryView.findOneAndUpdate(
        { story: story._id, viewer: req.user.id },
        { $set: { viewedAt: new Date() } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get("/:id/viewers", auth, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id).select("author views expiresAt").lean();
    if (!story) return res.status(404).json({ message: "Story not found" });
    if (String(story.author) !== String(req.user.id)) {
      return res.status(403).json({ message: "Only the story owner can see viewers" });
    }

    const rows = await StoryView.find({ story: story._id })
      .populate("viewer", "name username isPrivate")
      .sort({ viewedAt: -1 })
      .lean();

    const seen = new Set();
    const viewers = [];
    for (const row of rows) {
      if (!row.viewer?._id) continue;
      const id = String(row.viewer._id);
      if (seen.has(id)) continue;
      seen.add(id);
      viewers.push({ ...row.viewer, viewedAt: row.viewedAt });
    }

    const legacyIds = (story.views || []).map(x => String(x));
    const missingLegacy = legacyIds.filter(id => !seen.has(id));
    if (missingLegacy.length) {
      const users = await User.find({ _id: { $in: missingLegacy } })
        .select("name username isPrivate")
        .lean();
      for (const u of users) viewers.push({ ...u, viewedAt: null });
    }

    res.json({ viewers, count: viewers.length });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
