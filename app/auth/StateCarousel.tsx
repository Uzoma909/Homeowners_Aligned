"use client";

import { STATE_PATHS } from "@/components/icons/state-paths";

const states = Object.entries(STATE_PATHS);
const row1 = states.slice(0, 26);
const row2 = states.slice(26);

const STATE_SIZE = 390;

function StateSVG({ viewBox, path, id, size }: { viewBox: string; path: string; id: string; size?: number }) {
  const patternId = `carousel-dot-${id}`;
  return (
    <svg
      viewBox={viewBox}
      width={size || STATE_SIZE}
      height={size || STATE_SIZE}
      xmlns="http://www.w3.org/2000/svg"
      overflow="visible"
      style={{ overflow: "visible" }}
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
        d={path}
        fill={`url(#${patternId})`}
        stroke="#7c3aed"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function StateCarousel() {
  return (
    <>
    {/* Mobile — single row scrolling left */}
    <div
      className="md:hidden absolute left-0 right-0 overflow-hidden pointer-events-none"
      style={{ opacity: 0.12, top: "2%" }}
      aria-hidden="true"
    >
      <div
        className="flex gap-4 items-center"
        style={{
          animation: "state-scroll-left 300s linear infinite",
          width: "max-content",
        }}
      >
        {[...states, ...states].map(([key, state], i) => (
          <div
            key={`mob-${key}-${i}`}
            className="shrink-0"
            style={{ width: 320, height: 320 }}
          >
            <StateSVG viewBox={state.viewBox} path={state.path} id={`mob-${key}-${i}`} size={320} />
          </div>
        ))}
      </div>
    </div>

    {/* Desktop — full carousel */}
    <div
      className="hidden md:block absolute inset-0 overflow-hidden pointer-events-none"
      style={{ opacity: 0.14 }}
      aria-hidden="true"
    >
      {/* Top half — scrolls left */}
      <div
        className="absolute left-0 right-0"
        style={{ top: "8%", height: "45%" }}
      >
        <div
          className="flex gap-6 items-center h-full"
          style={{
            animation: "state-scroll-left 180s linear infinite",
            width: "max-content",
          }}
        >
          {[...row1, ...row1].map(([key, state], i) => (
            <div
              key={`r1-${key}-${i}`}
              className="shrink-0 flex items-center justify-center"
              style={{ width: STATE_SIZE, height: STATE_SIZE }}
            >
              <StateSVG viewBox={state.viewBox} path={state.path} id={`r1-${key}-${i}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom half — scrolls right */}
      <div
        className="absolute left-0 right-0"
        style={{ bottom: "-6%", height: "45%" }}
      >
        <div
          className="flex gap-6 items-center h-full"
          style={{
            animation: "state-scroll-right 200s linear infinite",
            width: "max-content",
          }}
        >
          {[...row2, ...row2].map(([key, state], i) => (
            <div
              key={`r2-${key}-${i}`}
              className="shrink-0 flex items-center justify-center"
              style={{ width: STATE_SIZE, height: STATE_SIZE }}
            >
              <StateSVG viewBox={state.viewBox} path={state.path} id={`r2-${key}-${i}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
}