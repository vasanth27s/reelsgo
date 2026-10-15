import express from "express";
import mongoose from "mongoose";
import auth from "../middleware/auth.js";
import User from "../models/User.js";
import Post from "../models/Post.js";
import Reel from "../models/Reel.js";

const router = express.Router();
router.use(auth);

const eventSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  actor: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null, index: true },
  contentId: { type: mongoose.Schema.Types.ObjectId, default: null, index: true },
  contentType: { type: String, enum: ["post", "reel", "profile", "other"], default: "other" },
  type: { type: String, enum: ["view", "impression", "like", "comment", "share", "save", "follow", "unfollow", "profile_visit"], required: true, index: true },
  createdAt: { type: Date, default: Date.now, index: true }
}, { versionKey: false });
eventSchema.index({ owner: 1, createdAt: -1 });
const Event = mongoose.models.ProfessionalEvent || mongoose.model("ProfessionalEvent", eventSchema);

const settingsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true, required: true },
  accountType: { type: String, enum: ["personal", "creator", "business", "professional"], default: "personal" },
  category: { type: String, default: "Digital creator" },
  showCategory: { type: Boolean, default: true },
  contact: { email: String, phone: String, address: String, showContact: { type: Boolean, default: false } },
  tools: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true, strict: true });
const ProfessionalSettings = mongoose.models.ProfessionalSettings || mongoose.model("ProfessionalSettings", settingsSchema);

const savedReplySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  shortcut: { type: String, required: true, trim: true, maxlength: 40 },
  message: { type: String, required: true, trim: true, maxlength: 2000 }
}, { timestamps: true });
savedReplySchema.index({ user: 1, shortcut: 1 }, { unique: true });
const SavedReply = mongoose.models.ProfessionalSavedReply || mongoose.model("ProfessionalSavedReply", savedReplySchema);

const allowedEvents = new Set(["view", "impression", "like", "comment", "share", "save", "follow", "unfollow", "profile_visit"]);
const allowedTools = new Set(["monthly-recap", "best-practices", "inspiration", "branded-content", "affiliate-programmes", "partnership-ads", "ad-tools", "trial-reels", "payouts", "gifts", "trending-audio", "helpful-resources", "account-status", "dashboard-settings"]);

router.get("/dashboard", async (req, res, next) => {
  try {
    const days = Math.min(90, Math.max(1, Number(req.query.days) || 30));
    const since = new Date(Date.now() - days * 86400000);
    const owner = new mongoose.Types.ObjectId(req.user.id);
    const [user, postCount, reelCount, eventTotals, daily, contentStats, settings] = await Promise.all([
      User.findById(owner).select("followersCount followingCount postsCount settings"),
      Post.countDocuments({ author: owner, deletedAt: null }),
      Reel.countDocuments({ author: owner }),
      Event.aggregate([{ $match: { owner, createdAt: { $gte: since } } }, { $group: { _id: "$type", count: { $sum: 1 }, uniqueActors: { $addToSet: "$actor" } } }]),
      Event.aggregate([
        { $match: { owner, createdAt: { $gte: since } } },
        { $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          views: { $sum: { $cond: [{ $in: ["$type", ["view", "impression"]] }, 1, 0] } },
          interactions: { $sum: { $cond: [{ $in: ["$type", ["like", "comment", "share", "save"]] }, 1, 0] } }
        } },
        { $sort: { _id: 1 } }
      ]),
      Event.aggregate([{ $match: { owner, createdAt: { $gte: since }, contentId: { $ne: null } } }, { $group: { _id: { contentId: "$contentId", contentType: "$contentType" }, views: { $sum: { $cond: [{ $in: ["$type", ["view", "impression"]] }, 1, 0] } }, likes: { $sum: { $cond: [{ $eq: ["$type", "like"] }, 1, 0] } }, comments: { $sum: { $cond: [{ $eq: ["$type", "comment"] }, 1, 0] } }, shares: { $sum: { $cond: [{ $eq: ["$type", "share"] }, 1, 0] } }, saves: { $sum: { $cond: [{ $eq: ["$type", "save"] }, 1, 0] } } } }, { $sort: { views: -1 } }, { $limit: 20 }]),
      ProfessionalSettings.findOne({ user: owner }).lean()
    ]);
    const totals = Object.fromEntries(eventTotals.map(x => [x._id, { count: x.count, uniqueActors: x.uniqueActors.filter(Boolean).length }]));
    const views = (totals.view?.count || 0) + (totals.impression?.count || 0);
    const interactions = ["like", "comment", "share", "save"].reduce((n, key) => n + (totals[key]?.count || 0), 0);
    res.json({
      range: { days, from: since.toISOString(), to: new Date().toISOString() },
      summary: { views, impressions: totals.impression?.count || 0, reach: new Set(eventTotals.filter(x => ["view", "impression", "profile_visit"].includes(x._id)).flatMap(x => x.uniqueActors.map(String)).filter(Boolean)).size, newFollowers: totals.follow?.count || 0, unfollows: totals.unfollow?.count || 0, netFollowers: (totals.follow?.count || 0) - (totals.unfollow?.count || 0), interactions, likes: totals.like?.count || 0, comments: totals.comment?.count || 0, shares: totals.share?.count || 0, saves: totals.save?.count || 0, profileVisits: totals.profile_visit?.count || 0, followers: user?.followersCount || 0, following: user?.followingCount || 0, posts: postCount, reels: reelCount, contentShared: postCount + reelCount },
      daily, topContent: contentStats, settings: settings || { accountType: user?.settings?.professionalAccount?.accountType || "personal", category: user?.settings?.professionalAccount?.category || "Digital creator", showCategory: true, contact: { showContact: false } },
      dataNotice: "Analytics reflect events recorded by ReelsGo after analytics tracking is enabled; they are not imported from Instagram."
    });
  } catch (error) { next(error); }
});

