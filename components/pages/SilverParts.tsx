"use client";
import { useState } from "react";
import { LiveStamp, MarketBadge, useCountry, useLive } from "@/components/live/LiveProvider";
import { fmt, pastDays, series, seedOf, SILVER, silverPrice } from "@/lib/market";
import { PriceBoard } from "@/components/ui/Live";

const dig = (v: number) => (v >= 1000 ? 0 : v >= 10 ? 2 : 4);

export function SilverHeroCard({ slug }: { slug: string }) {
  const c = useCountry(slug);
  const live = useLive();
  const [i, setI] = useState(0);
  const p = silverPrice(c, SILVER[i].purity);
  const d = dig(p);
  return (
    <div className="pcard">
      <div className="pcard-top"><span>آخر تحديث <LiveStamp tz={c.tz} /> بتوقيت {c.city}</span><span style={{ display: "flex", gap: 6, alignItems: "center" }}><span className="pulse" /> مباشر</span></div>
      <div className="chips dark" style={{ marginTop: 16 }}>
        {SILVER.map((s, j) => <button key={s.id} className={`chip${j === i ? " on" : ""}`} onClick={() => setI(j)}>{s.id}</button>)}
      </div>
      <PriceBoard text={fmt(p, d)} unit={`${c.curShort} / جرام`} />
      <MarketBadge />
      <div className="mini-stats">
        <div><small>فضة 999</small><b className="n">{fmt(silverPrice(c, 0.999), d)}</b></div>
        <div><small>فضة 925</small><b className="n">{fmt(silverPrice(c, 0.925), d)}</b></div>
        <div><small>الأونصة 🌍</small><b className="n">{live?.silverOunce ? `$${fmt(live.silverOunce, 2)}` : "—"}</b></div>
        <div><small>النقاء</small><b className="n">{(SILVER[i].purity * 100).toFixed(1)}%</b></div>
      </div>
    </div>
  );
}

export function SilverTabs({ slug }: { slug: string }) {
  const c = useCountry(slug);
  const [tab, setTab] = useState<"now" | "hist">("now");
  const days = pastDays(30);
  const base = silverPrice(c, 0.999);
  const hist = series(base, 31, 0.018, seedOf(c.code) + 99, 0.06).slice(0, 30).reverse();
  return (
    <>
      <div className="chips rv" style={{ marginBottom: 18 }}>
        <button className={`chip${tab === "now" ? " on" : ""}`} onClick={() => setTab("now")}>الأسعار الحالية</button>
        <button className={`chip${tab === "hist" ? " on" : ""}`} onClick={() => setTab("hist")}>آخر 30 يوم</button>
      </div>
      {tab === "now" ? (
        <div className="grid-4">
          {SILVER.map((s, i) => {
            const p = silverPrice(c, s.purity);
            return (
              <div key={s.id} className={`card kcard${i === 0 ? " on" : ""}`}>
                <div className="k-top"><div className="ring" style={{ ["--p" as string]: s.purity * 100 }}><span>{s.id}</span></div><span className="badge">{(s.purity * 100).toFixed(1)}%</span></div>
                <div className="k-price"><span className="n">{fmt(p, dig(p))}</span><small>{c.curShort}</small></div>
                <p>{s.label}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr><th>التاريخ</th>{SILVER.map((s, j) => <th key={s.id} className={j > 1 ? "hm" : ""}>{s.label}</th>)}<th className="hm">التغيير %</th></tr></thead>
            <tbody>
              {days.map((d, i) => {
                const v = hist[i], prev = hist[i + 1] ?? v, ch = ((v - prev) / prev) * 100;
                return (
                  <tr key={d.date}>
                    <td className="strong">{d.day} <small style={{ color: "var(--mute)" }}>{d.date}</small></td>
                    {SILVER.map((s, j) => { const p = (v * s.purity) / 0.999; return <td key={s.id} className={`n${j > 1 ? " hm" : ""}`}>{fmt(p, dig(p))}</td>; })}
                    <td className="hm"><span className={`n ${ch > 0 ? "up" : ch < 0 ? "down" : ""}`}>{ch > 0 ? "▲" : ch < 0 ? "▼" : "━"} {Math.abs(ch).toFixed(2)}%</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
