"use client";

// ============================================================
// QLoader — Gooey three-dot merge animation
// Three dots orbit, merge via SVG goo filter, and separate.
// Midnight Command colors.
//
// Original animation: "Goey Loader" by Alexandr Izumenko
// https://codepen.io/Izumenko https://codepen.io/Izumenko/pen/MpWyXK
// Adapted and recolored for Homeowners Aligned.
// Usage:
//   <QLoader />
//   <QLoader size={200} text="Loading..." />
// ============================================================

interface QLoaderProps {
  size?: number;
  text?: string;
  className?: string;
}
 
export default function QLoader({ size = 200, text, className = "" }: QLoaderProps) {
  const dotSize = Math.round(size * 0.35);
  const spread = Math.round(size * 0.3);
  const spreadY = Math.round(size * 0.35);
  const smallSpread = Math.round(spread * 0.2);
  const smallSpreadY = Math.round(spreadY * 0.2);
  const blurRadius = Math.max(6, Math.round(dotSize * 0.15));
 
  const colors = {
  dot1: "#5b21b6",   // deep purple
  dot2: "#7c3aed",   // primary purple  
  dot3: "#a78bfa",   // light purple
};
 
  const css = `
.ql-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
}
.ql-anim {
  width: ${size}px;
  height: ${size}px;
  position: relative;
  filter: url('#ql-goo');
  animation: ql-rotate 2s ease-in-out infinite;
}
.ql-dot {
  width: ${dotSize}px;
  height: ${dotSize}px;
  border-radius: 50%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}
.ql-d1 {
  background-color: ${colors.dot1};
  animation: ql-d1 2s ease infinite, ql-z 6s -2s ease infinite;
}
.ql-d2 {
  background-color: ${colors.dot2};
  animation: ql-d2 2s ease infinite, ql-z 6s -4s ease infinite;
}
.ql-d3 {
  background-color: ${colors.dot3};
  animation: ql-d3 2s ease infinite, ql-z 6s ease infinite;
}
@keyframes ql-d1 {
  20% { transform: scale(1); }
  45% { transform: translate(${smallSpread}px, ${smallSpreadY}px) scale(.7); }
  60% { transform: translate(${spread}px, ${Math.round(spreadY * 0.65)}px) scale(.7); }
  80% { transform: translate(${spread}px, ${Math.round(spreadY * 0.65)}px) scale(.7); }
  100% { transform: translateY(0px) scale(1); }
}
@keyframes ql-d2 {
  20% { transform: scale(1); }
  45% { transform: translate(-${smallSpread}px, ${smallSpreadY}px) scale(.7); }
  60% { transform: translate(-${spread}px, ${Math.round(spreadY * 0.65)}px) scale(.7); }
  80% { transform: translate(-${spread}px, ${Math.round(spreadY * 0.65)}px) scale(.7); }
  100% { transform: translateY(0px) scale(1); }
}
@keyframes ql-d3 {
  20% { transform: scale(1); }
  45% { transform: translateY(-${smallSpreadY}px) scale(.7); }
  60% { transform: translateY(-${spreadY}px) scale(.7); }
  80% { transform: translateY(-${spreadY}px) scale(.7); }
  100% { transform: translateY(0px) scale(1); }
}
@keyframes ql-rotate {
  55% { transform: rotate(0deg); }
  80% { transform: rotate(360deg); }
  100% { transform: rotate(360deg); }
}
@keyframes ql-z {
  0%, 100% { z-index: 3; }
  33.3% { z-index: 2; }
  66.6% { z-index: 1; }
}
`;
 
  return (
    <div className={`ql-wrap ${className}`}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <filter id="ql-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation={blurRadius} result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 21 -7" />
          </filter>
        </defs>
      </svg>
      <div className="ql-anim">
        <div className="ql-dot ql-d1" />
        <div className="ql-dot ql-d2" />
        <div className="ql-dot ql-d3" />
      </div>
      {text && (
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{text}</p>
      )}
    </div>
  );
}
 