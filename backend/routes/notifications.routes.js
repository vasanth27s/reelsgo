import express from "express";
import mongoose from "mongoose";
import auth from "../middleware/auth.js";
import Notification from "../models/Notification.js";

const router = express.Router();

function currentUserId(req) {
  return req.user?.id || req.user?._id;
}

router.get("/", auth, async (req, res, next) => {
  try {
    const notifications = await Notification.find({ recipient: currentUserId(req) })
      .populate("actor", "name username avatar")
      .sort({ createdAt: -1 })
      .limit(100);
    res.json({ notifications });
  } catch (error) {
    next(error);
  }
});

router.post("/read-all", auth, async (req, res, next) => {
  try {
    await Notification.updateMany(
      { recipient: currentUserId(req), read: false },
      { $set: { read: true } }
    );
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

// Delete one notification belonging to the signed-in recipient.
router.delete("/:notificationId", auth, async (req, res, next) => {
  try {
    const { notificationId } = req.params;
    if (!mongoose.isValidObjectId(notificationId)) {
      return res.status(400).json({ message: "Invalid notification ID." });
    }
    const result = await Notification.deleteOne({
      _id: notificationId,
      recipient: currentUserId(req)
    });
    if (!result.deletedCount) {
      return res.status(404).json({ message: "Notification not found." });
    }
    res.json({ ok: true, deletedId: notificationId });
  } catch (error) {
    next(error);
  }
});

export default router;
