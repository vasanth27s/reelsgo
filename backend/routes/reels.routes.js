import express from "express";
import auth from "../middleware/auth.js";
import { uploadMedia } from "../middleware/upload.js";
import Media from "../models/Media.js";
import Reel from "../models/Reel.js";
import Interaction from "../models/Interaction.js";
import Notification from "../models/Notification.js";
import Comment from "../models/Comment.js";

const router = express.Router();

function view(r) {
  const x = r.toObject ? r.toObject() : r;
  return {
    ...x,
    mediaUrl: `/api/media/${x.mediaId}`,
    coverUrl: x.coverMediaId ? `/api/media/${x.coverMediaId}` : null
  };
}

router.get("/saved", auth, async (req, res) => {
  try {
    const saves = await Interaction.find({
      user: req.user.id,
      targetType: "reel",
      type: "save"
    }).sort({ createdAt: -1 }).lean();

    const ids = saves.map(item => item.target);
    const reels = await Reel.find({ _id: { $in: ids } })
      .populate("author", "name username avatar")
      .lean();

    // Preserve the user's save order rather than sorting by the Reel's creation date.
    const byId = new Map(reels.map(reel => [String(reel._id), reel]));
    const ordered = ids.map(id => byId.get(String(id))).filter(Boolean);
    res.json({ reels: ordered.map(view) });
  } catch (error) {
    console.error("Load saved Reels failed:", error);
    res.status(500).json({ message: "Could not load saved Reels" });
  }
});

router.get("/", auth, async (req, res) => {
  const reels = await Reel.find()
    .populate("author", "name username")
    .sort({ createdAt: -1 })
    .limit(50);

  res.json({ reels: reels.map(view) });
});

router.post("/", auth, uploadMedia.single("video"), async (req, res) => {
  try {
    if (!req.file || !req.file.mimetype.startsWith("video/")) {
      return res.status(400).json({ message: "A video file is required" });
    }

    const media = await Media.create({
      owner: req.user.id,
      kind: "video",
      contentType: req.file.mimetype,
      data: req.file.buffer,
      fileName: req.file.originalname,
      size: req.file.size
    });

    const reel = await Reel.create({
      author: req.user.id,
      mediaId: media._id,
      caption: req.body.caption || "",
      hashtags: String(req.body.hashtags || "")
        .split(/[,\s]+/)
        .map(x => x.replace(/^#/, ""))
        .filter(Boolean),
      location: req.body.location || "",
      music: req.body.music || ""
    });

    const populated = await Reel.findById(reel._id).populate("author", "name username");

    res.status(201).json({ reel: view(populated) });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get("/:id/likes", auth, async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) return res.status(404).json({ message: "Reel not found" });
    const interactions = await Interaction.find({ targetType: "reel", target: reel._id, type: "like" })
      .populate("user", "name username avatar updatedAt")
      .sort({ createdAt: -1 }).limit(500);
    res.json({ users: interactions.map(item => item.user).filter(Boolean) });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.post("/:id/like", auth, async (req, res) => {
  const reel = await Reel.findById(req.params.id);
  if (!reel) return res.status(404).json({ message: "Reel not found" });

  const existing = await Interaction.findOne({
    user: req.user.id,
    targetType: "reel",
    target: reel._id,
    type: "like"
  });

  if (existing) {
    await existing.deleteOne();
    reel.likesCount = Math.max(0, reel.likesCount - 1);
    await reel.save();
    return res.json({ liked: false, likesCount: reel.likesCount });
  }

  await Interaction.create({
    user: req.user.id,
    targetType: "reel",
    target: reel._id,
    type: "like"
  });

  reel.likesCount += 1;
  await reel.save();

  if (reel.author.toString() !== req.user.id) {
    await Notification.create({
      recipient: reel.author,
      actor: req.user.id,
      type: "reel_like",
      targetId: reel._id,
      text: "liked your Reel"
    });
  }

  res.json({ liked: true, likesCount: reel.likesCount });
});

router.post("/:id/save", auth, async (req, res) => {
  const reel = await Reel.findById(req.params.id);
  if (!reel) return res.status(404).json({ message: "Reel not found" });

  const existing = await Interaction.findOne({
    user: req.user.id,
    targetType: "reel",
    target: reel._id,
    type: "save"
  });

  if (existing) {
    await existing.deleteOne();
    reel.savesCount = Math.max(0, reel.savesCount - 1);
    await reel.save();
    return res.json({ saved: false, savesCount: reel.savesCount });
  }

  await Interaction.create({
    user: req.user.id,
    targetType: "reel",
    target: reel._id,
    type: "save"
  });

  reel.savesCount += 1;
  await reel.save();

  res.json({ saved: true, savesCount: reel.savesCount });
});


// Reel comments: list comments, create a comment, and delete the signed-in user's own comment.
// The existing Comment model stores the Reel ID in its `post` field. Do not populate `post`
// here because that schema path references Post; populate only the author.
router.get("/:id/comments", auth, async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) return res.status(404).json({ message: "Reel not found" });

    const comments = await Comment.find({ post: reel._id, hidden: false })
      .populate("author", "name username avatar")
      .sort({ createdAt: 1 })
      .limit(200);

    return res.json({ comments });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load Reel comments", error: error.message });
  }
});

router.post("/:id/comments", auth, async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) return res.status(404).json({ message: "Reel not found" });

    const text = String(req.body?.text || "").trim();
    if (!text) return res.status(400).json({ message: "Comment cannot be empty" });
    if (text.length > 1000) return res.status(400).json({ message: "Comment cannot exceed 1000 characters" });

    const comment = await Comment.create({
      post: reel._id,
      author: req.user.id,
      text,
      parent: req.body?.parent || null
    });

    await Reel.updateOne({ _id: reel._id }, { $inc: { commentsCount: 1 } });
    const populated = await Comment.findById(comment._id).populate("author", "name username avatar");
    return res.status(201).json({ comment: populated });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create Reel comment", error: error.message });
  }
});

router.delete("/:id/comments/:commentId", auth, async (req, res) => {
  try {
    const comment = await Comment.findOne({
      _id: req.params.commentId,
      post: req.params.id,
      author: req.user.id
    });
    if (!comment) return res.status(404).json({ message: "Comment not found or you cannot delete it" });

    await comment.deleteOne();
    await Reel.updateOne({ _id: req.params.id, commentsCount: { $gt: 0 } }, { $inc: { commentsCount: -1 } });
    return res.json({ ok: true, message: "Comment deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete Reel comment", error: error.message });
  }
});

export default router;
