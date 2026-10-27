"use client";
import Link from "next/link";
import { fmt, money, TROY } from "@/lib/market";
import { Flag } from "@/components/ui/Basics";
import { PriceBoard } from "@/components/ui/Live";
import { LiveStamp, MarketBadge, useCountries, useLive, useOunce } from "./LiveProvider";

export function Ticker() {
  const list = useCountries();
  const ounce = useOunce();
  const items = (
    <>
      <Link href="/"><span>XAU/USD</span> ${fmt(ounce)}</Link>
      {list.map((c) => (
        <Link key={c.slug} href={`/${c.slug}`}><Flag code={c.code} /> {c.name} <span>24K</span> {money(c, c.g24)} <span>{c.cur}</span></Link>
      ))}
    </>
  );
  return (
    <div className="ticker" aria-label="أسعار الذهب عيار 24 في جميع الدول">
      <div className="ticker-track">{items}{items}</div>
    </div>
  );
}

export function OunceCard() {
  const live = useLive();
  const ounce = useOunce();
  return (
    <div className="pcard">
      <div className="pcard-top"><span>سعر الأونصة العالمية · XAU/USD</span><span>آخر تحديث <LiveStamp tz="America/New_York" /> بتوقيت نيويورك</span></div>
      <PriceBoard text={fmt(ounce)} unit="$/oz" />
      <MarketBadge />
      <div className="mini-stats">
        <div><small>الجرام 24</small><b className="n">${fmt(ounce / TROY)}</b></div>
        <div><small>الجرام 21</small><b className="n">${fmt((ounce / TROY) * 0.875)}</b></div>
        <div><small>الفضة / أونصة</small><b className="n">{live?.silverOunce ? `$${fmt(live.silverOunce)}` : "—"}</b></div>
        <div><small>الذهب ÷ الفضة</small><b className="n">{live?.silverOunce ? fmt(ounce / live.silverOunce, 1) : "—"}</b></div>
      </div>
    </div>
  );
}

export function FeaturedPrices({ slugs }: { slugs: string[] }) {
  const list = useCountries().filter((c) => slugs.includes(c.slug));
  return (
    <div className="feat">
      {slugs.map((s) => { const c = list.find((x) => x.slug === s)!; return (
        <Link key={s} href={`/${s}`}><small><Flag code={c.code} /> {c.name}</small><b><span className="n">{money(c, c.g24)}</span><em>{c.cur}</em></b></Link>
      ); })}
    </div>
  );
}

/** Inline live number, e.g. inside server-rendered prose. */
export function LiveOunce({ digits = 2 }: { digits?: number }) {
  return <span className="n">{fmt(useOunce(), digits)}</span>;
}
