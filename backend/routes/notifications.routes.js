import express from "express";
import auth from "../middleware/auth.js";
import Notification from "../models/Notification.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  const notifications = await Notification.find({
    recipient: req.user.id
  })
    .populate("actor", "name username")
    .sort({ createdAt: -1 })
    .limit(100);

  res.json({ notifications });
});

router.post("/read-all", auth, async (req, res) => {
  await Notification.updateMany(
    { recipient: req.user.id, read: false },
    { $set: { read: true } }
  );

  res.json({ ok: true });
});

export default router;
