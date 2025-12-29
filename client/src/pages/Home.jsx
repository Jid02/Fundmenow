import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";


export default function Home() {
  const [campaigns, setCampaigns] = useState([]);
  const { user } = useAuth();


  useEffect(() => {
    api.get("/campaigns").then((res) => setCampaigns(res.data));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Hero */}
      <section className="mb-6 sm:mb-8">
        <div className="grid gap-6 sm:grid-cols-[1.6fr_1fr] items-center">
          <div>
            <p className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 mb-3">
              Crowdfunding for real people
            </p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-900 mb-2">
              Support causes that truly MATTERS.
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mb-4">
              Discover campaigns in your community and make a difference in
              just a few clicks. Every contribution helps someone get closer
              to their goal.
            </p>
            <div className="flex flex-wrap gap-3">
  <Link
  to="/campaigns"
  className="px-4 py-2 rounded-full bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 shadow-sm"
>
  Browse campaigns
</Link>

  {user ? (
    user.role === "creator" ? (
      <Link
        to="/creator/dashboard"
        className="px-4 py-2 rounded-full border border-brand-200 text-brand-700 text-sm hover:bg-brand-50"
      >
        Create Campaigns
      </Link>
    ) : (
      <Link
        to="/donor/dashboard"
        className="px-4 py-2 rounded-full border border-brand-200 text-brand-700 text-sm hover:bg-brand-50"
      >
        Go to donor dashboard
      </Link>
    )
  ) : (
    <Link
      to="/register"
      className="px-4 py-2 rounded-full border border-brand-200 text-brand-700 text-sm hover:bg-brand-50"
    >
      Start a campaign
    </Link>
  )}
</div>

          </div>
          <div className="hidden sm:block">
            <div className="rounded-2xl bg-gradient-to-br from-brand-500 via-brand-400 to-emerald-400 p-5 text-white h-full flex flex-col justify-between shadow-lg">
              <div>
                <p className="text-xs uppercase tracking-wide text-brand-100">
                  Live impact
                </p>
                <p className="mt-2 text-lg font-semibold">
                  People like you are funding medical, education, and emergency
                  campaigns every day.
                </p>
              </div>
              <div className="mt-4 space-y-2 text-xs">
                <p className="flex items-center justify-between">
                  <span>Today&apos;s donors</span>
                  <span className="font-semibold">128</span>
                </p>
                <p className="flex items-center justify-between">
                  <span>Funds raised this week</span>
                  <span className="font-semibold">₹3,45,000</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Campaign cards */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
            Featured campaigns
          </h2>
          <span className="text-xs text-slate-500">
            {campaigns.length} active campaigns
          </span>
        </div>

        {campaigns.length === 0 ? (
          <p className="text-sm text-slate-500">
            No campaigns yet. Be the first to create a **campaign**.
          </p>
        ) : (
          <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((c) => {
              const progress =
                c.targetAmount > 0
                  ? Math.min(
                      100,
                      Math.round((c.raisedAmount / c.targetAmount) * 100)
                    )
                  : 0;
              return (
                <Link
                  to={`/campaigns/${c._id}`}
                  key={c._id}
                  className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col"
                >
                  {c.imageUrl ? (
                    <div className="h-32 w-full overflow-hidden">
                      <img
                        src={c.imageUrl}
                        alt={c.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                  ) : (
                    <div className="h-32 w-full bg-gradient-to-br from-sky-100 via-slate-100 to-emerald-100" />
                  )}
                  <div className="p-3 sm:p-4 flex flex-col flex-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-sm sm:text-base font-semibold text-slate-900 line-clamp-2">
                        {c.title}
                      </h3>
                      {c.category && (
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-medium text-slate-600 uppercase tracking-wide">
                          {c.category}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-3 mb-3">
                      {c.description}
                    </p>

                    <div className="mt-auto space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-slate-600">
                        <span>
                          Raised{" "}
                          <span className="font-semibold text-slate-900">
                            ₹{c.raisedAmount}
                          </span>
                        </span>
                        <span>of ₹{c.targetAmount}</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-brand-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full ${
                            c.status === "completed"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-brand-50 text-brand-700"
                          }`}
                        >
                          {c.status === "completed" ? "Completed" : "Open"}
                        </span>
                        <span className="text-slate-500">
                          {progress}% funded
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
