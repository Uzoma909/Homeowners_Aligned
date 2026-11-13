import { ImageResponse } from "next/og";

export const alt =
  "Homeowners Aligned: a data engineering portfolio project built on public Texas HOA records";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Social preview card, generated at build time from the brand colors. */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignSelf: "flex-start",
            padding: "10px 22px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.18)",
            fontSize: 26,
            fontWeight: 600,
          }}
        >
          Data engineering portfolio project
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 88, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.05 }}>
            Homeowners Aligned
          </div>
          <div style={{ fontSize: 36, marginTop: 24, opacity: 0.9, lineHeight: 1.3, maxWidth: 960 }}>
            Public Texas HOA records, collected, parsed, and scored by an automated pipeline.
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 26, opacity: 0.85 }}>
          Public records → Document parsing → Structured database → Transparency score
        </div>
      </div>
    ),
    size
  );
}
