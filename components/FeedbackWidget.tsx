"use client";

import { useState } from "react";

type FeedbackType = "feedback" | "feature" | "bug";

const TYPE_CONFIG: Record<FeedbackType, { label: string; color: string }> = {
  feedback: { label: "FEEDBACK", color: "#00d4ff" },
  feature: { label: "FEATURE", color: "#facc15" },
  bug: { label: "BUG", color: "#ff3333" },
};

export default function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<FeedbackType>("feedback");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async () => {
    if (!name.trim() || !message.trim()) return;
    setStatus("loading");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim() || undefined, type, message: message.trim() }),
      });

      if (res.ok) {
        setStatus("success");
        setName("");
        setEmail("");
        setMessage("");
        setTimeout(() => {
          setStatus("idle");
          setOpen(false);
        }, 2000);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Panel */}
      {open && (
        <div className="mb-3 w-80 bg-bg-card border border-border-default rounded-lg shadow-2xl shadow-black/50 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-border-default flex items-center justify-between">
            <span className="text-[11px] tracking-[0.15em] font-semibold text-text-primary">
              SEND <span className="neon-text-blue">FEEDBACK</span>
            </span>
            <button
              onClick={() => setOpen(false)}
              className="text-text-muted hover:text-text-primary text-xs transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="p-4 space-y-3">
            {/* Type selector */}
            <div className="flex gap-2">
              {(Object.keys(TYPE_CONFIG) as FeedbackType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className="flex-1 text-[9px] tracking-wider font-bold py-1.5 rounded border transition-colors"
                  style={{
                    color: type === t ? TYPE_CONFIG[t].color : "#666",
                    borderColor: type === t ? TYPE_CONFIG[t].color + "60" : "#333",
                    backgroundColor: type === t ? TYPE_CONFIG[t].color + "15" : "transparent",
                  }}
                >
                  {TYPE_CONFIG[t].label}
                </button>
              ))}
            </div>

            {/* Name */}
            <input
              type="text"
              placeholder="Your name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
              className="w-full bg-bg-primary border border-border-default rounded px-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:border-accent-blue focus:outline-none"
            />

            {/* Email */}
            <input
              type="email"
              placeholder="Email (optional)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={200}
              className="w-full bg-bg-primary border border-border-default rounded px-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:border-accent-blue focus:outline-none"
            />

            {/* Message */}
            <textarea
              placeholder="Your message *"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={2000}
              rows={4}
              className="w-full bg-bg-primary border border-border-default rounded px-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:border-accent-blue focus:outline-none resize-none"
            />

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!name.trim() || !message.trim() || status === "loading"}
              className="w-full text-[10px] tracking-wider font-bold py-2 rounded border transition-colors disabled:opacity-40"
              style={{
                color: "#00d4ff",
                borderColor: "#00d4ff40",
                backgroundColor: "#00d4ff15",
              }}
            >
              {status === "loading" ? "SENDING..." : status === "success" ? "SENT!" : status === "error" ? "FAILED — TRY AGAIN" : "SUBMIT"}
            </button>
          </div>
        </div>
      )}

      {/* Floating button — only visible when panel is closed */}
      {!open && (
        <button
          onClick={() => { setOpen(true); setStatus("idle"); }}
          className="w-12 h-12 rounded-full border border-accent-blue/40 bg-bg-card shadow-lg shadow-accent-blue/20 flex items-center justify-center hover:bg-accent-blue/10 transition-colors"
          title="Send feedback"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      )}
    </div>
  );
}
