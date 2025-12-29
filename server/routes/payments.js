import crypto from "crypto";
import { protect, restrictTo } from "../middleware/auth.js";
import Campaign from "../models/Campaign.js";
import Donation from "../models/Donation.js";
import express from "express";

const router = express.Router();

router.post(
  "/create-order",
  protect,
  restrictTo("donor"),
  async (req, res) => { 
    try {
      const { campaignId, amount } = req.body;

      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      const campaign = await Campaign.findById(campaignId);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }

      const options = {
        amount: amount * 100, // Razorpay uses paise
        currency: "INR",
        receipt: `donation_${campaignId}_${Date.now()}`
      };

      const order = await razorpay.orders.create(options);

      res.json({
        key: process.env.RAZORPAY_KEY_ID,
        orderId: order.id,
        amount: options.amount,
        currency: options.currency
      });
    } catch (err) {
  console.error("CREATE ORDER ERROR:", err);
  res.status(500).json({ message: "Could not create order" });
}

  }
);

// Verify payment and record donation (donor only)
router.post(
  "/verify",
  protect,
  restrictTo("donor"),
  async (req, res) => {
    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        campaignId,
        amount,
        message
      } = req.body;

      const body = razorpay_order_id + "|" + razorpay_payment_id;

      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({ message: "Payment signature mismatch" });
      }

      const donation = await Donation.create({
        amount,
        message,
        donor: req.user.id,
        campaign: campaignId
      });

      const campaign = await Campaign.findById(campaignId);
      campaign.raisedAmount += amount;
      if (campaign.raisedAmount >= campaign.targetAmount) {
        campaign.status = "completed";
      }
      await campaign.save();

      res.json({ message: "Payment verified", donation });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Could not verify payment" });
    }
  }
);

export default router;
