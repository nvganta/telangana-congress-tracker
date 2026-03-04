"use client";

import { useState, useEffect, useCallback } from "react";
import { GovernmentPromise, PromiseStatus } from "@/lib/types";
import { STATUS_COLORS, STATUS_LABELS } from "@/lib/constants";
import guaranteesData from "@/data/guarantees.json";

interface FeedbackEntry {
  id: string;
  name: string;
  email?: string;
  type: "feedback" | "feature" | "bug";
  message: string;
  createdAt: string;
}

const FEEDBACK_TYPE_COLORS: Record<string, string> = {
  feedback: "#00d4ff",
  feature: "#facc15",
  bug: "#ff3333",
};

const initialGuarantees = guaranteesData as GovernmentPromise[];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [guarantees, setGuarantees] = useState<GovernmentPromise[]>(initialGuarantees);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [feedbackItems, setFeedbackItems] = useState<FeedbackEntry[]>([]);

  const loadFeedback = useCallback(async () => {
    try {
      const res = await fetch("/api/feedback");
      if (res.ok) {
        const data = await res.json();
        setFeedbackItems(data.sort((a: FeedbackEntry, b: FeedbackEntry) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ));
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (isAuthenticated) loadFeedback();
  }, [isAuthenticated, loadFeedback]);

  const handleLogin = () => {
    // Simple password check — in production, use env variable via API route
    if (password === "telangana2024") {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Invalid password");
    }
  };

  const updatePromise = (id: string, field: string, value: string | number) => {
    setGuarantees(prev =>
      prev.map(g =>
        g.id === id
          ? { ...g, [field]: value, lastUpdated: new Date().toISOString().split("T")[0] }
          : g
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/promises", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: guarantees, password }),
      });
      if (res.ok) {
        setSaveMessage("Saved successfully! Redeploy to see changes.");
      } else {
        setSaveMessage("Error saving. Check console.");
      }
    } catch {
      setSaveMessage("Error saving. API route may not be set up yet.");
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMessage(""), 5000);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="fade-in max-w-md mx-auto mt-20">
        <div className="glow-card p-6 text-center">
          <h1 className="text-lg font-bold tracking-[0.15em] mb-6">
            ADMIN <span className="neon-text-red">ACCESS</span>
          </h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="Enter password"
            className="w-full bg-bg-primary border border-border-default rounded px-4 py-2 text-sm text-text-primary focus:border-accent-blue focus:outline-none mb-3"
          />
          {error && <p className="text-accent-red text-[10px] mb-3">{error}</p>}
          <button
            onClick={handleLogin}
            className="w-full bg-accent-blue/20 text-accent-blue border border-accent-blue/40 rounded px-4 py-2 text-sm hover:bg-accent-blue/30 transition-colors"
          >
            LOGIN
          </button>
          <p className="text-[9px] text-text-muted mt-4">
            Default: telangana2024 — Change this in production via env variables
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-bold tracking-[0.15em]">
            ADMIN <span className="neon-text-blue">PANEL</span>
          </h1>
          <p className="text-[10px] text-text-muted tracking-wider mt-1">
            UPDATE PROMISE STATUSES, PROGRESS, AND DETAILS
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saveMessage && (
            <span className="text-[10px] text-accent-green">{saveMessage}</span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-accent-green/20 text-accent-green border border-accent-green/40 rounded px-4 py-2 text-[11px] tracking-wider hover:bg-accent-green/30 transition-colors disabled:opacity-50"
          >
            {saving ? "SAVING..." : "SAVE CHANGES"}
          </button>
        </div>
      </div>

      {/* Feedback Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold tracking-[0.15em]">
            USER <span className="neon-text-yellow">FEEDBACK</span>
            <span className="text-[10px] text-text-muted font-normal ml-2">({feedbackItems.length})</span>
          </h2>
          <button
            onClick={loadFeedback}
            className="text-[10px] tracking-wider text-accent-blue hover:underline"
          >
            REFRESH
          </button>
        </div>

        {feedbackItems.length === 0 ? (
          <div className="glow-card p-4 text-center">
            <p className="text-[10px] text-text-muted">No feedback submitted yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {feedbackItems.map((fb) => (
              <div key={fb.id} className="glow-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="text-[9px] tracking-wider font-bold px-1.5 py-0.5 rounded"
                    style={{
                      color: FEEDBACK_TYPE_COLORS[fb.type],
                      backgroundColor: FEEDBACK_TYPE_COLORS[fb.type] + "15",
                    }}
                  >
                    {fb.type.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-text-primary font-semibold">{fb.name}</span>
                  {fb.email && <span className="text-[9px] text-text-muted">{fb.email}</span>}
                  <span className="text-[9px] text-text-muted ml-auto">
                    {new Date(fb.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <p className="text-[11px] text-text-secondary whitespace-pre-wrap">{fb.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Guarantee editors */}
      <div className="space-y-4">
        {guarantees.map((g) => (
          <div key={g.id} className="glow-card p-4">
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-sm font-bold text-text-primary">{g.name}</h3>
              <span
                className="text-[9px] tracking-wider font-bold px-1.5 py-0.5 rounded"
                style={{
                  color: STATUS_COLORS[g.status],
                  backgroundColor: `${STATUS_COLORS[g.status]}15`,
                }}
              >
                {STATUS_LABELS[g.status]}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Status */}
              <div>
                <label className="text-[9px] text-text-muted tracking-wider block mb-1">STATUS</label>
                <select
                  value={g.status}
                  onChange={(e) => updatePromise(g.id, "status", e.target.value)}
                  className="w-full bg-bg-primary border border-border-default rounded px-3 py-1.5 text-xs text-text-primary focus:border-accent-blue focus:outline-none"
                >
                  {Object.entries(STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Progress */}
              <div>
                <label className="text-[9px] text-text-muted tracking-wider block mb-1">
                  PROGRESS: {g.progress}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={g.progress}
                  onChange={(e) => updatePromise(g.id, "progress", parseInt(e.target.value))}
                  className="w-full accent-accent-blue"
                />
              </div>

              {/* Delivered */}
              <div>
                <label className="text-[9px] text-text-muted tracking-wider block mb-1">DELIVERED</label>
                <textarea
                  value={g.delivered}
                  onChange={(e) => updatePromise(g.id, "delivered", e.target.value)}
                  rows={2}
                  className="w-full bg-bg-primary border border-border-default rounded px-3 py-1.5 text-[10px] text-text-primary focus:border-accent-blue focus:outline-none resize-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
