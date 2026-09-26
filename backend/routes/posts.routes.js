import express from "express";
import auth from "../middleware/auth.js";
import Post from "../models/Post.js";
import Media from "../models/Media.js";
import Interaction from "../models/Interaction.js";
import Comment from "../models/Comment.js";
import User from "../models/User.js";
import Follow from "../models/Follow.js";
import Notification from "../models/Notification.js";
import { uploadMedia } from "../middleware/upload.js";

const router = express.Router();

function postView(p) {
  const obj = p.toObject ? p.toObject() : p;
  obj.media = (obj.media || []).map(m => ({
    ...m,
    url: m.mediaId ? `/api/media/${m.mediaId}` : null
  }));
  return obj;
}

router.get("/", auth, async (req, res) => {
  try {
    // Instagram-style private-account feed visibility:
    // own posts + public posts + posts from private accounts you follow and were approved for.
    const privateUsers = await User.find({ isPrivate: true }).select("_id").lean();
    const privateIds = privateUsers.map(u => u._id);
    const approved = await Follow.find({
      follower: req.user.id,
      following: { $in: privateIds },
      status: "accepted"
    }).select("following").lean();
    const approvedPrivateIds = approved.map(f => f.following);

    const visibility = privateIds.length
      ? {
          $or: [
            { author: req.user.id },
            { author: { $nin: privateIds } },
            { author: { $in: approvedPrivateIds } }
          ]
        }
      : {};

    const posts = await Post.find({
      archived: false,
      deletedAt: null,
      ...visibility
    })
      .populate("author", "name username avatar isPrivate")
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    res.json({
      posts: posts.map(postView)
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post("/", auth, uploadMedia.array("media", 10), async (req, res) => {
  try {
    const {
      caption = "",
      location = "",
      hashtags = "",
      commentsDisabled = false,
      hideLikeCount = false,
      sharingDisabled = false
    } = req.body;

    const media = [];

    for (const file of req.files || []) {
      const kind = file.mimetype.startsWith("video/") ? "video" : "image";

      const saved = await Media.create({
        owner: req.user.id,
        kind,
        contentType: file.mimetype,
        data: file.buffer,
        fileName: file.originalname,
        size: file.size
      });

      media.push({
        mediaId: saved._id,
        kind
      });
    }

    const post = await Post.create({
      author: req.user.id,
      media,
      caption,
      location,
      hashtags: String(hashtags)
        .split(/[,\s]+/)
        .map(x => x.trim().replace(/^#/, ""))
        .filter(Boolean),
      commentsDisabled: commentsDisabled === "true" || commentsDisabled === true,
      hideLikeCount: hideLikeCount === "true" || hideLikeCount === true,
      sharingDisabled: sharingDisabled === "true" || sharingDisabled === true
    });

    await User.findByIdAndUpdate(req.user.id, { $inc: { postsCount: 1 } });

    const populated = await Post.findById(post._id)
      .populate("author", "name username");

    res.status(201).json({ post: postView(populated) });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});


router.get("/saved", auth, async (req, res) => {
  try {
    const saves = await Interaction.find({
      user: req.user.id,
      targetType: "post",
      type: "save"
    }).sort({ createdAt: -1 }).lean();

    const ids = saves.map(x => x.target);
    const posts = await Post.find({ _id: { $in: ids }, archived: false, deletedAt: null })
      .populate("author", "name username")
      .sort({ createdAt: -1 })
      .lean();

    res.json({ posts: posts.map(postView) });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.put("/:id", auth, async (req, res) => {
  const post = await Post.findOne({ _id: req.params.id, author: req.user.id });
  if (!post) return res.status(404).json({ message: "Post not found" });

  for (const field of ["caption", "location", "commentsDisabled", "hideLikeCount", "sharingDisabled"]) {
    if (req.body[field] !== undefined) post[field] = req.body[field];
  }

  await post.save();
  res.json({ post: postView(post) });
});

router.delete("/:id", auth, async (req, res) => {
  const post = await Post.findOne({ _id: req.params.id, author: req.user.id });
  if (!post) return res.status(404).json({ message: "Post not found" });

  post.deletedAt = new Date();
  await post.save();

  await User.findByIdAndUpdate(req.user.id, { $inc: { postsCount: -1 } });

  res.json({ ok: true });
});

router.post("/:id/archive", auth, async (req, res) => {
  const post = await Post.findOne({ _id: req.params.id, author: req.user.id });
  if (!post) return res.status(404).json({ message: "Post not found" });
  post.archived = true;
  await post.save();
  res.json({ ok: true });
});

router.post("/:id/restore", auth, async (req, res) => {
  const post = await Post.findOne({ _id: req.params.id, author: req.user.id });
  if (!post) return res.status(404).json({ message: "Post not found" });
  post.archived = false;
  post.deletedAt = null;
  await post.save();
  res.json({ ok: true });
});

router.post("/:id/pin", auth, async (req, res) => {
  const post = await Post.findOne({ _id: req.params.id, author: req.user.id });
  if (!post) return res.status(404).json({ message: "Post not found" });
  post.pinned = !post.pinned;
  await post.save();
  res.json({ pinned: post.pinned });
});

router.post("/:id/like", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const existing = await Interaction.findOne({
      user: req.user.id,
      targetType: "post",
      target: post._id,
      type: "like"
    });

    if (existing) {
      await existing.deleteOne();
      post.likesCount = Math.max(0, post.likesCount - 1);
      await post.save();
      return res.json({ liked: false, likesCount: post.likesCount });
    }

    await Interaction.create({
      user: req.user.id,
      targetType: "post",
      target: post._id,
      type: "like"
    });

    post.likesCount += 1;
    await post.save();

    if (post.author.toString() !== req.user.id) {
      await Notification.create({
        recipient: post.author,
        actor: req.user.id,
        type: "like",
        targetId: post._id,
        text: "liked your post"
      });
    }

    res.json({ liked: true, likesCount: post.likesCount });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post("/:id/save", auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });

  const existing = await Interaction.findOne({
    user: req.user.id,
    targetType: "post",
    target: post._id,
    type: "save"
  });

  if (existing) {
    await existing.deleteOne();
    post.savesCount = Math.max(0, post.savesCount - 1);
    await post.save();
    return res.json({ saved: false, savesCount: post.savesCount });
  }

  await Interaction.create({
    user: req.user.id,
    targetType: "post",
    target: post._id,
    type: "save"
  });

  post.savesCount += 1;
  await post.save();

  res.json({ saved: true, savesCount: post.savesCount });
});

router.get("/:id/comments", auth, async (req, res) => {
  const comments = await Comment.find({
    post: req.params.id,
    hidden: false
  })
    .populate("author", "name username")
    .sort({ createdAt: 1 });

  res.json({ comments });
});

router.post("/:id/comments", auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });
  if (post.commentsDisabled) return res.status(403).json({ message: "Comments are disabled" });

  const text = String(req.body.text || "").trim();
  if (!text) return res.status(400).json({ message: "Comment cannot be empty" });

  const comment = await Comment.create({
    post: post._id,
    author: req.user.id,
    parent: req.body.parent || null,
    text
  });

  post.commentsCount += 1;
  await post.save();

  const populated = await Comment.findById(comment._id).populate("author", "name username");

  res.status(201).json({ comment: populated });
});

export default router;
