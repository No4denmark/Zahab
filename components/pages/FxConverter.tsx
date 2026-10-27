"use client";
import { useState } from "react";
import { useCountry } from "@/components/live/LiveProvider";
import { fmt, FX_LIST, rateIn } from "@/lib/market";
import { Field } from "@/components/calc/Fields";
import { CurrencyLogo } from "@/components/ui/CurrencyLogo";

export function FxConverter({ slug }: { slug: string }) {
  const c = useCountry(slug);
  const local = c.cur;
  const codes = [local, ...FX_LIST.map(([x]) => x).filter((x) => x !== local)];
  const label = (code: string) => (code === local ? `${local} — ${c.curName}` : `${code} — ${FX_LIST.find(([x]) => x === code)?.[1]}`);
  const inLocal = (code: string) => (code === local ? 1 : rateIn(c, code));
  const [amt, setAmt] = useState("1");
  const [from, setFrom] = useState(local);
  const [to, setTo] = useState(local === "USD" ? "EUR" : "USD");
  const a = parseFloat(amt) || 0;
  const out = (a * inLocal(from)) / inLocal(to);
  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>تحويل العملات</h3>
        <div className="fields">
          <Field label="المبلغ"><input type="number" inputMode="decimal" min={0} value={amt} onChange={(e) => setAmt(e.target.value)} /></Field>
          <div className="row2" style={{ alignItems: "end" }}>
            <Field label="من"><div className="fx-sel"><CurrencyLogo code={from} size={32} /><select value={from} onChange={(e) => setFrom(e.target.value)}>{codes.map((x) => <option key={x} value={x}>{label(x)}</option>)}</select></div></Field>
            <Field label="إلى"><div className="fx-sel"><CurrencyLogo code={to} size={32} /><select value={to} onChange={(e) => setTo(e.target.value)}>{codes.map((x) => <option key={x} value={x}>{label(x)}</option>)}</select></div></Field>
          </div>
          <button className="btn btn-dark" onClick={() => { setFrom(to); setTo(from); }}>⇄ تبديل</button>
        </div>
      </div>
      <div className="result" aria-live="polite">
        <div className="fx-pair"><CurrencyLogo code={from} size={36} /><span>⇄</span><CurrencyLogo code={to} size={36} /></div>
        <small className="lab"><span className="n">{fmt(a, 2)} {from}</span> =</small>
        <div className="big"><span className="n">{fmt(out, out >= 100 ? 2 : 4)}</span><em>{to}</em></div>
        <div className="ln"><span>سعر الوحدة</span><b className="n">1 {from} = {fmt(inLocal(from) / inLocal(to), 4)} {to}</b></div>
        <div className="ln"><span>العكس</span><b className="n">1 {to} = {fmt(inLocal(to) / inLocal(from), 4)} {from}</b></div>
        <p className="foot">أسعار استرشادية تتغير مع تحركات سوق الصرف الدولي.</p>
      </div>
    </div>
  );
}
