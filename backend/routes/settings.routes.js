import express from "express";
import mongoose from "mongoose";
import auth from "../middleware/auth.js";
import User from "../models/User.js";
import UserSettings from "../models/UserSettings.js";

const router = express.Router();

const DEFAULT_SETTINGS = {
  account: { "Profile discovery": true, "Account suggestions": true },
  privacy: { "Activity status": true, "Hidden words": false, "Hide offensive comments": false, "Custom words filter": false, "Tags and mentions": true, "Allow tags from": true, "Allow mentions from": true, Comments: true, Sharing: true, "Allow remixing": true, "Allow downloads": true, "Story sharing": true, "Close friends visibility": true },
  security: { "Login alerts": true, "Two-factor authentication": false },
  notifications: { "Push notifications": true, "Likes and comments": true, "New followers": true, Messages: true, Reminders: true },
  messages: { "Read receipts": true, "Typing indicator": true, "Message requests": true },
  content: { "Sensitive content": true, "Autoplay videos": true, "Hidden words": false },
  media: { "Save original photos": false, "High quality uploads": true, "Allow downloads": true },
  accessibility: { "Reduce motion": false, "Captions": true, "Text size": true },
  language: { "App language": "English", "Translation": true },
  help: { "Email notifications": true }
};
const clone = value => JSON.parse(JSON.stringify(value));
const validPeopleType = type => type === "blocked" || type === "restricted";
const peopleField = type => type === "blocked" ? "blockedUsers" : "restrictedUsers";
const safePerson = user => ({ _id: user._id, name: user.name || "ReelsGo user", username: user.username || "", avatar: user.avatar || null, isPrivate: Boolean(user.isPrivate) });
const escapeRegex = value => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

async function getDoc(userId) {
  let doc = await UserSettings.findOne({ user: userId });
  if (!doc) {
    try { doc = await UserSettings.create({ user: userId, preferences: clone(DEFAULT_SETTINGS), blockedUsers: [], restrictedUsers: [] }); }
    catch (e) { if (e.code === 11000) doc = await UserSettings.findOne({ user: userId }); else throw e; }
  }
  return doc;
}
function mergedPreferences(doc) {
  const result = clone(DEFAULT_SETTINGS);
  const merge = (target, source) => {
    if (!source || typeof source !== "object" || Array.isArray(source)) return target;
    for (const [key, value] of Object.entries(source)) {
      if (value && typeof value === "object" && !Array.isArray(value)) target[key] = merge(target[key] && typeof target[key] === "object" ? target[key] : {}, value);
      else target[key] = value;
    }
    return target;
  };
  return merge(result, doc?.preferences || {});
}
function canonicalLabel(label) { return String(label).replace(/[^a-z0-9]/gi, "").toLowerCase(); }
function setFlatPreference(settings, key, value) {
  const raw = String(key || "");
  const dot = raw.indexOf(".");
  if (dot < 1) return false;
  const section = raw.slice(0, dot);
  const label = raw.slice(dot + 1);
  if (!Object.prototype.hasOwnProperty.call(DEFAULT_SETTINGS, section)) return false;
  const original = Object.keys(DEFAULT_SETTINGS[section]).find(k => canonicalLabel(k) === canonicalLabel(label));
  if (!original) return false;
  if (typeof DEFAULT_SETTINGS[section][original] === "boolean" && typeof value !== "boolean") return false;
  if (typeof DEFAULT_SETTINGS[section][original] === "string" && typeof value !== "string") return false;
  settings[section][original] = value;
  return true;
}

router.get("/me/settings", auth, async (req, res) => {
  try { const doc = await getDoc(req.user.id); return res.json({ settings: mergedPreferences(doc) }); }
  catch (error) { console.error("GET settings:", error); return res.status(500).json({ message: "Unable to load settings." }); }
});

