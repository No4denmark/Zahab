"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { REGIONS, type Region } from "@/lib/countries";
import { useCountries } from "@/components/live/LiveProvider";
import { gold, money, TROY } from "@/lib/market";
import { Flag } from "@/components/ui/Basics";
import { IconSearch } from "@/components/ui/Icons";

export function CompareTable() {
  const [q, setQ] = useState("");
  const [region, setRegion] = useState<Region | "all">("all");
  const [k, setK] = useState(24);
  const all = useCountries();
  const rows = useMemo(
    () => all.filter((c) => (region === "all" || c.region === region) && (!q || c.name.includes(q) || c.cur.toLowerCase().includes(q.toLowerCase()))),
    [q, region, all]
  );
  return (
    <div className="rv">
      <div className="tbl-tools">
        <label className="search">
          <IconSearch size={18} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث عن دولة أو رمز عملة (مثل EGP)…" aria-label="بحث" />
        </label>
        <div className="chips">
          {[24, 21, 18].map((x) => <button key={x} className={`chip${x === k ? " on" : ""}`} onClick={() => setK(x)}>عيار {x}</button>)}
        </div>
      </div>
      <div className="chips" style={{ marginBottom: 16 }}>
        {REGIONS.map((r) => <button key={r.id} className={`chip${r.id === region ? " on" : ""}`} onClick={() => setRegion(r.id)}>{r.label}</button>)}
      </div>
      <div className="tbl-wrap">
        <table className="tbl">
          <thead><tr><th className="hm">#</th><th>الدولة</th><th className="hm">العملة</th><th>سعر جرام عيار {k}</th><th className="hm">الأونصة بالعملة المحلية</th><th></th></tr></thead>
          <tbody>
            {rows.map((c, i) => (
              <tr key={c.slug}>
                <td className="hm" style={{ color: "var(--mute)" }}>{i + 1}</td>
                <td><Link href={`/${c.slug}`} className="cty"><Flag code={c.code} /> {c.name}</Link></td>
                <td className="hm"><span className="badge">{c.cur}</span></td>
                <td className="gold"><span className="n">{money(c, gold(c, k))}</span> <small style={{ color: "var(--mute)", fontWeight: 500 }}>{c.curShort}</small></td>
                <td className="hm" style={{ color: "var(--ink-4)" }}><span className="n">{money(c, c.g24 * TROY, 0)}</span> {c.curShort}</td>
                <td><Link className="row-link" href={`/${c.slug}`} aria-label={`تفاصيل ${c.name}`}>←</Link></td>
              </tr>
            ))}
            {!rows.length && <tr><td colSpan={6} style={{ textAlign: "center", color: "var(--mute)", padding: 30 }}>لا توجد نتائج مطابقة</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
