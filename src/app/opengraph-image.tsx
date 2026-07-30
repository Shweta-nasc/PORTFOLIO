import { ImageResponse } from "next/og";
import { personal, siteMeta } from "@/data/config";

/**
 * Dynamically generated Open Graph image (1200×630). Replaces the missing
 * static /images/og-image.png so social/SEO previews always resolve — no asset
 * to ship, and it stays in sync with the central config. Next auto-wires this
 * file into the page metadata (og:image + twitter:image).
 */
export const alt = `${personal.name} — ${personal.jobTitle}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const domain = siteMeta.url.replace(/^https?:\/\//, "");
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #07070d 0%, #0d1117 55%, #0a0f12 100%)",
          color: "#f4f4f5",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 26,
            letterSpacing: 3,
            color: "#4EBA8C",
          }}
        >
          <div style={{ display: "flex", width: 14, height: 14, borderRadius: 999, background: "#F0A857" }} />
          PORTFOLIO
        </div>

        <div style={{ display: "flex", marginTop: 26, fontSize: 96, fontWeight: 800, lineHeight: 1.05 }}>
          {personal.name}
        </div>

        <div style={{ display: "flex", marginTop: 14, fontSize: 44, color: "#a1a1aa" }}>
          {personal.jobTitle}
        </div>

        <div style={{ display: "flex", marginTop: "auto", fontSize: 28, color: "#71717a" }}>
          {domain}
        </div>
      </div>
    ),
    { ...size },
  );
}
