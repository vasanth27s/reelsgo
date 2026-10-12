import express from "express";
import mongoose from "mongoose";
import auth from "../middleware/auth.js";
import Notification from "../models/Notification.js";

const router = express.Router();

// List the signed-in user's notifications.
router.get("/", auth, async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipient: req.user.id
    })
      .populate("actor", "name username")
      .sort({ createdAt: -1 })
      .limit(100);

    return res.json({ notifications });
  } catch (error) {
    console.error("Failed to load notifications:", error);
    return res.status(500).json({ message: "Failed to load notifications" });
  }
});

// Mark all notifications belonging to the signed-in user as read.
router.post("/read-all", auth, async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user.id, read: false },
      { $set: { read: true } }
    );

    return res.json({ ok: true });
  } catch (error) {
    console.error("Failed to mark notifications as read:", error);
    return res.status(500).json({ message: "Failed to mark notifications as read" });
  }
});

// Delete one notification owned by the signed-in user.
// The recipient constraint prevents users from deleting someone else's notification.
router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid notification ID" });
    }

    const deleted = await Notification.findOneAndDelete({
      _id: id,
      recipient: req.user.id
    });

    if (!deleted) {
      return res.status(404).json({ message: "Notification not found" });
    }

    return res.json({ ok: true, message: "Notification deleted" });
  } catch (error) {
    console.error("Failed to delete notification:", error);
    return res.status(500).json({ message: "Failed to delete notification" });
  }
});

export default router;
