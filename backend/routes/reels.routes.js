import express from "express";
import auth from "../middleware/auth.js";
import { uploadMedia } from "../middleware/upload.js";
import Media from "../models/Media.js";
import Reel from "../models/Reel.js";
import Interaction from "../models/Interaction.js";
import Notification from "../models/Notification.js";

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

export default router;
