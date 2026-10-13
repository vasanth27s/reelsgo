import express from "express";
import auth from "../middleware/auth.js";
import { uploadMedia } from "../middleware/upload.js";
import Media from "../models/Media.js";
import Reel from "../models/Reel.js";
import Interaction from "../models/Interaction.js";
import Notification from "../models/Notification.js";
import Comment from "../models/Comment.js";
import CommentModeration from "../models/CommentModeration.js";

const router = express.Router();

function view(r) {
  const x = r.toObject ? r.toObject() : r;
  return {
    ...x,
    mediaUrl: `/api/media/${x.mediaId}`,
    coverUrl: x.coverMediaId ? `/api/media/${x.coverMediaId}` : null
  };
}

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

// GET SAVED REELS FOR THE SIGNED-IN USER
// This must be mounted under /api/reels, matching the frontend Saved page.
router.get("/saved", auth, async (req, res) => {
  try {
    const savedInteractions = await Interaction.find({
      user: req.user.id,
      targetType: "reel",
      type: "save"
    })
      .sort({ createdAt: -1 })
      .select("target")
      .lean();

    const reelIds = savedInteractions
      .map(item => item.target)
      .filter(Boolean);

    if (!reelIds.length) {
      return res.json({ reels: [] });
    }

    const foundReels = await Reel.find({ _id: { $in: reelIds } })
      .populate("author", "name username")
      .lean();

    // Preserve the order in which the user saved the Reels.
    const byId = new Map(foundReels.map(reel => [String(reel._id), reel]));
    const reels = reelIds
      .map(id => byId.get(String(id)))
      .filter(Boolean)
      .map(view);

    return res.json({ reels });
  } catch (error) {
    console.error("GET saved Reels failed:", error);
    return res.status(500).json({ message: "Failed to load saved Reels" });
  }
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




// DELETE REEL: only the reel owner may delete it.
// This route is mounted at /api/reels, so the frontend calls
// DELETE /api/reels/:id. Existing reel endpoints remain unchanged.
router.delete("/:id", auth, async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) return res.status(404).json({ message: "Reel not found" });

    if (String(reel.author) !== String(req.user.id)) {
      return res.status(403).json({ message: "You can only delete your own Reel" });
    }

    // Remove related data before removing the Reel itself.
    await Promise.all([
      Interaction.deleteMany({ targetType: "reel", target: reel._id }),
      Comment.deleteMany({ post: reel._id }),
      Notification.deleteMany({ targetId: reel._id })
    ]);

    // Remove the stored video and optional cover media.
    const mediaIds = [reel.mediaId, reel.coverMediaId].filter(Boolean);
    if (mediaIds.length) await Media.deleteMany({ _id: { $in: mediaIds }, owner: reel.author });

    await reel.deleteOne();
    return res.json({ ok: true, message: "Reel deleted successfully", reelId: String(reel._id) });
  } catch (error) {
    console.error("Delete Reel failed:", error);
    return res.status(500).json({ message: "Failed to delete Reel" });
  }
});

// =====================================================
// REEL COMMENTS: GET, CREATE, DELETE OWN COMMENT
// Comment.post stores the Reel ObjectId. Do not populate `post` because
// the existing schema references Post; populate only the author.
// =====================================================
router.get("/:id/comments", auth, async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) return res.status(404).json({ message: "Reel not found" });

    const isOwner = String(reel.author) === String(req.user.id);
    const comments = await Comment.find({ post: reel._id, hidden: false })
      .populate("author", "name username avatar")
      .sort({ pinned: -1, createdAt: 1 })
      .limit(200);

    // Restricted users can still see their own comments, but other viewers cannot.
    const restrictedUsers = isOwner ? [] : await CommentModeration.find({
      actor: reel.author, reel: reel._id, action: "restrict"
    }).distinct("targetUser");
    const visibleComments = isOwner ? comments : comments.filter(c =>
      !restrictedUsers.some(id => String(id) === String(c.author?._id)) || String(c.author?._id) === String(req.user.id)
    );
    return res.json({ comments: visibleComments });
  } catch (error) {
    console.error("Load Reel comments failed:", error);
    return res.status(500).json({ message: "Failed to load Reel comments" });
  }
});

router.post("/:id/comments", auth, async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) return res.status(404).json({ message: "Reel not found" });

    const text = String(req.body?.text || "").trim();
    if (!text) return res.status(400).json({ message: "Comment cannot be empty" });
    if (text.length > 1000) return res.status(400).json({ message: "Comment cannot exceed 1000 characters" });

    const block = await CommentModeration.findOne({
      actor: reel.author, targetUser: req.user.id, reel: reel._id, action: "block"
    });
    if (block) return res.status(403).json({ message: "The Reel owner has blocked you from commenting on this Reel" });

    const comment = await Comment.create({ post: reel._id, author: req.user.id, text });
    const populated = await Comment.findById(comment._id).populate("author", "name username");
    return res.status(201).json({ comment: populated });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create comment" });
  }
});

