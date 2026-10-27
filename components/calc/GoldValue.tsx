"use client";
import { useState } from "react";
import { useCountry } from "@/components/live/LiveProvider";
import { fmt, gold, ITEM_TYPES, money, UNITS } from "@/lib/market";
import { Field, KaratSelect, ResultLine, toGrams, WeightInput } from "./Fields";

type Item = { type: string; k: number; g: number; w: string; unit: string };
const KS = [24, 22, 21, 18, 14];

export function GoldValueCalc({ slug }: { slug: string }) {
  const c = useCountry(slug);
  const [type, setType] = useState(ITEM_TYPES[0]);
  const [k, setK] = useState(c.karats.includes(21) ? 21 : 18);
  const [w, setW] = useState("10");
  const [unit, setUnit] = useState("g");
  const [items, setItems] = useState<Item[]>([]);
  const [details, setDetails] = useState(true);

  const g = toGrams(w, unit);
  const draft: Item | null = g > 0 ? { type, k, g, w, unit } : null;
  const all = items.length ? items : draft ? [draft] : [];
  const total = all.reduce((s, x) => s + x.g * gold(c, x.k), 0);
  const pure = all.reduce((s, x) => s + (x.g * x.k) / 24, 0);
  const add = () => { if (draft) { setItems((s) => [...s, draft]); setW(""); } };

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>أدخل بيانات القطعة</h3>
        <div className="fields">
          <div className="row2">
            <Field label="النوع (اختياري)"><select value={type} onChange={(e) => setType(e.target.value)}>{ITEM_TYPES.map((t) => <option key={t}>{t}</option>)}</select></Field>
            <Field label="العيار"><KaratSelect value={k} karats={KS} onChange={setK} /></Field>
          </div>
          <Field label="الوزن" err={w !== "" && !(g > 0) ? "يرجى إدخال وزن صحيح" : undefined}>
            <WeightInput w={w} unit={unit} onW={setW} onUnit={setUnit} quick={[1, 5, 10, 20, 50, 100]} units={["g", "m", "oz", "kg"]} />
          </Field>
          <div className="actions">
            <button className="btn btn-y" onClick={add} disabled={!draft}>+ أضف عنصر آخر</button>
            <button className="btn btn-ghost" style={{ color: "var(--ink)" }} onClick={() => { setItems([]); setW("10"); }}>إعادة</button>
          </div>
          <div>
            <b style={{ fontSize: 14 }}>العناصر المضافة ({items.length})</b>
            <div className="items">
              {items.length === 0 && <p style={{ color: "var(--mute)", fontSize: 14 }}>أدخل الوزن واضغط «أضف» لتجميع عدة قطع — النتيجة تحسب القطعة الحالية فوراً.</p>}
              {items.map((x, i) => (
                <div className="item" key={i}>
                  <div><b>{x.type === ITEM_TYPES[0] ? `قطعة ${i + 1}` : x.type}</b> <small>· عيار {x.k} · <span className="n">{fmt(x.g, 2)}</span> جم</small></div>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}><b className="n">{money(c, x.g * gold(c, x.k))}</b><button onClick={() => setItems((s) => s.filter((_, j) => j !== i))} aria-label="حذف">×</button></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="result" aria-live="polite">
        <small className="lab">القيمة الإجمالية للذهب</small>
        <div className="big"><span className="n">{money(c, total)}</span><em>{c.curName}</em></div>
        <ResultLine label="سعر الجرام 24" value={`${money(c, c.g24)} ${c.curShort}`} />
        <ResultLine label="الوزن الخالص (عيار 24)" value={`${fmt(pure, 3)} جم`} />
        <ResultLine label="العناصر" value={all.length} />
        <button className="btn btn-ghost btn-sm" style={{ marginTop: 12, color: "#fff" }} onClick={() => setDetails((v) => !v)}>{details ? "إخفاء التفاصيل" : "إظهار التفاصيل"}</button>
        {details && all.map((x, i) => (
          <ResultLine key={i} label={`${i + 1}. عيار ${x.k} × ${fmt(x.g, 2)} جم (${UNITS.find((u) => u.id === x.unit)?.label})`} value={money(c, x.g * gold(c, x.k))} />
        ))}
        <p className="foot">* القيمة استرشادية، لا تشمل ضريبة أو مصنعية أو هامش ربح التاجر.</p>
      </div>
    </div>
  );
}
