import express from "express";
import auth from "../middleware/auth.js";
import { uploadImage } from "../middleware/upload.js";
import User from "../models/User.js";
import Follow from "../models/Follow.js";
import Post from "../models/Post.js";
import Reel from "../models/Reel.js";

const router = express.Router();


function postView(p) {
  const obj = p.toObject ? p.toObject() : p;
  obj.media = (obj.media || []).map(m => ({
    ...m,
    url: m.mediaId ? `/api/media/${m.mediaId}` : null
  }));
  return obj;
}

function reelView(r) {
  const obj = r.toObject ? r.toObject() : r;
  return {
    ...obj,
    mediaUrl: obj.mediaId ? `/api/media/${obj.mediaId}` : null,
    coverUrl: obj.coverMediaId ? `/api/media/${obj.coverMediaId}` : null
  };
}

function safe(user) {
  const obj = user.toObject();
  delete obj.password;
  if (obj.avatar) delete obj.avatar.data;
  return obj;
}

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password -avatar.data");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ user });
});

router.put("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    for (const field of ["name", "bio", "website", "isPrivate"]) {
      if (req.body[field] !== undefined) user[field] = req.body[field];
    }

    await user.save();
    res.json({ user: safe(user) });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post("/me/avatar", auth, uploadImage.single("avatar"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Please select an image" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.avatar = {
      data: req.file.buffer,
      contentType: req.file.mimetype,
      fileName: req.file.originalname
    };

    await user.save();

    res.json({
      user: safe(user),
      avatarUrl: `/api/users/${user._id}/avatar`
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get("/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("avatar");
    if (!user?.avatar?.data) return res.status(404).send("Avatar not found");

    res.set("Content-Type", user.avatar.contentType || "image/jpeg");
    res.set("Cache-Control", "public, max-age=3600");
    res.send(user.avatar.data);
  } catch {
    res.status(500).send("Unable to load avatar");
  }
});

router.delete("/me/avatar", auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.avatar = undefined;
  await user.save();

  res.json({ user: safe(user) });
});

router.get("/search", auth, async (req, res) => {
  const q = String(req.query.q || "").trim();
  if (!q) return res.json({ users: [] });

  const users = await User.find({
    $or: [
      { username: { $regex: q, $options: "i" } },
      { name: { $regex: q, $options: "i" } }
    ]
  })
    .select("-password -avatar.data")
    .limit(30);

  res.json({ users });
});

router.get("/:id/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password -avatar.data").lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    const isSelf = String(user._id) === String(req.user.id);

    const relationship = isSelf
      ? null
      : await Follow.findOne({
          follower: req.user.id,
          following: user._id
        }).lean();

    const followStatus = isSelf ? "self" : (relationship?.status || "none");
    const canViewContent = isSelf || !user.isPrivate || followStatus === "accepted";

    if (!canViewContent) {
      return res.json({
        user,
        followStatus,
        canViewContent: false,
        posts: [],
        reels: [],
        tagged: []
      });
    }

    const posts = await Post.find({
      author: user._id,
      archived: false,
      deletedAt: null
    })
      .populate("author", "name username isPrivate")
      .sort({ pinned: -1, createdAt: -1 })
      .limit(100)
      .lean();

    const reels = await Reel.find({ author: user._id })
      .populate("author", "name username isPrivate")
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    const tagged = await Post.find({
      mentions: user._id,
      archived: false,
      deletedAt: null
    })
      .populate("author", "name username isPrivate")
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    res.json({
      user,
      followStatus,
      canViewContent: true,
      posts: posts.map(postView),
      reels: reels.map(reelView),
      tagged: tagged.map(postView)
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get("/:id", auth, async (req, res) => {
  const user = await User.findById(req.params.id).select("-password -avatar.data");
  if (!user) return res.status(404).json({ message: "User not found" });

  const following = await Follow.findOne({
    follower: req.user.id,
    following: user._id,
    status: "accepted"
  });

  res.json({ user, following: !!following });
});

export default router;