router.delete("/:id/comments/:commentId", auth, async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) return res.status(404).json({ message: "Reel not found" });
    const comment = await Comment.findOne({ _id: req.params.commentId, post: reel._id });
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const isReelOwner = String(reel.author) === String(req.user.id);
    const isCommentOwner = String(comment.author) === String(req.user.id);
    if (!isReelOwner && !isCommentOwner) {
      return res.status(403).json({ message: "Only the Reel owner or comment author can delete this comment" });
    }

    await comment.deleteOne();
    reel.commentsCount = Math.max(0, Number(reel.commentsCount || 0) - 1);
    await reel.save();
    return res.json({ ok: true, message: "Comment deleted", commentId: String(comment._id), commentsCount: reel.commentsCount });
  } catch (error) {
    console.error("Delete Reel comment failed:", error);
    return res.status(500).json({ message: "Failed to delete comment" });
  }
});

// Owner-only pin/unpin. The Comment schema already includes `pinned`.
router.patch("/:id/comments/:commentId/pin", auth, async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) return res.status(404).json({ message: "Reel not found" });
    if (String(reel.author) !== String(req.user.id)) {
      return res.status(403).json({ message: "Only the Reel owner can pin comments" });
    }
    const comment = await Comment.findOne({ _id: req.params.commentId, post: reel._id });
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    const requested = req.body?.pinned;
    comment.pinned = typeof requested === "boolean" ? requested : !comment.pinned;
    await comment.save();
    return res.json({ ok: true, comment: { _id: comment._id, pinned: comment.pinned } });
  } catch (error) {
    console.error("Pin Reel comment failed:", error);
    return res.status(500).json({ message: "Failed to update pinned comment" });
  }
});

// Owner moderation actions. These records are persisted so block/restrict/report
// are not just decorative frontend buttons.
router.post("/:id/comments/:commentId/:action", auth, async (req, res) => {
  try {
    const { id, commentId, action } = req.params;
    if (!["restrict", "block", "report"].includes(action)) {
      return res.status(404).json({ message: "Comment action API not found" });
    }
    const reel = await Reel.findById(id);
    if (!reel) return res.status(404).json({ message: "Reel not found" });
    const comment = await Comment.findOne({ _id: commentId, post: reel._id }).populate("author", "name username");
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const isOwner = String(reel.author) === String(req.user.id);
    if (action !== "report" && !isOwner) {
      return res.status(403).json({ message: "Only the Reel owner can restrict or block a commenter" });
    }
    const targetUser = req.body?.targetUserId || comment.author?._id || comment.author;
    if (!targetUser) return res.status(400).json({ message: "Comment author could not be identified" });
    if (action === "report") {
      await CommentModeration.create({ actor: req.user.id, targetUser, reel: reel._id, comment: comment._id, action, reason: String(req.body?.reason || "Reported comment").slice(0, 500) });
      return res.status(201).json({ ok: true, message: "Comment reported. Thank you for helping keep ReelsGo safe." });
    }
    const existing = await CommentModeration.findOne({ actor: req.user.id, targetUser, reel: reel._id, action });
    if (existing) {
      await existing.deleteOne();
      return res.json({ ok: true, active: false, message: action === "block" ? "User unblocked for this Reel" : "User restriction removed" });
    }
    await CommentModeration.create({ actor: req.user.id, targetUser, reel: reel._id, comment: comment._id, action, reason: "" });
    return res.status(201).json({ ok: true, active: true, message: action === "block" ? "User blocked from commenting on this Reel" : "User restricted on this Reel" });
  } catch (error) {
    console.error("Reel comment moderation failed:", error);
    return res.status(500).json({ message: "Failed to apply comment action" });
  }
});

// Return likes for the existing frontend likes panel.
router.get("/:id/likes", auth, async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) return res.status(404).json({ message: "Reel not found" });
    const likes = await Interaction.find({ targetType: "reel", target: reel._id, type: "like" })
      .populate("user", "name username avatar")
      .sort({ createdAt: -1 }).limit(500);
    return res.json({ users: likes.map(item => item.user).filter(Boolean) });
  } catch (error) {
    console.error("Load Reel likes failed:", error);
    return res.status(500).json({ message: "Failed to load Reel likes" });
  }
});

export default router;
