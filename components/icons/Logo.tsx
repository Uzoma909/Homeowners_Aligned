/**
 * Open Door A — Homeowners Aligned logo
 * Uses SVG files from /public/icons/ for perfect scaling at any size.
 */

import Image from "next/image";

interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 32, className }: LogoProps) {
  return (
    <Image
      src="/icons/mark-purple-transparent.svg"
      alt=""
      width={size}
      height={size}
      className={className || ""}
      aria-hidden="true"
      priority
    />
  );
}

interface WordMarkProps {
  size?: number;
  className?: string;
}

export function WordMark({ size = 22, className }: WordMarkProps) {
  const iconSize = Math.round(size * 1.5);
  const textSize = Math.round(size * 1.3);

  return (
    <div className={`flex items-end gap-2 ${className || ""}`}>
      <Logo size={iconSize} />
      <span
        className="font-semibold leading-none"
        style={{
          fontFamily: "var(--font-outfit)",
          fontSize: textSize,
          color: "var(--color-ha-primary)",
          letterSpacing: "-0.02em",
          transform: "translateY(-1px)",
        }}
      >
        Homeowners Aligned
      </span>
    </div>
  );
}