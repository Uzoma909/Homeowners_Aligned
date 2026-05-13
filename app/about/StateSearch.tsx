"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AVAILABLE_STATES, STATE_PATHS } from "@/components/icons/state-paths";

const states = AVAILABLE_STATES.filter((c) => c !== "DC").map((code) => ({
  code,
  name: STATE_PATHS[code].name,
  live: code === "TX",
}));

export function StateSearch() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = search
    ? states.filter((s) =>
        s.name.toLowerCase().startsWith(search.toLowerCase()) ||
        s.code.toLowerCase().startsWith(search.toLowerCase())
      )
    : states;

  const selectedState = states.find((s) => s.code === selected);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(code: string) {
    setSelected(code);
    setOpen(false);
    setSearch("");
  }

  function handleGo() {
    if (selected) {
      router.push(`/about/${selected.toLowerCase()}`);
    }
  }

  return (
    <div className="flex gap-2 max-w-[420px] mx-auto" ref={containerRef}>
      <div className="flex-1 relative">
        {/* Trigger / Input */}
        <button
          onClick={() => {
            setOpen(!open);
            if (!open) {
              setTimeout(() => inputRef.current?.focus(), 50);
            }
          }}
          className="w-full text-left text-[15px] py-3 pl-4 pr-10 border-0 outline-0 cursor-pointer"
          style={{
            fontFamily: "var(--font-outfit)",
            color: selectedState ? "var(--color-ha-primary)" : "var(--color-ha-gray)",
            background: "var(--color-ha-surface)",
            borderRadius: 14,
            border: open ? "1px solid var(--color-ha-border-strong)" : "1px solid var(--color-ha-border)",
            fontWeight: selectedState ? 600 : 400,
          }}
        >
          {selectedState ? (
            <>
              {selectedState.name}
              {selectedState.live && (
                <span style={{ color: "var(--color-ha-primary)", fontWeight: 600 }}>
                  {" \u00b7 Live"}
                </span>
              )}
            </>
          ) : (
            "Select your state..."
          )}
          {/* Chevron */}
          <svg
            width={12}
            height={12}
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-ha-primary)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute"
            style={{
              right: 14,
              top: "50%",
              transform: open ? "translateY(-50%) rotate(180deg)" : "translateY(-50%)",
              transition: "transform 200ms ease",
            }}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        {/* Dropdown */}
        {open && (
          <div
            className="absolute top-[calc(100%+6px)] left-0 right-0 z-50 animate-fade-in"
            style={{
              background: "white",
              border: "1px solid var(--color-ha-border)",
              borderRadius: 14,
              boxShadow: "0 16px 40px rgba(15,23,42,0.10)",
              overflow: "hidden",
            }}
          >
            {/* Search input */}
            <div style={{ padding: "8px 8px 4px" }}>
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Type to filter..."
                className="w-full text-[14px] py-2.5 px-3 border-0 outline-0"
                style={{
                  fontFamily: "var(--font-outfit)",
                  color: "var(--color-ha-text)",
                  background: "var(--color-ha-surface)",
                  borderRadius: 10,
                  border: "1px solid var(--color-ha-border)",
                }}
              />
            </div>

            {/* Options list */}
            <div
              className="scrollbar-hide"
              style={{
                maxHeight: 260,
                overflowY: "auto",
                padding: "4px 8px 8px",
              }}
            >
              {filtered.length === 0 && (
                <div
                  className="text-[13px] py-3 px-3 text-center"
                  style={{ color: "var(--color-ha-gray)" }}
                >
                  No states found
                </div>
              )}
              {filtered.map((s) => (
                <button
                  key={s.code}
                  onClick={() => handleSelect(s.code)}
                  className="w-full text-left text-[14px] py-2.5 px-3 border-0 cursor-pointer transition-colors"
                  style={{
                    fontFamily: "var(--font-outfit)",
                    color: selected === s.code ? "white" : "var(--color-ha-primary)",
                    fontWeight: selected === s.code ? 600 : 500,
                    background: selected === s.code ? "var(--color-ha-primary)" : "transparent",
                    borderRadius: 10,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  onMouseEnter={(e) => {
                    if (selected !== s.code) {
                      e.currentTarget.style.background = "var(--color-ha-surface)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selected !== s.code) {
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  <span>{s.name}</span>
                  {s.live && (
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        background: selected === s.code ? "rgba(255,255,255,0.2)" : "var(--color-ha-surface)",
                        color: selected === s.code ? "white" : "var(--color-ha-primary)",
                      }}
                    >
                      {"\u00b7 Live"}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Go button */}
      <button
        onClick={handleGo}
        className="px-6 py-3 text-[15px] font-semibold rounded-[14px] cursor-pointer border-0 transition-opacity"
        style={{
          background: selected ? "var(--color-ha-primary)" : "var(--color-ha-border)",
          color: selected ? "white" : "var(--color-ha-gray)",
          fontFamily: "var(--font-outfit)",
          opacity: selected ? 1 : 0.7,
        }}
      >
        Go
      </button>
    </div>
  );
}