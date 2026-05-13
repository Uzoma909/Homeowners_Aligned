"use client";

import { getScoreColor } from "@/types";

interface DimensionBarProps {
  label: string;
  value: number;
  max?: number;
  sub?: string;
  className?: string;
}

export function DimensionBar({
  label,
  value,
  max = 100,
  sub,
  className,
}: DimensionBarProps) {
  const color = getScoreColor(value);
  const pct = (value / max) * 100;

  return (
    <div className={`flex flex-col gap-1.5 ${className || ""}`}>
      <div className="flex justify-between items-baseline">
        <span
          className="text-[13px] font-medium"
          style={{ color: "var(--color-ha-text)" }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: "var(--font-space)",
            fontSize: 13,
            fontWeight: 700,
            color: "var(--color-ha-text)",
          }}
        >
          {value}
          <span
            style={{
              color: "var(--color-ha-gray)",
              fontWeight: 400,
            }}
          >
            /{max}
          </span>
        </span>
      </div>
      <div
        className="relative overflow-hidden"
        style={{
          height: 8,
          background: "#eef0f5",
          borderRadius: 4,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: color,
            borderRadius: 4,
            transition: "width 700ms ease-out",
            animation: "score-fill 800ms ease-out",
          }}
        />
      </div>
      {sub && (
        <span className="text-[11px]" style={{ color: "var(--color-ha-gray)" }}>
          {sub}
        </span>
      )}
    </div>
  );
}