router.post("/events", async (req, res, next) => {
  try {
    const { type, contentId, contentType = "other" } = req.body || {};
    if (!allowedEvents.has(type)) return res.status(400).json({ message: "Unsupported analytics event type" });
    let ownerId = null;
    if (contentId && mongoose.isValidObjectId(contentId)) {
      if (contentType === "post") ownerId = (await Post.findById(contentId).select("author"))?.author;
      else if (contentType === "reel") ownerId = (await Reel.findById(contentId).select("author"))?.author;
      else return res.status(400).json({ message: "contentType must be post or reel when contentId is supplied" });
      if (!ownerId) return res.status(404).json({ message: "Content not found" });
    } else if (type === "profile_visit" && mongoose.isValidObjectId(req.body.ownerId)) {
      ownerId = req.body.ownerId;
    } else {
      return res.status(400).json({ message: "Provide a valid post/reel contentId, or ownerId for profile_visit" });
    }
    if (String(ownerId) === String(req.user.id) && ["view", "impression", "profile_visit"].includes(type)) return res.status(200).json({ ok: true, ignoredSelfView: true });
    await Event.create({ owner: ownerId, actor: req.user.id, contentId: contentId || null, contentType, type });
    res.status(201).json({ ok: true });
  } catch (error) { next(error); }
});

router.get("/settings", async (req, res, next) => {
  try {
    const settings = await ProfessionalSettings.findOne({ user: req.user.id }).lean();
    res.json({ settings: settings || { accountType: "personal", category: "Digital creator", showCategory: true, contact: { showContact: false } } });
  } catch (error) { next(error); }
});
router.put("/settings", async (req, res, next) => {
  try {
    const body = req.body || {};
    const update = {};
    if (body.accountType && ["personal", "creator", "business", "professional"].includes(body.accountType)) update.accountType = body.accountType;
    if (typeof body.category === "string") update.category = body.category.slice(0, 80);
    if (typeof body.showCategory === "boolean") update.showCategory = body.showCategory;
    if (body.contact && typeof body.contact === "object") {
      update.contact = {
        email: String(body.contact.email || "").slice(0, 254),
        phone: String(body.contact.phone || "").slice(0, 40),
        address: String(body.contact.address || "").slice(0, 300),
        showContact: Boolean(body.contact.showContact)
      };
    }
    const settings = await ProfessionalSettings.findOneAndUpdate({ user: req.user.id }, { $set: update, $setOnInsert: { user: req.user.id } }, { new: true, upsert: true, runValidators: true }).lean();
    await User.updateOne({ _id: req.user.id }, { $set: { "settings.professionalAccount": { accountType: settings.accountType, category: settings.category, showCategory: settings.showCategory, contact: settings.contact } } });
    res.json({ settings });
  } catch (error) { next(error); }
});

