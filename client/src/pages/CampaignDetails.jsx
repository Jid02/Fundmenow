// client/src/pages/CampaignDetails.jsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function CampaignDetails() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [donations, setDonations] = useState([]);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState("");
  const { user } = useAuth();

  const load = async () => {
    const [campRes, donsRes] = await Promise.all([
      api.get(`/campaigns/${id}`),
      api.get(`/donations/campaign/${id}`)
    ]);
    setCampaign(campRes.data);
    setDonations(donsRes.data);
  };

  useEffect(() => {
    load();
  }, [id]);

  if (!campaign) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6 text-sm text-slate-600">
        Loading campaign…
      </div>
    );
  }

  const progress =
    campaign.targetAmount > 0
      ? Math.min(
          100,
          Math.round((campaign.raisedAmount / campaign.targetAmount) * 100)
        )
      : 0;

  const handleDonate = async (e) => {
    e.preventDefault();
    setFeedback("");

    if (!amount || Number(amount) <= 0) {
      setFeedback("Please enter a valid amount.");
      return;
    }

    try {
      await api.post("/donations", {
        campaignId: id,
        amount: Number(amount),
        message
      });

      setFeedback("Thank you for your **donation**!");
      setAmount("");
      setMessage("");
      await load(); // refresh campaign + donors
    } catch (err) {
      setFeedback(err.response?.data?.message || "Error while donating");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid gap-5 lg:grid-cols-[2fr_1.2fr]">
        {/* LEFT COLUMN: campaign details + donors */}
        <div className="space-y-4">
          {/* Campaign details card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {campaign.imageUrl && (
              <div className="h-48 w-full overflow-hidden">
                <img
                  src={campaign.imageUrl}
                  alt={campaign.title}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <div className="p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">
                  {campaign.title}
                </h1>
                {campaign.category && (
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[11px] font-medium uppercase tracking-wide text-slate-600">
                    {campaign.category}
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-600 mb-4">
                {campaign.description}
              </p>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>
                    Raised{" "}
                    <span className="font-semibold text-slate-900">
                      ₹{campaign.raisedAmount}
                    </span>{" "}
                    of ₹{campaign.targetAmount}
                  </span>
                  <span className="text-slate-500">{progress}% funded</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600 mt-1">
                  <span>
                    Created by{" "}
                    <span className="font-medium text-slate-800">
                      {campaign.creator?.name}
                    </span>
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full ${
                      campaign.status === "completed"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-brand-50 text-brand-700"
                    }`}
                  >
                    {campaign.status === "completed" ? "Completed" : "Open"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent donors card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm sm:text-base font-semibold text-slate-900">
                Recent donors
              </h2>
              <span className="text-[11px] text-slate-500">
                {donations.length} contributions
              </span>
            </div>

            {donations.length === 0 ? (
              <p className="text-xs text-slate-500">
                No donations yet. Be the first to support this **campaign**.
              </p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {donations.map((d) => (
                  <div
                    key={d._id}
                    className="flex items-center justify-between text-xs border-b border-slate-100 pb-1 last:border-b-0"
                  >
                    <div>
                      <p className="font-medium text-slate-800">
                        {d.donor?.name || "Anonymous"}
                      </p>
                      {d.message && (
                        <p className="text-[11px] text-slate-500 line-clamp-1">
                          {d.message}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">
                        ₹{d.amount}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {new Date(d.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short"
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: donate box */}
        <div className="space-y-3">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5">
            <h2 className="text-base sm:text-lg font-semibold text-slate-900 mb-1">
              Make a contribution
            </h2>
            <p className="text-xs text-slate-600 mb-3">
              Your support brings this campaign closer to its goal.
            </p>

            {feedback && (
              <p className="text-xs mb-3 text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-md px-3 py-2">
                {feedback}
              </p>
            )}

            {user?.role === "donor" ? (
              <form onSubmit={handleDonate} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                    placeholder="Enter amount"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Message (optional)
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                    placeholder="Send a message of support"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-md bg-brand-500 text-white text-sm font-medium py-2.5 hover:bg-brand-600 transition shadow-sm"
                >
                  Donate now
                </button>
              </form>
            ) : (
              <p className="text-xs text-slate-600">
                Please log in as a **donor** to donate to this campaign.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
