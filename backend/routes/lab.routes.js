import express from "express";
import mongoose from "mongoose";
import auth from "../middleware/auth.js";
import LabEntry from "../models/LabEntry.js";

const router = express.Router();
const ALLOWED_KINDS = new Set(["community", "live", "collection", "map"]);
const ID_RE = /^[a-f\d]{24}$/i;

function cleanText(value, max = 1200) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function publicEntry(entry) {
  return entry;
}

// GET /api/lab/:kind
router.get("/:kind", auth, async (req, res) => {
  try {
    const { kind } = req.params;
    if (!ALLOWED_KINDS.has(kind)) return res.status(400).json({ message: "Unknown ReelsGo Lab section." });
    const q = cleanText(req.query.q, 80);
    const filter = { kind, isActive: true };
    if (q) filter.$or = [
      { title: { $regex: q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } },
      { description: { $regex: q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } },
      { location: { $regex: q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } }
    ];
    const items = await LabEntry.find(filter)
      .populate("owner", "name username avatar isPrivate")
      .populate("members", "name username")
      .populate("likes", "name username")
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();
    return res.json({ items });
  } catch (error) {
    console.error("ReelsGo Lab list error:", error);
    return res.status(500).json({ message: "Unable to load this ReelsGo Lab section." });
  }
});

// POST /api/lab/:kind
router.post("/:kind", auth, async (req, res) => {
  try {
    const { kind } = req.params;
    if (!ALLOWED_KINDS.has(kind)) return res.status(400).json({ message: "Unknown ReelsGo Lab section." });
    const title = cleanText(req.body?.title, 100);
    if (!title) return res.status(400).json({ message: "Title is required." });
    const description = cleanText(req.body?.description, 1200);
    const location = cleanText(req.body?.location, 200);
    const payload = { kind, title, description, location, owner: req.user.id, members: [], likes: [] };
    if (kind === "community") payload.members.push(new mongoose.Types.ObjectId(req.user.id));
    if (kind === "map") {
      if (req.body?.latitude !== undefined && req.body?.latitude !== null && req.body?.latitude !== "") {
        const latitude = Number(req.body.latitude);
        if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) return res.status(400).json({ message: "Latitude must be between -90 and 90." });
        payload.latitude = latitude;
      }
      if (req.body?.longitude !== undefined && req.body?.longitude !== null && req.body?.longitude !== "") {
        const longitude = Number(req.body.longitude);
        if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) return res.status(400).json({ message: "Longitude must be between -180 and 180." });
        payload.longitude = longitude;
      }
    }
    const item = await LabEntry.create(payload);
    const populated = await LabEntry.findById(item._id)
      .populate("owner", "name username avatar isPrivate")
      .populate("members", "name username")
      .populate("likes", "name username")
      .lean();
    return res.status(201).json({ item: publicEntry(populated) });
  } catch (error) {
    console.error("ReelsGo Lab create error:", error);
    return res.status(500).json({ message: "Unable to save this ReelsGo Lab item." });
  }
});

// POST /api/lab/:kind/:id/join or /like
router.post("/:kind/:id/:action", auth, async (req, res) => {
  try {
    const { kind, id, action } = req.params;
    if (!ALLOWED_KINDS.has(kind)) return res.status(400).json({ message: "Unknown ReelsGo Lab section." });
    if (!ID_RE.test(id)) return res.status(400).json({ message: "Invalid item id." });
    if (!["join", "like"].includes(action)) return res.status(400).json({ message: "Unsupported action." });
    if (action === "join" && kind !== "community") return res.status(400).json({ message: "Only communities support joining." });
    const field = action === "join" ? "members" : "likes";
    const item = await LabEntry.findOneAndUpdate(
      { _id: id, kind, isActive: true },
      { $addToSet: { [field]: req.user.id } },
      { new: true, runValidators: true }
    )
      .populate("owner", "name username avatar isPrivate")
      .populate("members", "name username")
      .populate("likes", "name username");
    if (!item) return res.status(404).json({ message: "Item not found." });
    return res.json({ item: publicEntry(item) });
  } catch (error) {
    console.error("ReelsGo Lab action error:", error);
    return res.status(500).json({ message: "Unable to update this item." });
  }
});

// DELETE /api/lab/:kind/:id (owner only)
router.delete("/:kind/:id", auth, async (req, res) => {
  try {
    const { kind, id } = req.params;
    if (!ALLOWED_KINDS.has(kind)) return res.status(400).json({ message: "Unknown ReelsGo Lab section." });
    if (!ID_RE.test(id)) return res.status(400).json({ message: "Invalid item id." });
    const item = await LabEntry.findOneAndDelete({ _id: id, kind, owner: req.user.id });
    if (!item) return res.status(404).json({ message: "Item not found or you do not own it." });
    return res.json({ message: "Deleted successfully." });
  } catch (error) {
    console.error("ReelsGo Lab delete error:", error);
    return res.status(500).json({ message: "Unable to delete this item." });
  }
});

export default router;
