"use client";

import { useState } from "react";
import { TriangleAlertAmberIcon, ChevronRightIcon } from "@/components/icons/hoa-icons";

interface EntityWarningProps {
  entityStatus: string;
}

export function EntityWarning({ entityStatus }: EntityWarningProps) {
  const [open, setOpen] = useState(false);

  const description = entityStatus.includes("FRANCHISE TAX")
    ? "This HOA\u2019s charter was involuntarily terminated for failing to file or pay Texas franchise tax. This is a red flag that may indicate governance or financial management issues. The HOA may still operate day-to-day, but its legal standing with the state is compromised."
    : `This HOA\u2019s entity status is listed as \u201c${entityStatus}\u201d with the Texas Secretary of State. This may affect the HOA\u2019s legal standing and ability to enforce deed restrictions.`;

  return (
    <div className="max-w-[1180px] mx-auto px-4 md:px-6 pb-4">
      <div
        className="rounded-2xl"
        style={{
          background: "transparent",
          border: "1px solid var(--color-ha-border-strong)",
        }}
      >
        {/* Header — always visible, tappable on mobile */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden w-full flex items-center gap-3 p-4 cursor-pointer bg-transparent border-0 text-left"
          style={{ fontFamily: "inherit" }}
        >
          <TriangleAlertAmberIcon size={20} />
          <span
            className="flex-1 text-[14px] font-semibold"
            style={{ color: "var(--color-ha-text)" }}
          >
            {"Entity status: " + entityStatus}
          </span>
          <svg
            width={16}
            height={16}
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-ha-gray)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transition: "transform 200ms ease",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              flexShrink: 0,
            }}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        {/* Mobile expanded content */}
        {open && (
          <div className="md:hidden px-4 pb-4 pl-11 animate-fade-in">
            <p
              className="text-[13px] leading-relaxed"
              style={{ color: "var(--color-ha-text-soft)" }}
            >
              {description}
            </p>
            
            <a href="https://www.sos.state.tx.us"
              target="_blank"
              rel="noopener"
              className="inline-block text-[12px] font-semibold mt-2 hover:underline"
              style={{ color: "var(--color-ha-primary)" }}
            >
              {"Verify on Texas SOS \u2192"}
            </a>
          </div>
        )}

        {/* Desktop — always visible, no toggle */}
        <div className="hidden md:flex items-start gap-3 p-5">
          <div className="shrink-0 mt-0.5">
            <TriangleAlertAmberIcon size={20} />
          </div>
          <div>
            <div
              className="text-[14px] font-semibold"
              style={{ color: "var(--color-ha-text)" }}
            >
              {"Entity status: " + entityStatus}
            </div>
            <p
              className="text-[13px] mt-1 leading-relaxed"
              style={{ color: "var(--color-ha-text-soft)" }}
            >
              {description}
            </p>
            
            <a  href="https://www.sos.state.tx.us"
              target="_blank"
              rel="noopener"
              className="inline-block text-[12px] font-semibold mt-2 hover:underline"
              style={{ color: "var(--color-ha-primary)" }}
            >
              {"Verify on Texas SOS \u2192"}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}