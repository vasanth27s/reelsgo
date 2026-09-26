import express from "express";
import auth from "../middleware/auth.js";
import Note from "../models/Note.js";
import Follow from "../models/Follow.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| GET NOTES
|--------------------------------------------------------------------------
*/

router.get("/", auth, async (req, res) => {
  try {
    const following =
      await Follow.find({
        follower: req.user.id,
        status: "accepted"
      })
        .select("following")
        .lean();

    const followingIds =
      following.map(
        item => item.following
      );

    const allowedAuthors = [
      req.user.id,
      ...followingIds
    ];

    const notes =
      await Note.find({
        author: {
          $in: allowedAuthors
        },

        expiresAt: {
          $gt: new Date()
        }
      })
        .populate(
          "author",
          "name username isPrivate updatedAt"
        )
        .sort({
          createdAt: -1
        })
        .limit(50)
        .lean();

    res.json({
      notes
    });
  } catch (error) {
    console.error(
      "GET notes:",
      error
    );

    res.status(500).json({
      message: error.message
    });
  }
});

/*
|--------------------------------------------------------------------------
| CREATE NOTE
|--------------------------------------------------------------------------
*/

router.post("/", auth, async (req, res) => {
  try {
    const text = String(
      req.body.text || ""
    ).trim();

    if (!text) {
      return res.status(400).json({
        message: "Write something for your note"
      });
    }

    const note =
      await Note.create({
        author: req.user.id,

        text: text.slice(0, 60),

        music:
          req.body.music || "",

        audience:
          req.body.audience ||
          "followers",

        expiresAt:
          new Date(
            Date.now() +
              24 * 60 * 60 * 1000
          )
      });

    const populated =
      await Note.findById(
        note._id
      ).populate(
        "author",
        "name username isPrivate updatedAt"
      );

    res.status(201).json({
      note: populated
    });
  } catch (error) {
    console.error(
      "CREATE note:",
      error
    );

    res.status(500).json({
      message: error.message
    });
  }
});

/*
|--------------------------------------------------------------------------
| DELETE NOTE
|--------------------------------------------------------------------------
*/

router.delete(
  "/:id",
  auth,
  async (req, res) => {
    try {
      await Note.deleteOne({
        _id: req.params.id,

        author:
          req.user.id
      });

      res.json({
        ok: true
      });
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  }
);

export default router;