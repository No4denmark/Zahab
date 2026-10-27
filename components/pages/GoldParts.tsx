"use client";
import { useState } from "react";
import { LiveStamp, MarketBadge, useCountry, useOunce } from "@/components/live/LiveProvider";
import { decimals, fmt, gold, money, pastDays, series, seedOf, silverPrice, TROY } from "@/lib/market";
import { PriceBoard } from "@/components/ui/Live";

/** Hero price card with a karat switcher. Receives the slug (plain data) from the server page. */
export function GoldHeroCard({ slug }: { slug: string }) {
  const c = useCountry(slug);
  const [k, setK] = useState(c.karats.includes(21) ? 21 : 24);
  const ounce = useOunce();
  const d = decimals(c);
  const p = gold(c, k);
  return (
    <div className="pcard">
      <div className="pcard-top"><span>آخر تحديث <LiveStamp tz={c.tz} /> بتوقيت {c.city}</span><span style={{ display: "flex", gap: 6, alignItems: "center" }}><span className="pulse" /> مباشر</span></div>
      <div className="chips dark" style={{ marginTop: 16 }}>
        {c.karats.map((x) => <button key={x} className={`chip${x === k ? " on" : ""}`} onClick={() => setK(x)}>عيار {x}</button>)}
      </div>
      <PriceBoard text={fmt(p, d)} unit={`${c.curShort} / جرام`} />
      <MarketBadge />
      <div className="mini-stats">
        <div><small>عيار 24</small><b className="n">{money(c, c.g24)}</b></div>
        <div><small>الأونصة بالـ{c.curName}</small><b className="n">{money(c, c.g24 * TROY, 0)}</b></div>
        <div><small>الأونصة 🌍</small><b className="n">${fmt(ounce)}</b></div>
        <div><small>فضة 999</small><b className="n">{fmt(silverPrice(c, 0.999), silverPrice(c, 0.999) >= 100 ? 2 : 3)}</b></div>
      </div>
    </div>
  );
}

export function KaratTabs({ slug }: { slug: string }) {
  const c = useCountry(slug);
  const [tab, setTab] = useState<"now" | "week">("now");
  const days = pastDays(7);
  const hist = series(c.g24, 8, 0.008, seedOf(c.code), 0.03).slice(0, 7).reverse();
  return (
    <>
      <div className="chips rv" style={{ marginBottom: 18 }}>
        <button className={`chip${tab === "now" ? " on" : ""}`} onClick={() => setTab("now")}>الأسعار الحالية</button>
        <button className={`chip${tab === "week" ? " on" : ""}`} onClick={() => setTab("week")}>آخر 7 أيام</button>
      </div>
      {tab === "now" ? (
        <div className="grid-4">
          {c.karats.map((k, i) => (
            <div key={k} className={`card kcard${i === 0 ? " on" : ""}`}>
              <div className="k-top"><div className="ring" style={{ ["--p" as string]: (k / 24) * 100 }}><span>{k}</span></div><span className="badge">{((k / 24) * 100).toFixed(1)}%</span></div>
              <div className="k-price"><span className="n">{money(c, gold(c, k))}</span><small>{c.curShort}</small></div>
              <p>سعر جرام عيار {k} · بدون مصنعية وضريبة</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr><th>اليوم</th>{c.karats.map((k) => <th key={k}>عيار {k}</th>)}<th className="hm">التغيير</th></tr></thead>
            <tbody>
              {days.map((d, i) => {
                const v = hist[i], prev = hist[i + 1] ?? v, ch = ((v - prev) / prev) * 100;
                return (
                  <tr key={d.date}>
                    <td className="strong">{d.day} <small style={{ color: "var(--mute)" }}>{d.date}</small></td>
                    {c.karats.map((k) => <td key={k} className="n">{money(c, (v * k) / 24)}</td>)}
                    <td className="hm"><span className={`n ${ch >= 0 ? "up" : "down"}`}>{ch >= 0 ? "▲" : "▼"} {Math.abs(ch).toFixed(2)}%</span></td>
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
