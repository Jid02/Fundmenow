import express from "express";
import Campaign from "../models/Campaign.js";
import { protect, restrictTo } from "../middleware/auth.js";

const router = express.Router();

// Public: get all campaigns
router.get("/", async (req, res) => {
  try {
    const campaigns = await Campaign.find()
      .populate("creator", "name")
      .sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Public: get single campaign
router.get("/:id", async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate(
      "creator",
      "name"
    );
    if (!campaign) return res.status(404).json({ message: "Not found" });
    res.json(campaign);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Creator: create campaign
router.post("/", protect, restrictTo("creator"), async (req, res) => {
  try {
    const { title, description, targetAmount, deadline, category, imageUrl } =
      req.body;
    const campaign = await Campaign.create({
      title,
      description,
      targetAmount,
      deadline,
      category,
      imageUrl,
      creator: req.user.id
    });
    res.status(201).json(campaign);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Creator: get own campaigns
router.get("/me/mine", protect, restrictTo("creator"), async (req, res) => {
  try {
    const campaigns = await Campaign.find({ creator: req.user.id }).sort({
      createdAt: -1
    });
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
