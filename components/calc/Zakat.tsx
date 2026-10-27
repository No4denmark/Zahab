"use client";
import { useEffect, useState } from "react";
import { useCountry } from "@/components/live/LiveProvider";
import { fmt, gold, ITEM_TYPES, money, NISAB } from "@/lib/market";
import { Field, KaratSelect, ResultLine, toGrams, WeightInput } from "./Fields";

type Item = { type: string; k: number; g: number; date: string };
const HAWL_DAYS = 354;
const KS = [24, 22, 21, 18, 14];

export function ZakatCalc({ slug }: { slug: string }) {
  const c = useCountry(slug);
  const [type, setType] = useState("غير محدد");
  const [k, setK] = useState(21);
  const [w, setW] = useState("100");
  const [unit, setUnit] = useState("g");
  const [date, setDate] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [show, setShow] = useState(false);
  const [today, setToday] = useState<number | null>(null);
  useEffect(() => setToday(Date.now()), []);

  const g = toGrams(w, unit);
  const draft: Item | null = g > 0 ? { type, k, g, date } : null;
  const all = items.length ? items : draft ? [draft] : [];
  const pure = all.reduce((s, x) => s + (x.g * x.k) / 24, 0);
  const value = pure * c.g24;
  const reached = pure >= NISAB;
  const dates = all.map((x) => x.date).filter(Boolean).map((d) => new Date(d).getTime());
  const due = dates.length ? Math.max(...dates) + HAWL_DAYS * 864e5 : null;
  const waiting = reached && due != null && today != null && due > today;
  const dueText = due ? new Date(due).toLocaleDateString("ar-EG-u-nu-latn", { year: "numeric", month: "long", day: "numeric" }) : "";

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>أضف ذهبك</h3>
        <div className="fields">
          <div className="row2">
            <Field label="نوع الذهب (اختياري)"><select value={type} onChange={(e) => setType(e.target.value)}>{["غير محدد", ...ITEM_TYPES.slice(1)].map((t) => <option key={t}>{t}</option>)}</select></Field>
            <Field label="العيار"><KaratSelect value={k} karats={KS} onChange={setK} /></Field>
          </div>
          <Field label="الوزن" err={w !== "" && !(g > 0) ? "يرجى إدخال وزن صحيح" : undefined}><WeightInput w={w} unit={unit} onW={setW} onUnit={setUnit} quick={[50, 85, 100, 200]} units={["g", "m", "oz", "kg"]} /></Field>
          <Field label="تاريخ الشراء" hint="اختياري — لحساب موعد الزكاة"><input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></Field>
          <div className="actions">
            <button className="btn btn-y" disabled={!draft} onClick={() => { if (draft) { setItems((s) => [...s, draft]); setW(""); } }}>+ أضف عنصر آخر</button>
            <button className="btn btn-ghost" style={{ color: "var(--ink)" }} onClick={() => { setItems([]); setW("100"); setDate(""); }}>إعادة</button>
          </div>
          <div>
            <b style={{ fontSize: 14 }}>العناصر المضافة ({items.length} عنصر)</b>
            <div className="items">
              {items.map((x, i) => (
                <div className="item" key={i}>
                  <div><b>{x.type}</b> <small>· عيار {x.k} · <span className="n">{fmt(x.g, 2)}</span> جم {x.date && `· ${x.date}`}</small></div>
                  <button onClick={() => setItems((s) => s.filter((_, j) => j !== i))} aria-label="حذف">×</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="result" aria-live="polite">
        <small className="lab">مبلغ الزكاة المستحق</small>
        <div className="big"><span className="n">{money(c, reached ? value * 0.025 : 0)}</span><em>{c.curName}</em></div>
        {!all.length ? <div className="state wait">أدخل البيانات لعرض النتيجة</div>
          : !reached ? <div className="state no">لم يبلغ ذهبك النصاب — لا تجب عليك الزكاة</div>
          : waiting ? <div className="state wait">بلغ النصاب لكن لم يحل الحول بعد · موعد زكاتك المتوقع: {dueText}</div>
          : <div className="state">✓ بلغ ذهبك النصاب وتجب فيه الزكاة (2.5%){due ? ` · استحقت منذ ${dueText}` : ""}</div>}
        <div style={{ marginTop: 12 }} />
        <ResultLine label="الذهب الخالص (عيار 24)" value={`${fmt(pure, 2)} جم`} />
        <ResultLine label="إجمالي القيمة" value={`${money(c, value)} ${c.curShort}`} />
        <ResultLine label="سعر الجرام 24" value={`${money(c, c.g24)} ${c.curShort}`} />
        <button className="btn btn-ghost btn-sm" style={{ marginTop: 12, color: "#fff" }} onClick={() => setShow((v) => !v)}>{show ? "إخفاء تفاصيل الحساب" : "إظهار تفاصيل الحساب"}</button>
        {show && (
          <>
            <ResultLine label="النصاب الشرعي" value="85 جم عيار 24" />
            <ResultLine label="قيمة النصاب بالسعر الحالي" value={`${money(c, NISAB * c.g24)} ${c.curShort}`} />
            <ResultLine label="نسبة الزكاة" value="2.5%" />
            {reached ? <ResultLine label="الزكاة بالوزن" value={`${fmt(pure * 0.025, 3)} جم`} /> : <ResultLine label="المتبقي للنصاب" value={`${fmt(NISAB - pure, 2)} جم`} />}
            {all.map((x, i) => <ResultLine key={i} label={`${i + 1}. ${x.type} عيار ${x.k}`} value={`${fmt((x.g * x.k) / 24, 2)} جم خالص · ${money(c, x.g * gold(c, x.k))}`} />)}
          </>
        )}
      </div>
    </div>
  );
}