router.patch("/me/settings", auth, async (req, res) => {
  try {
    const doc = await getDoc(req.user.id);
    const settings = mergedPreferences(doc);
    const body = req.body || {};
    if (body.settings && typeof body.settings === "object" && !Array.isArray(body.settings)) {
      for (const [section, values] of Object.entries(body.settings)) {
        if (!Object.prototype.hasOwnProperty.call(DEFAULT_SETTINGS, section) || !values || typeof values !== "object" || Array.isArray(values)) continue;
        for (const [key, value] of Object.entries(values)) { if (!setFlatPreference(settings, `${section}.${key}`, value)) { if (Object.prototype.hasOwnProperty.call(DEFAULT_SETTINGS[section], key) && typeof DEFAULT_SETTINGS[section][key] === typeof value) settings[section][key] = value; } }
      }
    } else if (body.section && body.key !== undefined) {
      if (!setFlatPreference(settings, `${body.section}.${body.key}`, body.value)) return res.status(400).json({ message: "Unknown setting or invalid value." });
    } else if (body.key) {
      if (!setFlatPreference(settings, body.key, body.value)) return res.status(400).json({ message: "Unknown setting or invalid value." });
    } else return res.status(400).json({ message: "Provide a setting key and value." });
    doc.preferences = settings; doc.markModified("preferences"); await doc.save();
    return res.json({ message: "Settings saved.", settings: mergedPreferences(doc) });
  } catch (error) { console.error("PATCH settings:", error); return res.status(500).json({ message: "Unable to save settings." }); }
});

// People manager routes MUST appear before /me/settings/:section.
router.get("/me/settings/people", auth, async (req, res) => {
  try {
    const type = String(req.query.type || "blocked").toLowerCase();
    if (!validPeopleType(type)) return res.status(400).json({ message: "type must be blocked or restricted." });
    const doc = await getDoc(req.user.id);
    const field = peopleField(type);
    const search = String(req.query.search || "").trim();
    if (!search) {
      const current = await UserSettings.findById(doc._id).populate(field, "name username avatar isPrivate");
      return res.json({ people: (current?.[field] || []).filter(Boolean).map(safePerson) });
    }
    const regex = new RegExp(escapeRegex(search.replace(/^@/, "")), "i");
    const excluded = [...(doc.blockedUsers || []), ...(doc.restrictedUsers || []), new mongoose.Types.ObjectId(req.user.id)];
    const users = await User.find({ _id: { $nin: excluded }, $or: [{ username: regex }, { name: regex }] }).select("name username avatar isPrivate").limit(25).lean();
    return res.json({ people: users.map(safePerson) });
  } catch (error) { console.error("Search settings people:", error); return res.status(500).json({ message: "Unable to load accounts." }); }
});

router.post("/me/settings/people/:type/:userId", auth, async (req, res) => {
  try {
    const { type, userId } = req.params;
    if (!validPeopleType(type)) return res.status(400).json({ message: "type must be blocked or restricted." });
    if (!mongoose.isValidObjectId(userId)) return res.status(400).json({ message: "Invalid user id." });
    if (String(userId) === String(req.user.id)) return res.status(400).json({ message: "You cannot add your own account." });
    const target = await User.findById(userId).select("_id");
    if (!target) return res.status(404).json({ message: "Account not found." });
    const doc = await getDoc(req.user.id);
    const field = peopleField(type);
    await UserSettings.updateOne({ _id: doc._id }, { $addToSet: { [field]: target._id } });
    const refreshed = await UserSettings.findById(doc._id).populate(field, "name username avatar isPrivate");
    return res.json({ message: type === "blocked" ? "Account blocked." : "Account restricted.", people: (refreshed[field] || []).filter(Boolean).map(safePerson) });
  } catch (error) { console.error("Add settings person:", error); return res.status(500).json({ message: "Unable to update account list." }); }
});

router.delete("/me/settings/people/:type/:userId", auth, async (req, res) => {
  try {
    const { type, userId } = req.params;
    if (!validPeopleType(type)) return res.status(400).json({ message: "type must be blocked or restricted." });
    if (!mongoose.isValidObjectId(userId)) return res.status(400).json({ message: "Invalid user id." });
    const doc = await getDoc(req.user.id); const field = peopleField(type);
    await UserSettings.updateOne({ _id: doc._id }, { $pull: { [field]: userId } });
    const refreshed = await UserSettings.findById(doc._id).populate(field, "name username avatar isPrivate");
    return res.json({ message: "Account removed from list.", people: (refreshed[field] || []).filter(Boolean).map(safePerson) });
  } catch (error) { console.error("Remove settings person:", error); return res.status(500).json({ message: "Unable to remove account." }); }
});

router.get("/me/settings/:section", auth, async (req, res) => {
  try {
    const section = String(req.params.section || "");
    if (!Object.prototype.hasOwnProperty.call(DEFAULT_SETTINGS, section)) return res.status(404).json({ message: "Settings section not found." });
    const doc = await getDoc(req.user.id);
    return res.json({ section, settings: mergedPreferences(doc)[section] });
  } catch (error) { console.error("GET settings section:", error); return res.status(500).json({ message: "Unable to load settings section." }); }
});

export default router;
