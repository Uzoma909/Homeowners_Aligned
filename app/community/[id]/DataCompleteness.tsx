"use client";

interface DataCompletenessProps {
  completeness: number;
  hasOfficers: boolean;
  hasFees: boolean;
  hasManagement: boolean;
  hasReviews: boolean;
  hasFinancials: boolean;
}

export function DataCompleteness({
  completeness,
  hasOfficers,
  hasFees,
  hasManagement,
  hasReviews,
  hasFinancials,
}: DataCompletenessProps) {
  const missing: { label: string; cta: string }[] = [];

  if (!hasReviews) missing.push({ label: "Resident reviews", cta: "Leave a review" });
  if (!hasFinancials) missing.push({ label: "Financial data", cta: "Upload budget" });
  if (!hasManagement) missing.push({ label: "Management company", cta: "Add info" });
  if (!hasOfficers) missing.push({ label: "Board members", cta: "Add members" });

  return (
    <div className="ha-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span
          className="text-[13px] font-semibold"
          style={{ color: "var(--color-ha-text)" }}
        >
          Profile completeness
        </span>
        <span
          className="text-[13px] font-bold"
          style={{ fontFamily: "var(--font-space)", color: "var(--color-ha-text)" }}
        >
          {completeness}%
        </span>
      </div>

      {/* Progress bar */}
      <div
        className="h-2 rounded-full overflow-hidden mb-4"
        style={{ background: "#eef0f5" }}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${completeness}%`,
            background:
              completeness >= 70
                ? "var(--color-score-green)"
                : completeness >= 40
                  ? "var(--color-ha-primary)"
                  : "var(--color-ha-light)",
          }}
        />
      </div>

      {/* Missing items */}
      {missing.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-medium" style={{ color: "var(--color-ha-gray)" }}>
            Help complete this profile:
          </span>
          <div className="flex flex-wrap gap-2">
            {missing.slice(0, 3).map(({ label, cta }) => (
              <button
                key={label}
                className="text-[12px] font-semibold px-3 py-1.5 rounded-full cursor-pointer transition-colors"
                style={{
                  background: "var(--color-ha-surface)",
                  color: "var(--color-ha-primary)",
                  border: "1px solid var(--color-ha-border)",
                }}
              >
                + {cta}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}