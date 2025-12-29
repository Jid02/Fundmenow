import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api.js";

export default function CampaignListPage() {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    api.get("/campaigns").then((res) => setCampaigns(res.data));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-semibold text-slate-900 mb-1">
        Explore campaigns
      </h1>
      <p className="text-sm text-slate-600 mb-4">
        Browse all active campaigns and choose where you want to make an **impact**.
      </p>
      <div className="h-px w-32 bg-slate-200 mb-5" />

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
    </div>
  );
}
