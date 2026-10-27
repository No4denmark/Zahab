import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ذهب برايس — أسعار الذهب لحظياً",
    short_name: "ذهب برايس",
    description: "أسعار الذهب والفضة لحظياً في 37 دولة مع حاسبات البيع والشراء والزكاة.",
    lang: "ar",
    dir: "rtl",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#fed700",
    theme_color: "#fed700",
    icons: [
      { src: "/app-icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
