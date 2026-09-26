import express from "express";
import auth from "../middleware/auth.js";
import { uploadMedia } from "../middleware/upload.js";
import Media from "../models/Media.js";

const router = express.Router();

router.post("/", auth, uploadMedia.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "File is required" });

    const kind = req.file.mimetype.startsWith("video/") ? "video" : "image";

    const media = await Media.create({
      owner: req.user.id,
      kind,
      contentType: req.file.mimetype,
      data: req.file.buffer,
      fileName: req.file.originalname,
      size: req.file.size
    });

    res.status(201).json({
      media: {
        _id: media._id,
        kind: media.kind,
        contentType: media.contentType,
        url: `/api/media/${media._id}`
      }
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const media = await Media.findById(req.params.id).select("data contentType");
    if (!media) return res.status(404).send("Media not found");

    res.set("Content-Type", media.contentType);
    res.set("Cache-Control", "public, max-age=3600");
    res.send(media.data);
  } catch {
    res.status(500).send("Unable to load media");
  }
});

router.delete("/:id", auth, async (req, res) => {
  const media = await Media.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
  if (!media) return res.status(404).json({ message: "Media not found" });
  res.json({ ok: true });
});

export default router;
