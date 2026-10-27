"use client";
import { useMemo, useState } from "react";
import { useCountry } from "@/components/live/LiveProvider";
import { askAssistant } from "@/components/live/Assistant";
import { BullionIcon, bullionKind } from "@/components/ui/Bullion";
import { barGrams, fmt, gold, money } from "@/lib/market";

type Filter = "all" | "bar" | "coin";
type Sort = "weight" | "value";

export function VaultGrid({ slug }: { slug: string }) {
  const c = useCountry(slug);
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("weight");

  const items = useMemo(() => c.bars.map(([name, k, price], i) => {
    const g = barGrams(name);
    const raw = g * gold(c, k);
    return { i, name, k, price, g, perGram: price / g, premium: (price / raw - 1) * 100, kind: bullionKind(name, k, g) };
  }), [c]);

  const bars = items.filter((x) => x.kind !== "coin");
  const coins = items.filter((x) => x.kind === "coin");
  const best = bars.length ? bars.reduce((a, b) => (b.premium < a.premium ? b : a)) : null;

  const shown = (filter === "all" ? items : filter === "bar" ? bars : coins)
    .slice()
    .sort((a, b) => (sort === "value" ? a.premium - b.premium : a.g - b.g || a.i - b.i));

  return (
    <>
      <div className="vault-tools rv">
        <div className="chips">
          <button className={`chip${filter === "all" ? " on" : ""}`} onClick={() => setFilter("all")}>الكل <small>{items.length}</small></button>
          <button className={`chip${filter === "bar" ? " on" : ""}`} onClick={() => setFilter("bar")}>سبائك <small>{bars.length}</small></button>
          {coins.length > 0 && <button className={`chip${filter === "coin" ? " on" : ""}`} onClick={() => setFilter("coin")}>عملات ذهبية <small>{coins.length}</small></button>}
        </div>
        <div className="chips">
          <button className={`chip${sort === "weight" ? " on" : ""}`} onClick={() => setSort("weight")}>حسب الوزن</button>
          <button className={`chip${sort === "value" ? " on" : ""}`} onClick={() => setSort("value")}>الأوفر للجرام</button>
        </div>
      </div>

      <div className="vault-grid">
        {shown.map((x) => (
          <article key={x.name} className={`vcard ${x.kind}${best?.name === x.name ? " best" : ""}`}>
            <div className="vtray">
              {best?.name === x.name && <span className="vbadge best">★ الأوفر</span>}
              <span className="vbadge k">{x.k === 21.6 ? "21.6" : x.k}K</span>
              <div className="vicon"><BullionIcon name={x.name} grams={x.g} karat={x.k} /></div>
            </div>
            <div className="vmeta">
              <h3>{x.name.replace(/\s*\([^)]*\)/, "")}</h3>
              <small>{fmt(x.g, x.g % 1 ? 2 : 0)} جرام · عيار {x.k} · {x.kind === "coin" ? "عملة" : x.kind === "cast" ? "سبيكة مصبوبة" : "سبيكة مسكوكة"}</small>
              <div className="vprice"><span className="n">{money(c, x.price, x.price >= 1000 ? 0 : 2)}</span> <em>{c.curShort}</em></div>
              <div className="vfoot">
                <span>للجرام <b className="n">{money(c, x.perGram)}</b></span>
                <span className={`prem${x.premium <= (best?.premium ?? 0) + 0.5 ? " low" : ""}`}>علاوة <b className="n">{Math.abs(x.premium) < 0.05 ? "0.0" : `${x.premium > 0 ? "+" : ""}${fmt(x.premium, 1)}`}%</b></span>
              </div>
              <button className="vask" onClick={() => askAssistant(`قيمة ${fmt(x.g, x.g % 1 ? 2 : 0)} جرام عيار ${x.k} في ${c.name}`)}>قارنها بسعر الخام ←</button>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
