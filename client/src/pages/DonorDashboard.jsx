import { useEffect, useState } from "react";
import api from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function DonorDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalAmount: 0,
    totalDonations: 0,
    donations: []
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/donations/me");
        setSummary(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load donations");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

  return (
    <div className="dashboard-shell">
      <div className="card">
        <div className="card-header">
          <div>
            <div style={{ fontSize: 13, color: "#6b7280" }}>Welcome back,</div>
            <h2 style={{ margin: 0, fontSize: 22 }}>{user?.name}</h2>
          </div>
          <div className="chip">Donor Dashboard</div>
        </div>

        <p style={{ marginTop: 10, fontSize: 13, color: "#6b7280" }}>
          Track your giving history and see how your contributions make an **impact**.
        </p>

        {error && (
          <p style={{ color: "#b91c1c", fontSize: 13, marginTop: 6 }}>{error}</p>
        )}

        {loading ? (
          <p style={{ marginTop: 18, fontSize: 14, color: "#6b7280" }}>
            Loading your donations…
          </p>
        ) : (
          <>
            <div className="stats-grid">
              <div className="card" style={{ padding: 12 }}>
                <div className="stat-card-title">Total donated</div>
                <div className="stat-card-value">
                  ₹{summary.totalAmount.toLocaleString("en-IN")}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "#6b7280",
                    marginTop: 4
                  }}
                >
                  Across all campaigns
                </div>
              </div>

              <div className="card" style={{ padding: 12 }}>
                <div className="stat-card-title">Donations made</div>
                <div className="stat-card-value">
                  {summary.totalDonations}
                </div>
                <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                  Individual contributions
                </div>
              </div>

              <div className="card" style={{ padding: 12 }}>
                <div className="stat-card-title">Average gift</div>
                <div className="stat-card-value">
                  {summary.totalDonations > 0
                    ? `₹${Math.round(
                        summary.totalAmount / summary.totalDonations
                      ).toLocaleString("en-IN")}`
                    : "—"}
                </div>
                <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                  Per donation
                </div>
              </div>
            </div>

            <div style={{ marginTop: 24 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between"
                }}
              >
                <h3 style={{ margin: 0, fontSize: 18 }}>Donation history</h3>
                {summary.totalDonations > 0 && (
                  <span className="badge-pill">
                    {summary.totalDonations} donations
                  </span>
                )}
              </div>

              {summary.totalDonations === 0 ? (
                <div className="empty-state">
                  You have not made any donations yet. Explore campaigns and be
                  the first to support a **cause**.
                </div>
              ) : (
                <div className="donation-list">
                  <div className="donation-row header">
                    <div>Campaign</div>
                    <div>Amount</div>
                    <div>Date</div>
                    <div>Message</div>
                  </div>

                  {summary.donations.map((d) => (
                    <div key={d._id} className="donation-row">
                      <div className="donation-campaign">
                        <span className="donation-campaign-title">
                          {d.campaign?.title || "Campaign"}
                        </span>
                        <span className="donation-campaign-meta">
                          ID: {d.campaign?._id || d.campaign}
                        </span>
                      </div>
                      <div className="donation-amount">
                        ₹{d.amount.toLocaleString("en-IN")}
                      </div>
                      <div className="donation-date">
                        {formatDate(d.createdAt)}
                      </div>
                      <div className="donation-message">
                        {d.message || "—"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
