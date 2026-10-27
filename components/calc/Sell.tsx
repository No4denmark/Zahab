"use client";
import { useState } from "react";
import { useCountry } from "@/components/live/LiveProvider";
import { barGrams, fmt, gold, money } from "@/lib/market";
import { Field, KaratSelect, ResultLine, Seg, toGrams, WeightInput } from "./Fields";

/** Egypt cashback per gram when selling bars back to the dealer. */
export const cashbackPerGram = (grams: number, wrapped: boolean) => (!wrapped ? 11 : grams > 100 ? 12 : 28);

export function SellCalc({ slug }: { slug: string }) {
  const c = useCountry(slug);
  const d = c.sell!.d;
  const jk = c.karats.filter((k) => k !== 24).concat(c.karats.includes(14) ? [] : [14]);
  const [kind, setKind] = useState<"jewel" | "bar">("jewel");
  const [k, setK] = useState(jk.includes(21) ? 21 : jk[0]);
  const [w, setW] = useState("10");
  const [unit, setUnit] = useState("g");
  const [cond, setCond] = useState<0 | 1 | 2>(0);
  const [bar, setBar] = useState(-1);
  const [wrapped, setWrapped] = useState(true);

  let grams = 0, kk = k, value = 0, disc = 0, cash = 0;
  if (kind === "jewel") {
    grams = toGrams(w, unit);
    value = grams * gold(c, k);
    disc = grams * d[cond];
  } else if (bar >= 0) {
    const [name, bk] = c.bars[bar];
    grams = barGrams(name); kk = bk;
    value = grams * gold(c, bk);
    if (c.cashback) cash = grams * cashbackPerGram(grams, wrapped);
    else disc = grams * d[0] * 0.5;
  }
  const total = value - disc + cash;
  const ready = grams > 0;

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>بيانات الذهب المراد بيعه</h3>
        <div className="fields">
          <Field label="نوع القطعة"><Seg value={kind} options={[["jewel", "مجوهرات"], ["bar", "سبيكة"]]} onChange={setKind} /></Field>
          {kind === "jewel" ? (
            <>
              <Field label="العيار"><KaratSelect value={k} karats={jk} onChange={setK} /></Field>
              <Field label="الوزن" err={w !== "" && !(toGrams(w, unit) > 0) ? "يرجى إدخال وزن صحيح" : undefined}><WeightInput w={w} unit={unit} onW={setW} onUnit={setUnit} quick={[5, 10, 20, 50]} /></Field>
              <Field label="حالة الذهب" hint={`خصم ${d[cond]} ${c.curName}/جرام`}>
                <Seg value={cond} options={[[0, "ممتاز"], [1, "جيد"], [2, "عادي"]]} onChange={setCond} />
              </Field>
            </>
          ) : (
            <>
              <Field label="اختر السبيكة" err={bar < 0 ? "يرجى اختيار السبيكة أولاً" : undefined}>
                <select value={bar} onChange={(e) => setBar(+e.target.value)}>
                  <option value={-1}>-- اختر السبيكة --</option>
                  {c.bars.map(([n, bk], i) => <option key={n} value={i}>{n} • عيار {bk}</option>)}
                </select>
              </Field>
              {c.cashback && <Field label="حالة السبيكة"><Seg value={wrapped ? 1 : 0} options={[[1, "مغلفة (بالغلاف الأصلي)"], [0, "بدون غلاف"]]} onChange={(v) => setWrapped(v === 1)} /></Field>}
            </>
          )}
        </div>
      </div>

      <div className="result" aria-live="polite">
        {ready ? (
          <>
            <small className="lab">المبلغ المتوقع عند البيع</small>
            <div className="big"><span className="n">{money(c, total)}</span><em>{c.curName}</em></div>
            <ResultLine label={`قيمة الذهب (عيار ${kk} × ${fmt(grams, 2)} جم)`} value={money(c, value)} />
            {disc > 0 && <ResultLine label="الخصم" value={`− ${money(c, disc)}`} />}
            {cash > 0 && <ResultLine label="كاش باك" value={`+ ${money(c, cash)}`} />}
            <ResultLine label="سعر الجرام" value={`${money(c, total / grams)} ${c.curShort}`} />
            {cash > 0 && <p className="foot">السعر = قيمة الذهب + كاش باك</p>}
          </>
        ) : <p className="empty">أدخل البيانات لعرض النتيجة فوراً</p>}
        <p className="foot">* أسعار تقديرية وقد تختلف من محل لآخر حسب حالة القطعة.</p>
      </div>
    </div>
  );
}
