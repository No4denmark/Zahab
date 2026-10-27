import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import { Header } from "@/components/site/Header";
import { TabBar } from "@/components/site/TabBar";
import { AssistantWidget } from "@/components/live/Assistant";
import { Footer } from "@/components/site/Chrome";
import { Reveal } from "@/components/ui/Live";
import { LiveProvider } from "@/components/live/LiveProvider";
import { Ticker } from "@/components/live/LiveParts";
import { getLive } from "@/lib/live";
import "./globals.css";

// Pages are statically generated and refreshed from the MCP feed at most once a minute (ISR).
export const revalidate = 60;

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.zahabprice.com"),
  title: { default: "أسعار الذهب اليوم في جميع الدول العربية وأوروبا | ذهب برايس", template: "%s | ذهب برايس" },
  description: "أسعار الذهب والفضة لحظياً في 37 دولة بالعملة المحلية — تحديث كل دقيقة، مع حاسبات البيع والشراء والزكاة.",
  applicationName: "ذهب برايس",
  appleWebApp: { capable: true, title: "ذهب برايس", statusBarStyle: "default" },
  formatDetection: { telephone: false },
};
export const viewport: Viewport = { themeColor: "#fed700", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const live = await getLive();
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body>
        <LiveProvider initial={live}>
          <Header />
          <Ticker />
          {children}
          <Footer />
          <TabBar />
          <AssistantWidget />
        </LiveProvider>
        <Reveal />
      </body>
    </html>
  );
}
