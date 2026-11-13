"use client";

export function DashboardPreview() {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: "1px solid var(--color-ha-border)", background: "white" }}
    >
      {/* Top bar */}
      <div
        className="px-5 py-3.5 flex items-center gap-3 flex-wrap"
        style={{ borderBottom: "1px solid var(--color-ha-border)" }}
      >
        <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="var(--color-ha-primary)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: "var(--color-ha-gray)" }}>You live in</div>
          <div className="text-[14px] font-semibold" style={{ fontFamily: "var(--font-outfit)", color: "var(--color-ha-text)" }}>Lakewood Villas HOA</div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span
            className="text-[11px] font-bold px-2.5 py-1 rounded-full"
            style={{ fontFamily: "var(--font-space)", background: "#ecfdf5", color: "#059669" }}
          >
            72
          </span>
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold"
            style={{ background: "linear-gradient(135deg, #a78bfa, #7c3aed)", color: "white" }}
          >
            SK
          </div>
        </div>
      </div>

      {/* Dashboard cards */}
      <div className="p-4 grid grid-cols-2 gap-3" style={{ background: "var(--color-ha-surface)" }}>
        {/* Assessment card */}
        <div className="ha-card p-4">
          <div className="text-[12px] font-semibold" style={{ color: "var(--color-ha-text)" }}>My assessment</div>
          <div className="text-[10px] mt-0.5" style={{ color: "var(--color-ha-gray)" }}>Trending up &middot; 12% above average</div>
          <div className="flex items-baseline gap-1.5 mt-3">
            <span className="text-[28px] font-bold" style={{ fontFamily: "var(--font-space)", color: "var(--color-ha-text)", letterSpacing: "-0.03em" }}>$285</span>
            <span className="text-[11px]" style={{ color: "var(--color-ha-gray)" }}>/mo</span>
          </div>
          <div className="text-[10px] mt-1" style={{ color: "var(--color-ha-gray)" }}>
            Last increase &middot; Jan 2026 &middot; <span style={{ color: "#d97706", fontFamily: "var(--font-space)" }}>+$15</span>
          </div>
          {/* Mini sparkline */}
          <svg viewBox="0 0 120 24" className="mt-2 w-full" style={{ height: 24 }}>
            <defs>
              <linearGradient id="dash-spark-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.02" />
              </linearGradient>
            </defs>
            <polygon
              points="0,24 0,20 15,18 30,16 45,14 60,15 75,12 90,10 105,8 120,6 120,24"
              fill="url(#dash-spark-fill)"
            />
            <polyline
              points="0,20 15,18 30,16 45,14 60,15 75,12 90,10 105,8 120,6"
              fill="none"
              stroke="var(--color-ha-primary)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Reserve fund */}
        <div className="ha-card p-4">
          <div className="text-[12px] font-semibold" style={{ color: "var(--color-ha-text)" }}>Reserve fund health</div>
          <div className="text-[10px] mt-0.5" style={{ color: "var(--color-ha-gray)" }}>Funded ratio vs. standard</div>
          <div className="flex flex-col items-center gap-2 mt-3">
            <div className="relative" style={{ width: 56, height: 56 }}>
              <svg width={56} height={56} viewBox="0 0 56 56" style={{ transform: "rotate(-90deg)" }}>
                <circle cx={28} cy={28} r={22} fill="none" stroke="#fef3c7" strokeWidth={6} />
                <circle cx={28} cy={28} r={22} fill="none" stroke="#d97706" strokeWidth={6}
                  strokeDasharray={`${22 * 2 * Math.PI * 0.42} ${22 * 2 * Math.PI}`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-[14px] font-bold" style={{ fontFamily: "var(--font-space)", color: "#d97706", lineHeight: 1 }}>42%</span>
                <span className="text-[8px]" style={{ color: "var(--color-ha-gray)" }}>funded</span>
              </div>
            </div>
            <p className="text-[10px] leading-relaxed text-center" style={{ color: "var(--color-ha-text-soft)" }}>
              Standard is <strong style={{ color: "var(--color-ha-text)" }}>70%+</strong>. Sits in the <strong style={{ color: "#d97706" }}>30th percentile</strong> of DFW communities.
            </p>
          </div>
        </div>

        {/* Board activity */}
        <div className="ha-card p-4">
          <div className="text-[12px] font-semibold" style={{ color: "var(--color-ha-text)" }}>Board activity</div>
          <div
            className="mt-3 p-2.5 rounded-lg flex items-center gap-2.5"
            style={{ background: "var(--color-ha-surface)" }}
          >
            <svg width={14} height={14} viewBox="0 0 24 24" overflow="visible" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 2V5" stroke="currentColor" strokeWidth="1.75" strokeMiterlimit="10" />
              <path d="M16 2V5" stroke="currentColor" strokeWidth="1.75" strokeMiterlimit="10" />
              <path d="M3.5 9.09H20.5" stroke="#7c3aed" strokeWidth="1.75" strokeMiterlimit="10" />
              <path d="M3 13.01V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17" stroke="var(--color-ha-primary)" strokeWidth="1.75" strokeMiterlimit="10" />
            </svg>
            <div className="flex-1">
              <div className="text-[11px] font-semibold" style={{ color: "var(--color-ha-text)" }}>Next meeting</div>
              <div className="text-[10px]" style={{ color: "var(--color-ha-text-soft)" }}>June 12, 2026 &middot; 7pm</div>
            </div>
          </div>
          <div className="text-[10px] mt-2.5" style={{ color: "var(--color-ha-gray)" }}>
            Last met: <strong style={{ color: "var(--color-ha-text)" }}>May 8, 2026</strong>
          </div>
        </div>

        {/* Community pulse */}
        <div className="ha-card p-4">
          <div className="text-[12px] font-semibold" style={{ color: "var(--color-ha-text)" }}>Community pulse</div>
          <div className="text-[10px] mt-0.5" style={{ color: "var(--color-ha-gray)" }}>This week</div>
          <div className="flex flex-col gap-2 mt-3">
            {[
              ["New reviews", "3", "var(--color-ha-primary)"],
              ["Forum posts", "7", "#2563eb"],
              ["Score change", "+2", "#059669"],
            ].map(([label, value, color]) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-[10px]" style={{ color: "var(--color-ha-text-soft)" }}>{label}</span>
                <span className="text-[13px] font-bold" style={{ fontFamily: "var(--font-space)", color }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Label */}
      <div className="px-5 py-3 text-center" style={{ borderTop: "1px solid var(--color-ha-border)", background: "white" }}>
        <span className="text-[11px] font-semibold" style={{ color: "var(--color-ha-gray)" }}>
          Resident dashboard &middot; Design concept with sample data &middot; Not built
        </span>
      </div>
    </div>
  );
}