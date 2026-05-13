"use client";

import { getScoreColor, getScoreTint, getScoreLabel } from "@/types";

interface ScoreBadgeProps {
  score: number | null;
  size?: number;
  showLabel?: boolean;
  strokeWidth?: number;
  className?: string;
}

/**
 * Arc ring Health Score badge.
 * Gray track circle with colored progress arc, score number centered.
 */
export function ScoreBadge({
  score,
  size = 144,
  showLabel = true,
  strokeWidth,
  className,
}: ScoreBadgeProps) {
  const color = getScoreColor(score);
  const label = getScoreLabel(score);

  const sw = strokeWidth || Math.max(6, size / 22);
  const r = size / 2 - sw / 2 - 2;
  const c = 2 * Math.PI * r;
  const pct = (score ?? 0) / 100;
  const dash = c * pct;

  return (
    <div
      className={`flex flex-col items-center ${className || ""}`}
      style={{ gap: size > 90 ? 12 : 6 }}
    >
      <div className="animate-score" style={{ position: "relative", width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ transform: "rotate(-90deg)" }}
        >
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={sw}
          />
          {/* Progress arc */}
          {score != null && (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={color}
              strokeWidth={sw}
              strokeDasharray={`${dash} ${c}`}
              strokeLinecap="round"
              style={{ transition: "stroke-dasharray 800ms ease-out" }}
            />
          )}
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-space)",
              fontWeight: 700,
              fontSize: size * 0.34,
              color: score != null ? "var(--color-ha-text)" : "var(--color-ha-gray)",
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            {score ?? "—"}
          </span>
          {size > 100 && (
            <span
              style={{
                fontSize: 10,
                color: "var(--color-ha-gray)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              of 100
            </span>
          )}
        </div>
      </div>

      {showLabel && (
        <div className="flex flex-col items-center" style={{ gap: 2 }}>
          <span
            style={{
              fontSize: size > 100 ? 12 : 10,
              fontWeight: 600,
              color,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            {label}
          </span>
          {size > 100 && (
            <span style={{ fontSize: 11, color: "var(--color-ha-gray)" }}>
              Health Score
            </span>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Compact inline score pill — for cards, headers, navigation.
 */
interface ScorePillProps {
  score: number;
  delta?: number | null;
  className?: string;
}

export function ScorePill({ score, delta, className }: ScorePillProps) {
  const color = getScoreColor(score);
  const tint = getScoreTint(score);
  const label = getScoreLabel(score);

  return (
    <div
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 10px 4px 6px",
        borderRadius: 999,
        background: tint,
        border: `1px solid ${color}33`,
      }}
    >
      <span
        style={{
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: color,
          color: "white",
          fontFamily: "var(--font-space)",
          fontWeight: 700,
          fontSize: 11,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {score}
      </span>
      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          color,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      {delta != null && delta !== 0 && (
        <span
          style={{
            fontFamily: "var(--font-space)",
            fontSize: 11,
            color,
            opacity: 0.8,
          }}
        >
          {delta > 0 ? "↑" : "↓"}
          {Math.abs(delta)}
        </span>
      )}
    </div>
  );
}