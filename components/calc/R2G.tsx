"use client";
import { useState } from "react";
import { useCountry } from "@/components/live/LiveProvider";
import { fmt, gold, money } from "@/lib/market";
import { Field, ResultLine } from "./Fields";

export function R2GCalc({ slug }: { slug: string }) {
  const c = useCountry(slug);
  const [a, setA] = useState("5000");
  const amt = parseFloat(a) || 0;
  const affordable = c.bars.filter(([, , p]) => p <= amt);
  const best = affordable[affordable.length - 1];
  const rest = best ? amt - best[2] : amt;
  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>ميزانيتك</h3>
        <div className="fields">
          <Field label={`المبلغ المتاح (${c.curName})`} err={a !== "" && !(amt > 0) ? "يرجى إدخال مبلغ صحيح" : undefined}>
            <input type="number" inputMode="decimal" min={0} value={a} onChange={(e) => setA(e.target.value)} />
            <div className="quick">{[500, 1000, 2000, 5000, 10000, 20000, 50000].map((q) => <button key={q} onClick={() => setA(String(q))}>{fmt(q, 0)}</button>)}</div>
          </Field>
          <div className="grid-2" style={{ gap: 10 }}>
            {[24, 22, 21, 18].map((k) => (
              <div key={k} className="card" style={{ padding: 16 }}>
                <small style={{ color: "var(--mute)" }}>عيار {k}</small>
                <b style={{ display: "block", fontSize: 24 }}><span className="n">{amt > 0 ? fmt(amt / gold(c, k), 2) : "--"}</span> <small style={{ fontSize: 13, color: "var(--mute)" }}>جرام</small></b>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 13.5, color: "var(--mute)" }}>ملاحظة: الأسعار المعروضة هي أسعار الذهب الخام فقط. السعر في المحلات يشمل المصنعية والضريبة وهامش الربح.</p>
        </div>
      </div>
      <div className="result" aria-live="polite">
        <small className="lab">التوصية الذكية</small>
        {best ? (
          <>
            <div className="big" style={{ fontSize: 34 }}>{best[0]}</div>
            <ResultLine label="بقيمة" value={`${money(c, best[2])} ${c.curShort}`} />
            <ResultLine label="متبقي" value={`${money(c, rest)} ${c.curShort}`} />
            <ResultLine label="المتبقي يشتري عيار 21" value={`${fmt(rest / gold(c, 21), 2)} جرام`} />
            {affordable.length > 1 && <p className="foot">سبائك بديلة مناسبة: {affordable.slice(-4, -1).map((b) => b[0]).join("، ")}</p>}
          </>
        ) : <p className="empty">المبلغ أقل من سعر أصغر سبيكة ({money(c, c.bars[0][2])} {c.curShort}) — يمكنك شراء {amt > 0 ? fmt(amt / gold(c, 21), 2) : 0} جرام عيار 21.</p>}
      </div>
    </div>
  );
}
