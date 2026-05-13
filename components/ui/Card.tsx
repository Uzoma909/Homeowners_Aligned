import { type ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
}

export function Card({ children, className, padding = "md" }: CardProps) {
  const padMap = { sm: "p-4", md: "p-5 md:p-6", lg: "p-6 md:p-8" };

  return (
    <div className={`ha-card ${padMap[padding]} ${className || ""}`}>
      {children}
    </div>
  );
}

/** Verified Profile badge (green) */
export function VerifiedBadge({
  children = "Verified Profile",
}: {
  children?: ReactNode;
}) {
  return (
    <span
      className="inline-flex items-center gap-1"
      style={{
        padding: "4px 9px",
        borderRadius: 999,
        background: "#059669",
        color: "white",
        fontSize: 11,
        fontWeight: 600,
      }}
    >
      <svg
        width={12}
        height={12}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
      {children}
    </span>
  );
}

/** Unclaimed badge (dark gray) */
export function UnclaimedBadge() {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "4px 9px",
        borderRadius: 999,
        background: "#64748b",
        color: "white",
        fontSize: 11,
        fontWeight: 600,
      }}
    >
      Unclaimed
    </span>
  );
}
