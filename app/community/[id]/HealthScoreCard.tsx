"use client";

import { useState, useEffect } from "react";
import { getScoreColor, getScoreLabel } from "@/types";
import type { ScoringResult } from "@/lib/scoring";

interface HealthScoreCardProps {
  scoring: ScoringResult;
}

export function HealthScoreCard({ scoring }: HealthScoreCardProps) {
  const [expandedPillar, setExpandedPillar] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Trigger animations after mount
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const { projectedScore, pillars, availablePillars, totalPillars, completedCheckpoints, totalCheckpoints } = scoring;
  const animatedScore = mounted ? projectedScore : 0;

  return (
    <div className="ha-card rounded-2xl p-6 md:p-8">
      {/* Projected label */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <span
            className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
            style={{ background: "var(--color-ha-primary)", color: "white" }}
          >
            Public Projected Score
          </span>
          <span className="text-[12px]" style={{ color: "var(--color-ha-gray)" }}>
            Based on {availablePillars} of {totalPillars} pillars
          </span>
        </div>
      </div>

      {/* Main layout: Score left, Bars right */}
      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 md:gap-10 items-center">
        {/* Animated arc badge */}
        <div className="flex justify-center">
          <AnimatedArc score={animatedScore} size={170} />
        </div>

        {/* Dimension bars with collapsible details */}
        <div className="flex flex-col gap-4">
          {pillars.map((pillar) => (
            <div key={pillar.key}>
              <button
                className="w-full text-left cursor-pointer bg-transparent border-0 p-0 font-[inherit]"
                onClick={() =>
                  setExpandedPillar(
                    expandedPillar === pillar.key ? null : pillar.key
                  )
                }
              >
                <AnimatedBar
                  label={pillar.label}
                  percent={mounted ? pillar.percent : 0}
                  score={pillar.score}
                  maxScore={pillar.maxScore}
                  hasData={pillar.hasData}
                  expanded={expandedPillar === pillar.key}
                />
              </button>

              {/* Collapsible checklist */}
              {expandedPillar === pillar.key && (
                <div
                  className="mt-2 ml-1 pl-3 flex flex-col gap-1.5 animate-fade-in"
                  style={{ borderLeft: "2px solid var(--color-ha-border)" }}
                >
                  {pillar.checkpoints.map((cp) => (
                    <div
                      key={cp.label}
                      className="flex items-center gap-2 text-[12px] py-0.5"
                    >
                      {cp.done ? (
                        <svg
                          width={12}
                          height={12}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#059669"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      ) : (
                        <svg
                          width={12}
                          height={12}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="var(--color-ha-border-strong)"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="9" />
                        </svg>
                      )}
                      <span
                        style={{
                          color: cp.done
                            ? "var(--color-ha-text-soft)"
                            : "var(--color-ha-gray)",
                        }}
                      >
                        {cp.label}
                      </span>
                      {cp.source === "user" && !cp.done && (
                        <span
                          className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                          style={{
                            background: "var(--color-ha-surface)",
                            color: "var(--color-ha-primary)",
                          }}
                        >
                          Help complete
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div
        className="mt-5 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
        style={{ borderTop: "1px dashed var(--color-ha-border)" }}
      >
        <span className="text-[12px]" style={{ color: "var(--color-ha-gray)" }}>
          <strong style={{ color: "var(--color-ha-text)", fontFamily: "var(--font-space)" }}>
            {completedCheckpoints}/{totalCheckpoints}
          </strong>
          {" "}data points verified from{" "}
          <strong style={{ color: "var(--color-ha-text)" }}>2</strong> public sources
          {" "}&middot; Click any pillar to see details
        </span>
        <button
          className="text-[12px] font-semibold cursor-pointer bg-transparent border-0 p-0"
          style={{ color: "var(--color-ha-primary)", fontFamily: "inherit" }}
        >
          <a href="/about#scoring" style={{ color: "var(--color-ha-primary)", textDecoration: "none", fontWeight: 600 }}>How is this scored? →</a>
        </button>
      </div>
    </div>
  );
}

/* ─── Animated Arc Badge ─── */

function AnimatedArc({
  score,
  size = 144,
}: {
  score: number | null;
  size?: number;
}) {
  const color = getScoreColor(score);
  const label = getScoreLabel(score);

  const sw = Math.max(6, size / 22);
  const r = size / 2 - sw / 2 - 2;
  const c = 2 * Math.PI * r;
  const pct = (score ?? 0) / 100;
  const dash = c * pct;

  return (
    <div
      className="flex flex-col items-center"
      style={{ gap: size > 90 ? 12 : 6 }}
    >
      <div style={{ position: "relative", width: size, height: size }}>
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
              style={{ transition: "stroke-dasharray 1000ms cubic-bezier(0.34, 1.56, 0.64, 1)" }}
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
              color: score ? "var(--color-ha-text)" : "var(--color-ha-gray)",
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            {score ?? "\u2014"}
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
            Projected Score
          </span>
        )}
      </div>
    </div>
  );
}

/* ─── Animated Bar ─── */

function AnimatedBar({
  label,
  percent,
  score,
  maxScore,
  hasData,
  expanded,
}: {
  label: string;
  percent: number;
  score: number;
  maxScore: number;
  hasData: boolean;
  expanded: boolean;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <div className="flex items-center gap-2">
          <span
            className="text-[13px] font-semibold"
            style={{ color: "var(--color-ha-text)" }}
          >
            {label}
          </span>
          <svg
            width={12}
            height={12}
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-ha-gray)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transition: "transform 200ms ease",
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
        <span
          className="text-[12px] font-bold"
          style={{
            fontFamily: "var(--font-space)",
            color: hasData ? "var(--color-ha-text)" : "var(--color-ha-gray)",
          }}
        >
          {score}/{maxScore}
        </span>
      </div>
      <div
        className="h-2 rounded-full overflow-hidden"
        style={{ background: "var(--color-ha-border)" }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${percent}%`,
            background: !hasData
              ? "var(--color-ha-border-strong)"
              : percent >= 70
                ? "var(--color-score-green)"
                : percent >= 40
                  ? "var(--color-ha-primary)"
                  : "var(--color-score-red)",
            transition: "width 1000ms cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        />
      </div>
    </div>
  );
}