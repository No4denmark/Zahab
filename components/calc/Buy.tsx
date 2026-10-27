"use client";
import { useState } from "react";
import { useCountry } from "@/components/live/LiveProvider";
import { barGrams, buyTax, fmt, gold, makingFor, money, TIER_LABELS } from "@/lib/market";
import { Field, KaratSelect, ResultLine, Seg, toGrams, WeightInput } from "./Fields";

type Kind = 0 | 1 | 2 | 3;

export function BuyCalc({ slug }: { slug: string }) {
  const c = useCountry(slug);
  const b = c.buy!;
  const jk = c.karats.filter((k) => k !== 24);
  const [kind, setKind] = useState<Kind>(1);
  const [k, setK] = useState(jk.includes(21) ? 21 : jk[0]);
  const [w, setW] = useState("10");
  const [unit, setUnit] = useState("g");
  const [bar, setBar] = useState(-1);
  const defMaking = (kd: Kind, kr: number) => (kd === 0 ? b.tiers[0][1] ?? 0 : kd === 1 ? makingFor(c, kr) : b.tiers[kd][0]);
  const [m, setM] = useState(String(defMaking(1, k)));

  const pick = (kd: Kind) => { setKind(kd); setM(String(defMaking(kd, k))); };
  let grams = 0, kk = k;
  if (kind === 0) { if (bar >= 0) { grams = barGrams(c.bars[bar][0]); kk = c.bars[bar][1]; } }
  else grams = toGrams(w, unit);
  const making = (parseFloat(m) || 0) * grams;
  const raw = grams * gold(c, kk);
  const tax = kind === 0 ? (b.taxOn === "making" ? (making * b.tax) / 100 : 0) : buyTax(c, kk, grams, parseFloat(m) || 0);
  const total = raw + making + tax;
  const tier = b.tiers[kind];

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>بيانات القطعة الجديدة</h3>
        <div className="fields">
          <Field label="نوع القطعة"><Seg value={kind} options={[[0, "سبيكة"], [1, "بسيطة"], [2, "معقدة"], [3, "خاص"]]} onChange={pick} /></Field>
          {kind === 0 ? (
            <Field label="اختر السبيكة" err={bar < 0 ? "يرجى اختيار السبيكة أولاً" : undefined}>
              <select value={bar} onChange={(e) => setBar(+e.target.value)}>
                <option value={-1}>-- اختر السبيكة --</option>
                {c.bars.map(([n, bk], i) => <option key={n} value={i}>{n} • عيار {bk}</option>)}
              </select>
            </Field>
          ) : (
            <>
              <Field label="العيار"><KaratSelect value={k} karats={jk} onChange={(x) => { setK(x); if (kind === 1) setM(String(makingFor(c, x))); }} /></Field>
              <Field label="الوزن" err={w !== "" && !(grams > 0) ? "يرجى إدخال وزن صحيح" : undefined}><WeightInput w={w} unit={unit} onW={setW} onUnit={setUnit} quick={[5, 10, 20, 50]} /></Field>
            </>
          )}
          <Field label={`المصنعية (${c.curName}/جرام)`} hint={`${TIER_LABELS[kind]}: ${tier[0]}${tier[1] != null ? `–${tier[1]}` : "+"}`}>
            <input type="number" inputMode="decimal" min={0} value={m} onChange={(e) => setM(e.target.value)} />
          </Field>
        </div>
      </div>

      <div className="result" aria-live="polite">
        {grams > 0 ? (
          <>
            <small className="lab">الإجمالي المتوقع</small>
            <div className="big"><span className="n">{money(c, total)}</span><em>{c.curName}</em></div>
            <ResultLine label={`قيمة الذهب (عيار ${kk} × ${fmt(grams, 2)} جم)`} value={money(c, raw)} />
            <ResultLine label="المصنعية" value={money(c, making)} />
            <ResultLine label={b.taxOn === "making" ? `ضريبة ${b.tax}% على المصنعية` : `ضريبة القيمة المضافة ${b.tax}%`} value={tax ? money(c, tax) : kind === 0 ? "معفى" : "0"} />
            <ResultLine label="سعر الجرام الشامل" value={`${money(c, total / grams)} ${c.curShort}`} />
          </>
        ) : <p className="empty">أدخل البيانات لعرض النتيجة فوراً</p>}
        <p className="foot">* {b.taxOn === "making" ? `الخام معفى، والضريبة ${b.tax}% على المصنعية فقط.` : b.tax ? `السبائك عيار 24 معفاة، والضريبة ${b.tax}% على السعر والمصنعية للمجوهرات.` : "لا توجد ضريبة قيمة مضافة على الذهب حالياً."}</p>
      </div>
    </div>
  );
}
