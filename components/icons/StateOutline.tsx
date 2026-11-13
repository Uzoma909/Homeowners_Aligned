/**
 * StateOutline — Renders a US state SVG with purple outline + dot grid pattern.
 * Used on active state pages (natural size header) and inactive state pages (enlarged faded bg).
 *
 * Usage:
 *   <StateOutline code="TX" />                          // default: header accent
 *   <StateOutline code="GA" variant="background" />     // enlarged faded bg for waitlist
 */

import { STATE_PATHS, type StateCode } from "./state-paths";

interface StateOutlineProps {
  /** Two-letter state code (e.g. "TX", "FL", "GA") */
  code: StateCode;
  /** "header" = natural size for active state pages, "background" = enlarged + faded for inactive */
  variant?: "header" | "background";
  /** Override width (px) */
  width?: number;
  className?: string;
}

export function StateOutline({
  code,
  variant = "header",
  width,
  className,
}: StateOutlineProps) {
  const state = STATE_PATHS[code];
  if (!state) return null;

  const isBackground = variant === "background";
  const svgWidth = width || (isBackground ? 680 : 400);
  const patternId = `dot-${code}`;

  return (
    <svg
      width={svgWidth}
      viewBox={state.viewBox}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      overflow="visible"
      style={
        isBackground
          ? { height: "auto", opacity: 0.12, pointerEvents: "none" }
          : { height: "auto" }
      }
      aria-hidden="true"
    >
      <defs>
        <pattern
          id={patternId}
          x="0"
          y="0"
          width="4"
          height="4"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="2" cy="2" r="0.5" fill="#7c3aed" opacity="0.45" />
        </pattern>
      </defs>
      <path
        d={state.path}
        fill={`url(#${patternId})`}
        stroke="#7c3aed"
        strokeWidth={isBackground ? "0.3" : "0.8"}
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Returns the full state name for a code */
export function getStateName(code: string): string {
  return STATE_PATHS[code as StateCode]?.name || code;
}

/** Check if we have path data for a state */
export function hasStateData(code: string): boolean {
  return code in STATE_PATHS;
}