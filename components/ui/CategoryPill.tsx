import type { ForumCategory } from "@/types";

const CATEGORY_COLORS: Record<string, string> = {
  Financial: "#7c3aed",
  "Board Election": "#059669",
  Maintenance: "#d97706",
  Rules: "#dc2626",
  "New Resident": "#2563eb",
  "Board Response": "#5b21b6",
  Amenities: "#0891b2",
};

interface CategoryPillProps {
  category: ForumCategory | string;
  className?: string;
}

export function CategoryPill({ category, className }: CategoryPillProps) {
  const bg = CATEGORY_COLORS[category] || "#64748b";

  return (
    <span
      className={`whitespace-nowrap ${className || ""}`}
      style={{
        padding: "4px 10px",
        borderRadius: 999,
        background: bg,
        color: "white",
        fontSize: 11,
        fontWeight: 600,
      }}
    >
      {category}
    </span>
  );
}
