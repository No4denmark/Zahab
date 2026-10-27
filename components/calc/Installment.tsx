"use client";
import { useState } from "react";
import { useCountry } from "@/components/live/LiveProvider";
import { money, PLANS, type Provider } from "@/lib/market";
import { Field, ResultLine, Seg } from "./Fields";

export function InstallmentCalc({ slug }: { slug: string }) {
  const c = useCountry(slug);
  const [p, setP] = useState<Provider>("tamara");
  const [kind, setKind] = useState<"product" | "bar">("product");
  const [price, setPrice] = useState("5000");
  const [bar, setBar] = useState(-1);
  const [n, setN] = useState(4);
  const amount = kind === "bar" ? (bar >= 0 ? c.bars[bar][2] : 0) : parseFloat(price) || 0;
  const fee = PLANS[p].find(([x]) => x === n)?.[1] ?? 0;
  const total = amount * (1 + fee);
  const per = total / n;
  const pick = (v: Provider) => { setP(v); if (!PLANS[v].some(([x]) => x === n)) setN(PLANS[v][0][0]); };
  const start = new Date(Date.UTC(2026, 9, 25));

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>تفاصيل التقسيط</h3>
        <div className="fields">
          <Field label="مزود الخدمة"><Seg value={p} options={[["tamara", "تمارا"], ["tabby", "تابي"]]} onChange={pick} /></Field>
          <Field label="نوع المنتج"><Seg value={kind} options={[["product", "منتج"], ["bar", "سبيكة ذهب"]]} onChange={setKind} /></Field>
          {kind === "bar" ? (
            <Field label="اختر السبيكة" err={bar < 0 ? "يرجى اختيار السبيكة أولاً" : undefined}>
              <select value={bar} onChange={(e) => setBar(+e.target.value)}>
                <option value={-1}>-- اختر السبيكة --</option>
                {c.bars.map(([nm, , pr], i) => <option key={nm} value={i}>{nm} — {money(c, pr, 0)} {c.curName}</option>)}
              </select>
            </Field>
          ) : (
            <Field label={`سعر المنتج (${c.curName})`} err={price !== "" && !(amount > 0) ? "يرجى إدخال سعر المنتج أولاً" : undefined}>
              <input type="number" inputMode="decimal" min={0} value={price} onChange={(e) => setPrice(e.target.value)} />
            </Field>
          )}
          <Field label="عدد الأقساط">
            <div className="chips">
              {PLANS[p].map(([x, f]) => (
                <button key={x} className={`chip${x === n ? " on" : ""}`} onClick={() => setN(x)}>{x} <small style={{ opacity: .75 }}>{f ? `رسوم ${+(f * 100).toFixed(2)}%` : "بدون رسوم"}</small></button>
              ))}
            </div>
          </Field>
          <p className="note" style={{ marginTop: 0 }}><span><b>تنبيه هام:</b> هذه الحاسبة للاسترشاد فقط. الرسوم الفعلية قد تختلف حسب المتجر وسياسات المزود.</span></p>
        </div>
      </div>
      <div className="result" aria-live="polite">
        {amount > 0 ? (
          <>
            <small className="lab">القسط الشهري · {p === "tamara" ? "تمارا" : "تابي"}</small>
            <div className="big"><span className="n">{money(c, per)}</span><em>{c.curName}/شهر</em></div>
            <ResultLine label="المبلغ الأصلي" value={money(c, amount)} />
            <ResultLine label={`الرسوم (${+(fee * 100).toFixed(2)}%)`} value={fee ? money(c, total - amount) : "بدون رسوم ✓"} />
            <ResultLine label={`الإجمالي (${n} أقساط)`} value={money(c, total)} />
            <div style={{ marginTop: 14, fontWeight: 700 }}>تفصيل الأقساط</div>
            {Array.from({ length: Math.min(n, 12) }, (_, i) => {
              const d = new Date(start.getTime()); d.setUTCMonth(d.getUTCMonth() + i);
              return <ResultLine key={i} label={`القسط ${i + 1} · ${d.getUTCDate()}/${d.getUTCMonth() + 1}/${d.getUTCFullYear()}`} value={money(c, per)} />;
            })}
            {n > 12 && <p className="foot">… و{n - 12} أقساط أخرى بنفس القيمة</p>}
          </>
        ) : <p className="empty">أدخل سعر المنتج لعرض القسط</p>}
      </div>
    </div>
  );
}