router.get("/saved-replies", async (req, res, next) => {
  try { res.json({ replies: await SavedReply.find({ user: req.user.id }).sort({ updatedAt: -1 }).lean() }); }
  catch (error) { next(error); }
});
router.post("/saved-replies", async (req, res, next) => {
  try {
    const shortcut = String(req.body?.shortcut || "").trim().replace(/^\//, "").slice(0, 40);
    const message = String(req.body?.message || "").trim().slice(0, 2000);
    if (!shortcut || !message) return res.status(400).json({ message: "Shortcut and message are required" });
    const reply = await SavedReply.create({ user: req.user.id, shortcut, message });
    res.status(201).json({ reply });
  } catch (error) { if (error.code === 11000) return res.status(409).json({ message: "That shortcut already exists" }); next(error); }
});
router.patch("/saved-replies/:id", async (req, res, next) => {
  try {
    const update = {};
    if (typeof req.body?.shortcut === "string") update.shortcut = req.body.shortcut.trim().replace(/^\//, "").slice(0, 40);
    if (typeof req.body?.message === "string") update.message = req.body.message.trim().slice(0, 2000);
    const reply = await SavedReply.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, { $set: update }, { new: true, runValidators: true });
    if (!reply) return res.status(404).json({ message: "Saved reply not found" });
    res.json({ reply });
  } catch (error) { next(error); }
});
router.delete("/saved-replies/:id", async (req, res, next) => {
  try { const result = await SavedReply.deleteOne({ _id: req.params.id, user: req.user.id }); if (!result.deletedCount) return res.status(404).json({ message: "Saved reply not found" }); res.json({ ok: true }); }
  catch (error) { next(error); }
});

router.get("/tools/:tool", async (req, res, next) => {
  try {
    if (!allowedTools.has(req.params.tool)) return res.status(404).json({ message: "Unknown professional tool" });
    const settings = await ProfessionalSettings.findOne({ user: req.user.id }).lean();
    res.json({ tool: req.params.tool, data: settings?.tools?.[req.params.tool] || {}, integrations: { ads: false, payouts: false, affiliate: false, trendingAudio: false } });
  } catch (error) { next(error); }
});
router.put("/tools/:tool", async (req, res, next) => {
  try {
    if (!allowedTools.has(req.params.tool)) return res.status(404).json({ message: "Unknown professional tool" });
    const data = req.body?.data;
    if (!data || typeof data !== "object" || Array.isArray(data)) return res.status(400).json({ message: "data must be an object" });
    const safeData = JSON.parse(JSON.stringify(data));
    if (JSON.stringify(safeData).length > 12000) return res.status(413).json({ message: "Tool settings are too large" });
    const path = `tools.${req.params.tool}`;
    const settings = await ProfessionalSettings.findOneAndUpdate({ user: req.user.id }, { $set: { [path]: safeData }, $setOnInsert: { user: req.user.id } }, { new: true, upsert: true }).lean();
    res.json({ ok: true, tool: req.params.tool, data: settings.tools?.[req.params.tool] || {} });
  } catch (error) { next(error); }
});

router.patch("/account-type", async (req, res, next) => {
  try {
    const accountType = req.body?.accountType;
    if (!["personal", "creator", "business", "professional"].includes(accountType)) return res.status(400).json({ message: "Invalid account type" });
    const settings = await ProfessionalSettings.findOneAndUpdate({ user: req.user.id }, { $set: { accountType }, $setOnInsert: { user: req.user.id } }, { new: true, upsert: true }).lean();
    await User.updateOne({ _id: req.user.id }, { $set: { "settings.professionalAccount.accountType": accountType } });
    res.json({ ok: true, accountType, settings });
  } catch (error) { next(error); }
});

export default router;
