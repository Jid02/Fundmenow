import { useEffect, useState } from "react";
import api from "../api.js";

export default function CreatorDashboard() {
  const [campaigns, setCampaigns] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    targetAmount: "",
    deadline: "",
    category: "",
    imageUrl: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const load = async () => {
    const res = await api.get("/campaigns/me/mine");
    setCampaigns(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await api.post("/campaigns", {
        ...form,
        targetAmount: Number(form.targetAmount)
      });
      setMessage("Campaign created successfully.");
      setForm({
        title: "",
        description: "",
        targetAmount: "",
        deadline: "",
        category: "",
        imageUrl: ""
      });
      await load();
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not create campaign.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-semibold text-slate-900 mb-4">
        Creator Dashboard
      </h1>

      {/* Form card */}
      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr] items-start mb-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5 space-y-4"
        >
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-lg font-semibold text-slate-900">
              Create new campaign
            </h2>
            <span className="text-[11px] text-slate-500">
              All fields marked * are required
            </span>
          </div>

          {message && (
            <p className="text-xs rounded-md px-3 py-2 border bg-slate-50 text-slate-700">
              {message}
            </p>
          )}

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Title *
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="E.g. Help for Medical Bills"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Share the story, why you are raising funds, and how they will be used."
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Target amount (₹) *
                </label>
                <input
                  type="number"
                  name="targetAmount"
                  min="1"
                  value={form.targetAmount}
                  onChange={handleChange}
                  required
                  placeholder="50000"
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Deadline *
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={form.deadline}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Category
                </label>
                <input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="E.g. Medical, Education"
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Cover image URL
              </label>
              <input
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleChange}
                placeholder="Paste an image link to show on the campaign card"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <p className="text-[11px] text-slate-500">
              You can edit or update this campaign later if needed.
            </p>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 rounded-md bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
            >
              {loading ? "Creating..." : "Create campaign"}
            </button>
          </div>
        </form>

        {/* Small summary tile */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5 text-sm text-slate-700">
          <h3 className="text-sm font-semibold text-slate-900 mb-2">
            Tips for a strong campaign
          </h3>
          <ul className="list-disc list-inside space-y-1 text-xs text-slate-600">
            <li>Use a clear, specific title that explains your **cause**.</li>
            <li>Write an honest story with how the funds will be used.</li>
            <li>Add a good quality image to build trust with donors.</li>
          </ul>
        </div>
      </div>

      {/* My campaigns list */}
      <section>
        <h2 className="text-lg font-semibold text-slate-900 mb-3">
          My campaigns
        </h2>
        {campaigns.length === 0 ? (
          <p className="text-sm text-slate-500">
            You have not created any campaigns yet.
          </p>
        ) : (
          <div className="space-y-3">
            {campaigns.map((c) => (
              <div
                key={c._id}
                className="bg-white rounded-lg border border-slate-200 shadow-sm px-4 py-3 flex items-center justify-between text-sm"
              >
                <div>
                  <p className="font-medium text-slate-900">{c.title}</p>
                  <p className="text-xs text-slate-500">
                    Raised ₹{c.raisedAmount} of ₹{c.targetAmount}
                  </p>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] ${
                    c.status === "completed"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-brand-50 text-brand-700"
                  }`}
                >
                  {c.status === "completed" ? "Completed" : "Open"}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
