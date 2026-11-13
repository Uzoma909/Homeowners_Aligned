"use client";

import Link from "next/link";
import { ScoreBadge } from "@/components/ui";
import { MapPinIcon } from "@/components/icons/hoa-icons";
import { calculateProjectedScore } from "@/lib/scoring";
import { buildScoringInput, embeddedCount } from "@/lib/hoa";
import type { HOA } from "@/types";

interface HOAGridCardProps {
  hoa: HOA;
}

function getProjectedScore(hoa: HOA): number | null {
  const result = calculateProjectedScore(
    buildScoringInput(hoa, {
      officers: embeddedCount(hoa.hoa_officers),
      fees: embeddedCount(hoa.hoa_fees),
    })
  );
  return result.projectedScore;
}

export function HOAGridCard({ hoa }: HOAGridCardProps) {
  const name = hoa.display_name || hoa.legal_name;
  const completeness = hoa.data_completeness_percent ?? 0;

  return (
    <Link
      href={`/community/${hoa.id}`}
      className="ha-card p-4 md:p-[18px] flex flex-col gap-3.5 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:border-[var(--color-ha-border-strong)] no-underline"
    >
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1 min-w-0">
          <div
            className="text-[15px] md:text-base font-semibold truncate"
            style={{
              fontFamily: "var(--font-outfit)",
              color: "var(--color-ha-text)",
              letterSpacing: "-0.01em",
            }}
          >
            {name}
          </div>
          <div
            className="text-xs mt-1 flex items-center gap-1"
            style={{ color: "var(--color-ha-gray)" }}
          >
            <MapPinIcon size={12} />
            {hoa.city}, TX · {hoa.county}
            {hoa.association_type && ` · ${hoa.association_type}`}
          </div>
        </div>
        <ScoreBadge score={getProjectedScore(hoa)} size={48} showLabel={false} />
      </div>

      {/* Completeness bar */}
      <div
        className="pt-3"
        style={{ borderTop: "1px dashed var(--color-ha-border)" }}
      >
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[11px] font-medium" style={{ color: "var(--color-ha-gray)" }}>
            Profile completeness
          </span>
          <span
            className="text-[11px] font-bold"
            style={{
              fontFamily: "var(--font-space)",
              color: "var(--color-ha-text)",
            }}
          >
            {completeness}%
          </span>
        </div>
        <div
          className="h-1.5 rounded-full overflow-hidden"
          style={{ background: "#eef0f5" }}
        >
          <div
            className="h-full rounded-full transition-all"
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
      </div>
    </Link>
  );
}
