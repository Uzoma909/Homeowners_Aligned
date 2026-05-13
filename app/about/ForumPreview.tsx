"use client";

const DUMMY_THREADS = [
  {
    id: 1,
    category: "Financial",
    catColor: "#7c3aed",
    title: "Q3 budget shows $42K deficit in landscaping. Where did the money go?",
    body: "I requested the itemized landscaping expenses under Chapter 209 and the numbers don\u2019t add up. The approved budget allocated $78,000 but actual spend shows $120,000 with no board vote for the overage.",
    author: "Marcus T.",
    badge: "Verified \u00b7 4 years",
    upvotes: 34,
    comments: 12,
    time: "6h ago",
    official: false,
  },
  {
    id: 2,
    category: "Board Response",
    catColor: "#5b21b6",
    title: "RE: Pool hours reduction board clarification",
    body: "Thank you for raising this. The reduced hours are temporary due to the ongoing pump replacement. The contractor confirmed completion by June 15. We\u2019ll restore full hours immediately after inspection passes.",
    author: "Board of Directors",
    badge: "Official",
    upvotes: 28,
    comments: 8,
    time: "2d ago",
    official: true,
  },
  {
    id: 3,
    category: "Maintenance",
    catColor: "#d97706",
    title: "Water damage in Building C is anyone else affected?",
    body: "Unit 312 here. We\u2019ve had water intrusion from the roof for three weeks now. Filed two maintenance requests with no response. Looking to see if other Building C residents are experiencing the same issue.",
    author: "Rachel K.",
    badge: "Verified \u00b7 2 years",
    upvotes: 19,
    comments: 23,
    time: "1d ago",
    official: false,
  },
];

const CATEGORIES = ["All", "Financial", "Board Election", "Maintenance", "Rules", "New Resident"];

export function ForumPreview() {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: "1px solid var(--color-ha-border)", background: "white" }}
    >
      {/* Header */}
      <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--color-ha-border)" }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] flex items-center gap-1.5" style={{ color: "var(--color-ha-gray)" }}>
              <svg width={10} height={10} viewBox="0 0 24 24" overflow="visible" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 13.43C10.27 13.43 8.88 12.04 8.88 10.31C8.88 8.58 10.28 7.19 12 7.19" />
                <path d="M5.98 4.3C10.35 0.19 18.82 1.6 20.38 8.51C21.53 13.59 18.37 17.89 15.6 20.55C13.59 22.49 10.41 22.49 8.39 20.55" />
              </svg>
              Lakewood Villas &middot; Dallas, TX
            </div>
            <h3
              className="text-[18px] font-semibold mt-1"
              style={{ fontFamily: "var(--font-outfit)", color: "var(--color-ha-text)", letterSpacing: "-0.015em" }}
            >
              Community discussion
            </h3>
          </div>
          <span
            className="text-[11px] font-bold px-2.5 py-1 rounded-full"
            style={{ fontFamily: "var(--font-space)", background: "#ecfdf5", color: "#059669" }}
          >
            72
          </span>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 mt-3" style={{ borderBottom: "1px solid var(--color-ha-border)", marginBottom: -1 }}>
          {[
            ["Public board", false, true],
            ["Private board", true, false],
          ].map(([label, locked, active]) => (
            <div
              key={String(label)}
              className="text-[13px] py-2.5 px-3.5 flex items-center gap-1.5"
              style={{
                fontWeight: active ? 600 : 500,
                color: active ? "var(--color-ha-primary)" : "var(--color-ha-text-soft)",
                borderBottom: active ? "2px solid var(--color-ha-primary)" : "2px solid transparent",
                fontFamily: "var(--font-outfit)",
              }}
            >
              {locked && (
                <svg width={10} height={10} viewBox="0 0 24 24" overflow="visible" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
              )}
              {String(label)}
            </div>
          ))}
        </div>
      </div>

      {/* Category pills */}
      <div className="px-5 py-3 flex gap-1.5 flex-wrap" style={{ borderBottom: "1px solid var(--color-ha-border)" }}>
        {CATEGORIES.map((cat, i) => (
          <span
            key={cat}
            className="text-[11px] font-medium px-2.5 py-1 rounded-full"
            style={{
              background: i === 0 ? "var(--color-ha-text)" : "white",
              color: i === 0 ? "white" : "var(--color-ha-text-soft)",
              border: i === 0 ? "1px solid var(--color-ha-text)" : "1px solid var(--color-ha-border)",
            }}
          >
            {cat}
          </span>
        ))}
      </div>

      {/* Threads */}
      <div className="flex flex-col" style={{ background: "var(--color-ha-surface)" }}>
        {DUMMY_THREADS.map((t, i) => (
          <div
            key={t.id}
            className="px-5 py-4 flex gap-3"
            style={{
              background: "white",
              borderBottom: i < DUMMY_THREADS.length - 1 ? "1px solid var(--color-ha-border)" : "none",
              borderLeft: t.official ? "3px solid var(--color-ha-primary)" : "none",
            }}
          >
            {/* Vote column */}
            <div className="flex flex-col items-center gap-0.5 pt-1 shrink-0" style={{ width: 32 }}>
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="var(--color-ha-text-soft)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5l0 14M5 12l7-7 7 7" />
              </svg>
              <span className="text-[12px] font-bold" style={{ fontFamily: "var(--font-space)", color: "var(--color-ha-text)" }}>
                {t.upvotes}
              </span>
            </div>

            {/* Body */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: t.catColor, color: "white" }}
                >
                  {t.category}
                </span>
                {t.official && (
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1"
                    style={{ background: "var(--color-ha-deep)", color: "white" }}
                  >
                    <svg width={9} height={9} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    Official
                  </span>
                )}
                <span className="text-[10px] ml-auto" style={{ color: "var(--color-ha-gray)" }}>{t.time}</span>
              </div>
              <h4
                className="text-[14px] font-semibold leading-snug mb-1"
                style={{ fontFamily: "var(--font-outfit)", color: "var(--color-ha-text)" }}
              >
                {t.title}
              </h4>
              <p
                className="text-[12px] leading-relaxed mb-2"
                style={{
                  color: "var(--color-ha-text-soft)",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {t.body}
              </p>
              <div className="flex items-center gap-2.5 text-[10px]" style={{ color: "var(--color-ha-gray)" }}>
                <span className="flex items-center gap-1.5">
                  <span
                    className="w-4 h-4 rounded-full flex items-center justify-center text-[7px] font-bold shrink-0"
                    style={{
                      background: t.official ? "var(--color-ha-deep)" : "linear-gradient(135deg, #a78bfa, #7c3aed)",
                      color: "white",
                      lineHeight: 1,
                      transform: "translateY(1px)",
                    }}
                  >
                    {t.author.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
                  </span>
                  <strong style={{ color: "var(--color-ha-text)" }}>{t.author}</strong>
                  <span>&middot; {t.badge}</span>
                </span>
                <span className="flex items-center gap-1">
                  <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                  </svg>
                  {t.comments} replies
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Label */}
      <div className="px-5 py-3 text-center" style={{ borderTop: "1px solid var(--color-ha-border)", background: "white" }}>
        <span className="text-[11px] font-semibold" style={{ color: "var(--color-ha-gray)" }}>
          Community Forum &middot; Verified residents only
        </span>
      </div>
    </div>
  );
}