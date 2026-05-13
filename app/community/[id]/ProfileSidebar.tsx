"use client";

interface ProfileSidebarProps {
  hoaName: string;
  hasScore?: boolean;
}

export function ProfileSidebar({ hoaName, hasScore = false }: ProfileSidebarProps) {
  return (
    <div className="sticky top-20 flex flex-col gap-4">
      {/* Verify address CTA */}
      <div
        className="rounded-2xl p-5 flex flex-col gap-3 text-white"
        style={{
          background: "linear-gradient(135deg, var(--color-ha-deep), var(--color-ha-primary))",
        }}
      >
        <span
          className="self-start text-[11px] font-semibold px-2.5 py-1 rounded-full"
          style={{ background: "rgba(255,255,255,0.2)" }}
        >
          Live in this community?
        </span>
        <div
          className="text-lg font-semibold"
          style={{ fontFamily: "var(--font-outfit)", letterSpacing: "-0.01em" }}
        >
          Verify your address
        </div>
        <p className="text-[13px] opacity-85 leading-relaxed">
          Get private board access, leave a verified review, and shape the score.
        </p>
        <button
          className="mt-1 text-[13px] font-semibold py-2.5 rounded-[10px] cursor-pointer w-full"
          style={{ background: "white", color: "var(--color-ha-deep)", border: "none" }}
        >
          Verify address
        </button>
      </div>

      {/* Intelligence Report CTA */}
      <div
        className="ha-card rounded-2xl p-5 flex flex-col gap-3"
      >
        <span
          className="self-start text-[14px] font-semibold"
          style={{ color: "var(--color-ha-text)" }}
        >
          Buying here?
        </span>
        <div
          className="text-lg font-semibold"
          style={{
            fontFamily: "var(--font-outfit)",
            color: "var(--color-ha-text)",
            letterSpacing: "-0.01em",
          }}
        >
          Full HOA Intelligence Report
        </div>
        <p className="text-[13px] leading-relaxed" style={{ color: "var(--color-ha-text-soft)" }}>
          Get the full picture — budgets, audit history, and risk flags.
        </p>
        <div className="relative mt-1 group/report">
          <button
            disabled={!hasScore}
            className="text-[13px] font-semibold py-2.5 rounded-[10px] w-full transition-colors duration-150"
            style={{
              background: hasScore ? "var(--color-ha-text)" : "var(--color-ha-border)",
              color: hasScore ? "white" : "var(--color-ha-gray)",
              border: "none",
              cursor: hasScore ? "pointer" : "default",
              opacity: hasScore ? 1 : 0.7,
            }}
            onMouseEnter={(e) => {
              if (!hasScore) {
                e.currentTarget.style.background = "var(--color-ha-border-strong)";
                e.currentTarget.style.color = "var(--color-ha-text-soft)";
              }
            }}
            onMouseLeave={(e) => {
              if (!hasScore) {
                e.currentTarget.style.background = "var(--color-ha-border)";
                e.currentTarget.style.color = "var(--color-ha-gray)";
              }
            }}
          >
            {hasScore ? "Get the report" : "Report unavailable"}
          </button>
          {!hasScore && (
            <div
              className="invisible group-hover/report:visible opacity-0 group-hover/report:opacity-100 transition-opacity duration-150 absolute top-full left-0 right-0 mt-2 p-3 rounded-xl text-center z-10"
              style={{
                background: "var(--color-ha-text)",
                color: "white",
              }}
            >
              <div
                className="absolute left-1/2 -translate-x-1/2 -top-1.5 w-3 h-3 rotate-45"
                style={{ background: "var(--color-ha-text)" }}
              />
              <p className="text-[12px] leading-relaxed">
                This profile needs more data before we can generate a report. Verify your address to help complete it.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Agent CTA */}
      <div
        className="ha-card rounded-2xl p-5 flex flex-col gap-3"
      >
        <span
          className="self-start text-[11px] font-semibold px-2.5 py-1 rounded-full"
          style={{ background: "var(--color-ha-surface)", color: "var(--color-ha-gray)" }}
        >
          Real estate agent?
        </span>
        <div
          className="text-lg font-semibold"
          style={{
            fontFamily: "var(--font-outfit)",
            color: "var(--color-ha-text)",
            letterSpacing: "-0.01em",
          }}
        >
          Unlimited HOA lookups
        </div>
        <p className="text-[13px] leading-relaxed" style={{ color: "var(--color-ha-text-soft)" }}>
          Help your clients make informed HOA decisions across your market.
        </p>
        <button
          className="mt-1 text-[13px] font-semibold py-2.5 rounded-[10px] cursor-pointer w-full"
          style={{
            background: "var(--color-ha-surface)",
            color: "var(--color-ha-primary)",
            border: "1px solid var(--color-ha-border-strong)",
          }}
        >
          Sign up
        </button>
      </div>
    </div>
  );
}