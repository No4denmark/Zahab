import { ImageResponse } from "next/og";
import { LOGO_PATHS } from "@/components/ui/Icons";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", background: "#fed700", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="128" height="128" viewBox="0 0 32 32">
          <path d={LOGO_PATHS.barTop} fill="#232a31" opacity=".6" />
          <path d={LOGO_PATHS.barFront} fill="#232a31" />
          <path d={LOGO_PATHS.line} fill="none" stroke="#232a31" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d={LOGO_PATHS.arrow} fill="none" stroke="#232a31" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    ),
    size
  );
}
