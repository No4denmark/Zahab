"use client";
import { useState } from "react";
import { useCountry } from "@/components/live/LiveProvider";
import { ALL_KARATS, fmt, gold, money } from "@/lib/market";
import { Field, KaratSelect, ResultLine, toGrams, WeightInput } from "./Fields";

export function ConverterCalc({ slug }: { slug: string }) {
  const c = useCountry(slug);
  const [w, setW] = useState("10");
  const [unit, setUnit] = useState("g");
  const [from, setFrom] = useState(21);
  const [to, setTo] = useState(24);
  const [show, setShow] = useState(false);
  const g = toGrams(w, unit);
  const eq = (g * from) / to, pure = (g * from) / 24, ratio = from / to;
  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>حوّل بين العيارات</h3>
        <div className="fields">
          <Field label="الوزن" err={w !== "" && !(g > 0) ? "يرجى إدخال وزن صحيح" : undefined}><WeightInput w={w} unit={unit} onW={setW} onUnit={setUnit} quick={[10, 12, 18, 85, 150]} /></Field>
          <div className="row2" style={{ alignItems: "end" }}>
            <Field label="من عيار"><KaratSelect value={from} karats={ALL_KARATS} onChange={setFrom} /></Field>
            <Field label="إلى عيار"><KaratSelect value={to} karats={ALL_KARATS} onChange={setTo} /></Field>
          </div>
          <button className="btn btn-dark" onClick={() => { setFrom(to); setTo(from); }}>⇄ تبديل العيارين</button>
        </div>
      </div>
      <div className="result" aria-live="polite">
        {g > 0 ? (
          <>
            <small className="lab">الوزن المعادل بعيار {to}</small>
            <div className="big"><span className="n">{fmt(eq, 3)}</span><em>جرام</em></div>
            <ResultLine label={`${fmt(g, 2)} جم عيار ${from} =`} value={`${fmt(eq, 3)} جم عيار ${to}`} />
            <ResultLine label="الذهب الخالص" value={`${fmt(pure, 3)} جم`} />
            <ResultLine label="نسبة التحويل" value={fmt(ratio, 4)} />
            <ResultLine label="التحويل العكسي" value={`${fmt(g, 2)} جم عيار ${to} = ${fmt((g * to) / from, 3)} جم عيار ${from}`} />
            <ResultLine label={`القيمة بأسعار ${c.name}`} value={`${money(c, g * gold(c, from))} ${c.curShort}`} />
            <button className="btn btn-ghost btn-sm" style={{ marginTop: 12, color: "#fff" }} onClick={() => setShow((v) => !v)}>{show ? "إخفاء التفاصيل" : "عرض شرح الحسابات"}</button>
            {show && (
              <div style={{ marginTop: 10, fontSize: 14, color: "#c3c9d0", display: "grid", gap: 6 }}>
                <span>نسبة التحويل: {from} ÷ {to} = <b className="n">{fmt(ratio, 4)}</b></span>
                <span>الذهب الخالص: {fmt(g, 2)} × ({from} ÷ 24) = <b className="n">{fmt(pure, 3)}</b> جم</span>
                <span>الوزن المعادل: {fmt(g, 2)} × {fmt(ratio, 4)} = <b className="n">{fmt(eq, 3)}</b> جم</span>
              </div>
            )}
          </>
        ) : <p className="empty">أدخل الوزن للتحويل</p>}
      </div>
    </div>
  );
}
