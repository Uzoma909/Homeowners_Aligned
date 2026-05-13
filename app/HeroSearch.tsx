"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ScoreBadge } from "@/components/ui";
import { Search, ArrowRight } from "lucide-react";
import type { HOA } from "@/types";

interface HeroSearchProps {
  trySuggestions?: { label: string; id: string }[];
  /** "dark" variant for use inside purple CTA sections */
  variant?: "default" | "dark";
}

export function HeroSearch({
  trySuggestions = [],
  variant = "default",
}: HeroSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<HOA[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([]);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      const { data } = await supabase
        .from("hoas")
        .select("id, legal_name, display_name, city, county, zip, association_type, health_score, data_completeness_percent")
        .or(
          `legal_name.ilike.%${query}%,display_name.ilike.%${query}%,city.ilike.%${query}%,zip.ilike.%${query}%,subdivision_name.ilike.%${query}%`
        )
        .order("data_completeness_percent", { ascending: false })
        .limit(5);

      setResults((data as HOA[]) || []);
      setLoading(false);
    }, 250);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  function navigateToHOA(id: string) {
    router.push(`/community/${id}`);
  }

  const isDark = variant === "dark";

  return (
    <div className="max-w-[640px] mx-auto mt-8 md:mt-9 relative">
      <div
        className="flex items-center gap-2"
        style={{
          background: "white",
          border: isDark ? "none" : "1px solid var(--color-ha-border-strong)",
          borderRadius: 14,
          padding: "6px 6px 6px 12px",
          boxShadow: isDark ? "none" : "var(--shadow-search)",
        }}
      >
        <Search
          size={18}
          className="hidden md:block"
          style={{ color: "var(--color-ha-gray)", flexShrink: 0 }}
        />
        <Search
          size={16}
          className="md:hidden"
          style={{ color: "var(--color-ha-gray)", flexShrink: 0 }}
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (query.trim()) {
                router.push(`/search?q=${encodeURIComponent(query.trim())}`);
                setResults([]);
              }
            }
          }}
          placeholder="Search by address, community name, or zip code"
          className="flex-1 min-w-0 border-0 outline-0 focus:ring-0 focus:outline-none text-[14px] md:text-[15px] bg-transparent py-2.5 md:py-3 px-1"
          style={{
            fontFamily: "var(--font-outfit)",
            color: "var(--color-ha-text)",
          }}
        />
        <button
          onClick={() => query.trim() && router.push(`/search?q=${encodeURIComponent(query.trim())}`)}
          className="px-5 py-2.5 md:py-3 text-sm font-semibold rounded-[10px] cursor-pointer transition-colors flex items-center gap-1.5 shrink-0"
          style={{
            background: isDark
              ? "var(--color-ha-text)"
              : "var(--color-ha-primary)",
            color: "white",
            border: 0,
            fontFamily: "var(--font-outfit)",
          }}
        >
          Search
        </button>
      </div>

      {/* Autocomplete dropdown */}
      {results.length > 0 && (
        <div
          className="absolute top-[calc(100%+6px)] left-0 right-0 z-10 text-left"
          style={{
            background: "white",
            border: "1px solid var(--color-ha-border)",
            borderRadius: 14,
            boxShadow: "0 16px 40px rgba(15,23,42,0.10)",
            padding: 6,
          }}
        >
          {results.map((hoa) => (
            <button
              key={hoa.id}
              onClick={() => navigateToHOA(hoa.id)}
              className="w-full flex items-center gap-3 py-2.5 px-3 rounded-[10px] cursor-pointer text-left transition-colors hover:bg-[var(--color-ha-surface)]"
              style={{
                border: 0,
                background: "transparent",
                fontFamily: "var(--font-outfit)",
              }}
            >
              <svg width={14} height={14} viewBox="0 0 24 24" overflow="visible" fill="none" stroke="var(--color-ha-primary)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <path d="M12 13.43C10.27 13.43 8.88 12.04 8.88 10.31C8.88 8.58 10.28 7.19 12 7.19" />
                <path d="M5.98 4.3C10.35 0.19 18.82 1.6 20.38 8.51C21.53 13.59 18.37 17.89 15.6 20.55C13.59 22.49 10.41 22.49 8.39 20.55" />
              </svg>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold truncate" style={{ color: "var(--color-ha-text)" }}>
                  {hoa.display_name || hoa.legal_name}
                </div>
                <div className="text-[11px] truncate" style={{ color: "var(--color-ha-gray)" }}>
                  {hoa.city}, {hoa.state || "TX"} · {hoa.county}
                  {hoa.association_type && ` · ${hoa.association_type}`}
                </div>
              </div>
              <ArrowRight size={12} style={{ color: "var(--color-ha-gray)" }} />
            </button>
          ))}
          <button
            onClick={() => router.push(`/search?q=${encodeURIComponent(query.trim())}`)}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 mt-1 rounded-[10px] cursor-pointer transition-colors hover:bg-[var(--color-ha-surface)]"
            style={{
              border: 0,
              background: "transparent",
              fontFamily: "var(--font-outfit)",
              borderTop: "1px solid var(--color-ha-border)",
            }}
          >
            <span className="text-[12px] font-semibold" style={{ color: "var(--color-ha-primary)" }}>
              See all results for &ldquo;{query}&rdquo;
            </span>
            <ArrowRight size={12} style={{ color: "var(--color-ha-primary)" }} />
          </button>
        </div>
      )}

      {/* "Try" chips — only on default variant */}
      {variant === "default" && trySuggestions.length > 0 && (
        <div className="flex justify-center gap-2 mt-5 flex-wrap">
          <span
            className="text-xs self-center"
            style={{ color: "var(--color-ha-gray)" }}
          >
            Try:
          </span>
          {trySuggestions.map(({ label, id }) => (
            <button
              key={id}
              onClick={() => navigateToHOA(id)}
              className="px-3 py-1 rounded-full text-xs cursor-pointer transition-colors"
              style={{
                background: "white",
                border: "1px solid var(--color-ha-border)",
                color: "var(--color-ha-deep)",
                fontFamily: "var(--font-outfit)",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
