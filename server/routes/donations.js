import express from "express";
import Donation from "../models/Donation.js";
import Campaign from "../models/Campaign.js";
import { protect, restrictTo } from "../middleware/auth.js";

const router = express.Router();

// Donor: donate to campaign
router.post("/", protect, restrictTo("donor"), async (req, res) => {
  try {
    const { campaignId, amount, message } = req.body;
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });

    const donation = await Donation.create({
      amount,
      message,
      donor: req.user.id,
      campaign: campaignId
    });

    campaign.raisedAmount += amount;
    if (campaign.raisedAmount >= campaign.targetAmount)
      campaign.status = "completed";
    await campaign.save();

    res.status(201).json(donation);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Creator: view donations to their campaigns
router.get(
  "/creator/mine",
  protect,
  restrictTo("creator"),
  async (req, res) => {
    try {
      const donations = await Donation.find()
        .populate({
          path: "campaign",
          match: { creator: req.user.id },
          select: "title"
        })
        .populate("donor", "name email")
        .sort({ createdAt: -1 });

      const filtered = donations.filter((d) => d.campaign !== null);
      res.json(filtered);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);
// Donor: view own donation history
router.get("/me", protect, restrictTo("donor"), async (req, res) => {
  try {
    const donations = await Donation.find({ donor: req.user.id })
      .populate("campaign", "title imageUrl")
      .sort({ createdAt: -1 });

    // calculate summary
    const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);

    res.json({
      totalAmount,
      totalDonations: donations.length,
      donations
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
// Public/creator: donations for a specific campaign
router.get("/campaign/:id", async (req, res) => {
  try {
    const donations = await Donation.find({ campaign: req.params.id })
      .populate("donor", "name email")
      .sort({ createdAt: -1 });
    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
