"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { BY_SLUG, COUNTRIES, type Country } from "@/lib/countries";
import { mergeLive, type Live } from "@/lib/live-shared";
import { OUNCE } from "@/lib/market";

const POLL_MS = 60_000;
const Ctx = createContext<Live | null>(null);

/** Holds the latest MCP prices and refreshes them every minute while the tab is visible. */
export function LiveProvider({ initial, children }: { initial: Live | null; children: React.ReactNode }) {
  const [live, setLive] = useState(initial);
  useEffect(() => {
    let stop = false;
    const pull = async () => {
      if (document.hidden) return;
      try {
        const r = await fetch("/api/prices", { cache: "no-store" });
        if (r.ok) { const j = (await r.json()) as Live | null; if (!stop && j?.ok) setLive(j); }
      } catch {}
    };
    pull();
    const id = setInterval(pull, POLL_MS);
    const vis = () => !document.hidden && pull();
    document.addEventListener("visibilitychange", vis);
    return () => { stop = true; clearInterval(id); document.removeEventListener("visibilitychange", vis); };
  }, []);
  return <Ctx.Provider value={live}>{children}</Ctx.Provider>;
}

export const useLive = () => useContext(Ctx);
export const useOunce = () => useContext(Ctx)?.ounce ?? OUNCE.usd;

export function useCountry(slug: string): Country {
  const live = useContext(Ctx);
  return useMemo(() => mergeLive(BY_SLUG[slug], live), [slug, live]);
}

export function useCountries(): Country[] {
  const live = useContext(Ctx);
  return useMemo(() => COUNTRIES.map((c) => mergeLive(c, live)), [live]);
}

/** "آخر تحديث" stamp of the data itself, in the country's local time. */
export function LiveStamp({ tz }: { tz: string }) {
  const live = useContext(Ctx);
  const [t, setT] = useState("");
  useEffect(() => {
    const at = live?.at ?? Date.now();
    setT(new Date(at).toLocaleTimeString("ar-EG-u-nu-latn", { hour: "numeric", minute: "2-digit", timeZone: tz }));
  }, [live, tz]);
  return <b className="n" suppressHydrationWarning>{t || "—"}</b>;
}

export function MarketBadge() {
  const live = useContext(Ctx);
  if (!live) return <span className="chg dn">بيانات محفوظة — تعذّر الاتصال بالمصدر</span>;
  if (live.marketOpen === false) return <span className="chg" style={{ background: "rgba(254,215,0,.14)", color: "var(--y)" }}>● السوق العالمي مغلق — آخر سعر إغلاق</span>;
  return <span className="chg">● السوق مفتوح — تحديث تلقائي كل 60 ثانية</span>;
}
