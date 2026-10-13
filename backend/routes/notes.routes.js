import express from "express";
import auth from "../middleware/auth.js";
import Note from "../models/Note.js";
import Follow from "../models/Follow.js";

const router = express.Router();

const NOTE_SELECT = "author text music audience expiresAt createdAt updatedAt";

function normalizeAudience(value) {
  // Match the Note schema enum exactly.
  return value === "close_friends" ? "close_friends" : "followers";
}

/*
|--------------------------------------------------------------------------
| GET NOTES
|--------------------------------------------------------------------------
*/
router.get("/", auth, async (req, res) => {
  try {
    const following = await Follow.find({
      follower: req.user.id,
      status: "accepted"
    }).select("following").lean();

    const followingIds = following.map(item => item.following);
    const allowedAuthors = [req.user.id, ...followingIds];

    const notes = await Note.find({
      author: { $in: allowedAuthors },
      expiresAt: { $gt: new Date() }
    })
      .select(NOTE_SELECT)
      .populate("author", "name username isPrivate updatedAt")
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return res.json({ notes });
  } catch (error) {
    console.error("GET notes:", error);
    return res.status(500).json({ message: "Failed to load notes" });
  }
});

/*
|--------------------------------------------------------------------------
| CREATE NOTE
|--------------------------------------------------------------------------
*/
router.post("/", auth, async (req, res) => {
  try {
    const text = String(req.body?.text || "").trim();
    if (!text) {
      return res.status(400).json({ message: "Write something for your note" });
    }

    const note = await Note.create({
      author: req.user.id,
      text: text.slice(0, 60),
      music: String(req.body?.music || "").slice(0, 120),
      audience: normalizeAudience(req.body?.audience),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });

    const populated = await Note.findById(note._id)
      .select(NOTE_SELECT)
      .populate("author", "name username isPrivate updatedAt");

    return res.status(201).json({ note: populated });
  } catch (error) {
    console.error("CREATE note:", error);
    return res.status(500).json({ message: "Failed to create note" });
  }
});

/*
|--------------------------------------------------------------------------
| UPDATE NOTE
| PATCH and PUT are both supported for compatibility with the frontend.
| A user can update only their own note. Editing does not extend expiry.
|--------------------------------------------------------------------------
*/
async function updateOwnNote(req, res) {
  try {
    const updates = {};
    if (Object.prototype.hasOwnProperty.call(req.body || {}, "text")) {
      const text = String(req.body.text || "").trim();
      if (!text) {
        return res.status(400).json({ message: "Note text cannot be empty" });
      }
      updates.text = text.slice(0, 60);
    }

    if (Object.prototype.hasOwnProperty.call(req.body || {}, "audience")) {
      const audience = req.body.audience;
      if (!["followers", "close_friends", "close-friends"].includes(audience)) {
        return res.status(400).json({ message: "Invalid note audience" });
      }
      updates.audience = normalizeAudience(audience);
    }

    if (Object.prototype.hasOwnProperty.call(req.body || {}, "music")) {
      updates.music = String(req.body.music || "").slice(0, 120);
    }

    if (!Object.keys(updates).length) {
      return res.status(400).json({ message: "No note changes were provided" });
    }

    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, author: req.user.id, expiresAt: { $gt: new Date() } },
      { $set: updates },
      { new: true, runValidators: true }
    )
      .select(NOTE_SELECT)
      .populate("author", "name username isPrivate updatedAt");

    if (!note) {
      return res.status(404).json({ message: "Note not found, expired, or you do not own it" });
    }

    return res.json({ ok: true, note });
  } catch (error) {
    console.error("UPDATE note:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid note ID" });
    }
    return res.status(500).json({ message: "Failed to update note" });
  }
}

router.patch("/:id", auth, updateOwnNote);
router.put("/:id", auth, updateOwnNote);

/*
|--------------------------------------------------------------------------
| DELETE NOTE
|--------------------------------------------------------------------------
*/
router.delete("/:id", auth, async (req, res) => {
  try {
    const deleted = await Note.findOneAndDelete({
      _id: req.params.id,
      author: req.user.id
    });

    if (!deleted) {
      return res.status(404).json({ message: "Note not found or you do not own it" });
    }

    return res.json({ ok: true, deletedId: String(deleted._id) });
  } catch (error) {
    console.error("DELETE note:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid note ID" });
    }
    return res.status(500).json({ message: "Failed to delete note" });
  }
});

export default router;
