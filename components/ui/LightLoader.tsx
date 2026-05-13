export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        {/* Animated triple-ring spinner in 3 purple shades */}
        <div className="relative" style={{ width: 48, height: 48 }}>
          {/* Outer ring — light purple */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: "3px solid transparent",
              borderTopColor: "#a78bfa",
              animation: "ha-spin 1.2s linear infinite",
            }}
          />
          {/* Middle ring — primary purple */}
          <div
            className="absolute rounded-full"
            style={{
              inset: 6,
              border: "3px solid transparent",
              borderTopColor: "#7c3aed",
              animation: "ha-spin 0.9s linear infinite reverse",
            }}
          />
          {/* Inner ring — deep purple */}
          <div
            className="absolute rounded-full"
            style={{
              inset: 12,
              border: "3px solid transparent",
              borderTopColor: "#5b21b6",
              animation: "ha-spin 0.6s linear infinite",
            }}
          />
        </div>
        <style>{`
          @keyframes ha-spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}