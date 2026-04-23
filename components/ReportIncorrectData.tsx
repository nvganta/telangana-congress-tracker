"use client";

/**
 * Small "spotted an error?" call-to-action that opens the global FeedbackWidget
 * pre-filled with the district name as context. Keeps user trust high on a
 * data-heavy accountability site where transfer-prone fields (Collectors,
 * Police chiefs) go stale between refreshes.
 */
export default function ReportIncorrectData({
  districtName,
}: {
  districtName: string;
}) {
  const openFeedback = () => {
    window.dispatchEvent(
      new CustomEvent("openFeedback", {
        detail: {
          type: "bug",
          message: `Incorrect data on /districts/${districtName
            .toLowerCase()
            .replace(/\s+/g, "-")} — [please describe what's wrong]`,
        },
      })
    );
  };

  return (
    <div className="mt-4 flex items-center justify-between gap-3 rounded border border-border-default/60 bg-bg-card/40 px-3 py-2.5">
      <p className="text-[10px] text-text-muted/80 tracking-wide">
        Spotted outdated or incorrect data on this page?
      </p>
      <button
        type="button"
        onClick={openFeedback}
        className="text-[10px] tracking-widest bg-accent-blue/10 hover:bg-accent-blue/20 text-accent-blue border border-accent-blue/30 rounded px-2.5 py-1 transition-colors shrink-0"
      >
        REPORT AN ISSUE →
      </button>
    </div>
  );
}
