import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    message: { type: String },
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Donation", donationSchema);
