import express from "express";
import auth from "../middleware/auth.js";
import User from "../models/User.js";
import Follow from "../models/Follow.js";
import Notification from "../models/Notification.js";

const router = express.Router();

router.post("/:userId", auth, async (req, res) => {
  if (req.params.userId === req.user.id) return res.status(400).json({ message: "You cannot follow yourself" });

  const target = await User.findById(req.params.userId);
  const me = await User.findById(req.user.id);

  if (!target) return res.status(404).json({ message: "User not found" });

  const existing = await Follow.findOne({
    follower: me._id,
    following: target._id
  });

  if (existing) return res.json({ following: true, status: existing.status });

  const status = target.isPrivate ? "pending" : "accepted";

  await Follow.create({
    follower: me._id,
    following: target._id,
    status
  });

  if (status === "accepted") {
    await User.findByIdAndUpdate(me._id, { $inc: { followingCount: 1 } });
    await User.findByIdAndUpdate(target._id, { $inc: { followersCount: 1 } });
  }

  await Notification.create({
    recipient: target._id,
    actor: me._id,
    type: status === "pending" ? "follow_request" : "follow",
    text: status === "pending" ? `${me.username} requested to follow you` : `${me.username} started following you`
  });

  res.json({ following: true, status });
});

router.delete("/:userId", auth, async (req, res) => {
  const existing = await Follow.findOneAndDelete({
    follower: req.user.id,
    following: req.params.userId
  });

  if (existing?.status === "accepted") {
    await User.findByIdAndUpdate(req.user.id, { $inc: { followingCount: -1 } });
    await User.findByIdAndUpdate(req.params.userId, { $inc: { followersCount: -1 } });
  }

  res.json({ following: false });
});


router.get("/requests", auth, async (req, res) => {
  const rows = await Follow.find({
    following: req.user.id,
    status: "pending"
  }).populate("follower", "name username");
  res.json({ requests: rows });
});

router.post("/requests/:requestId/accept", auth, async (req, res) => {
  const request = await Follow.findOne({
    _id: req.params.requestId,
    following: req.user.id,
    status: "pending"
  });
  if (!request) return res.status(404).json({ message: "Follow request not found" });

  request.status = "accepted";
  await request.save();
  await User.findByIdAndUpdate(request.follower, { $inc: { followingCount: 1 } });
  await User.findByIdAndUpdate(request.following, { $inc: { followersCount: 1 } });

  await Notification.create({
    recipient: request.follower,
    actor: request.following,
    type: "follow_accepted",
    text: "accepted your follow request"
  });

  res.json({ accepted: true });
});

router.post("/requests/:requestId/decline", auth, async (req, res) => {
  const request = await Follow.findOneAndDelete({
    _id: req.params.requestId,
    following: req.user.id,
    status: "pending"
  });
  if (!request) return res.status(404).json({ message: "Follow request not found" });
  res.json({ declined: true });
});

router.get("/:userId/followers", auth, async (req, res) => {
  const rows = await Follow.find({
    following: req.params.userId,
    status: "accepted"
  }).populate("follower", "name username");
  res.json({ users: rows.map(r => r.follower) });
});

router.get("/:userId/following", auth, async (req, res) => {
  const rows = await Follow.find({
    follower: req.params.userId,
    status: "accepted"
  }).populate("following", "name username");
  res.json({ users: rows.map(r => r.following) });
});

export default router;
