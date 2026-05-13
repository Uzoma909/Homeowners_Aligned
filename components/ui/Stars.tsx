interface StarsProps {
  value: number;
  size?: number;
  color?: string;
  className?: string;
}

export function Stars({
  value,
  size = 14,
  color = "#f59e0b",
  className,
}: StarsProps) {
  return (
    <span
      className={`inline-flex items-center gap-0.5 ${className || ""}`}
    >
      {Array.from({ length: 5 }, (_, i) => {
        const fill = Math.max(0, Math.min(1, value - i));
        return (
          <span
            key={i}
            className="relative inline-block"
            style={{ width: size, height: size }}
          >
            {/* Empty star */}
            <svg
              viewBox="0 0 24 24"
              width={size}
              height={size}
              className="absolute inset-0"
            >
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                fill="#e2e8f0"
              />
            </svg>
            {/* Filled star (clipped by fill percentage) */}
            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fill * 100}%` }}
            >
              <svg viewBox="0 0 24 24" width={size} height={size}>
                <path
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                  fill={color}
                />
              </svg>
            </span>
          </span>
        );
      })}
    </span>
  );
}
