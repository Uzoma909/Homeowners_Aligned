"use client";

interface AssessmentCardProps {
  assessment: number | null;
  trend: number[] | null;
  changePercent: number | null;
  avgComparison: string | null;
}

export function AssessmentCard({
  assessment,
  trend,
  changePercent,
  avgComparison,
}: AssessmentCardProps) {
  const hasTrend = trend && trend.length > 1;
  const trendUp = changePercent != null && changePercent > 0;

  if (assessment == null) {
    return (
      <div className="ha-card p-5 md:p-6">
        <div className="flex items-center justify-between mb-3">
          <span
            className="text-[11px] font-semibold uppercase tracking-wide"
            style={{ color: "var(--color-ha-gray)", letterSpacing: "0.06em" }}
          >
            Monthly assessment
          </span>
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded"
            style={{ background: "var(--color-ha-surface)", color: "var(--color-ha-primary)" }}
          >
            Help complete
          </span>
        </div>
        <div
          className="rounded-xl p-4 text-center"
          style={{ border: "1px dashed var(--color-ha-border-strong)", background: "var(--color-ha-surface)" }}
        >
          <p className="text-[13px]" style={{ color: "var(--color-ha-text-soft)" }}>
            No assessment data yet. Verified residents can contribute this information.
          </p>
          <button
            className="mt-3 text-[12px] font-semibold px-4 py-2 rounded-[10px] cursor-pointer"
            style={{
              background: "var(--color-ha-primary)",
              color: "white",
              border: "none",
              fontFamily: "var(--font-outfit)",
            }}
          >
            Add assessment info
          </button>
        </div>
      </div>
    );
  }

  // Build sparkline points
  let sparklinePath = "";
  if (hasTrend) {
    const max = Math.max(...trend);
    const min = Math.min(...trend);
    const range = max - min || 1;
    const w = 180;
    const h = 48;
    const padding = 4;
    sparklinePath = trend
      .map((v, i) => {
        const x = (i / (trend.length - 1)) * w;
        const y = padding + (1 - (v - min) / range) * (h - padding * 2);
        return `${i === 0 ? "M" : "L"}${x},${y}`;
      })
      .join(" ");
  }

  return (
    <div className="ha-card p-5 md:p-6">
      <span
        className="text-[11px] font-semibold uppercase tracking-wide"
        style={{ color: "var(--color-ha-gray)", letterSpacing: "0.06em" }}
      >
        Monthly assessment
      </span>

      <div className="flex items-end justify-between mt-3 gap-4 flex-wrap">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span
              className="text-[36px] md:text-[42px] font-bold"
              style={{
                fontFamily: "var(--font-space)",
                color: "var(--color-ha-text)",
                letterSpacing: "-0.03em",
                lineHeight: 1,
              }}
            >
              ${assessment}
            </span>
            <span className="text-[13px]" style={{ color: "var(--color-ha-gray)" }}>/mo</span>
          </div>

          {changePercent != null && (
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-[12px]" style={{ color: "var(--color-ha-gray)" }}>2-yr trend</span>
              <span
                className="text-[12px] font-bold flex items-center gap-1"
                style={{
                  fontFamily: "var(--font-space)",
                  color: trendUp ? "#dc2626" : "#059669",
                }}
              >
                {trendUp ? "\u2191" : "\u2193"} {trendUp ? "+" : ""}{changePercent}%
              </span>
            </div>
          )}
        </div>

        {/* Sparkline */}
        {hasTrend && (
          <svg viewBox={`0 0 180 48`} style={{ width: 180, height: 48 }} className="shrink-0">
            <path
              d={sparklinePath}
              fill="none"
              stroke="var(--color-ha-primary)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      {/* Comparison callout */}
      {avgComparison && (
        <div
          className="mt-4 p-3 rounded-xl text-[12px] leading-relaxed"
          style={{ background: "var(--color-ha-surface)", color: "var(--color-ha-text-soft)" }}
        >
          {avgComparison}
        </div>
      )}
    </div>
  );
}