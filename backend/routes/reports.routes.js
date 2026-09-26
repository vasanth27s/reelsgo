import express from "express";
import auth from "../middleware/auth.js";
import Report from "../models/Report.js";

const router = express.Router();

router.post("/", auth, async (req, res) => {
  const report = await Report.create({
    reporter: req.user.id,
    targetType: req.body.targetType,
    targetId: req.body.targetId,
    reason: req.body.reason,
    details: req.body.details || ""
  });

  res.status(201).json({ report });
});

export default router;
