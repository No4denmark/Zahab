"use client";
import { UNITS } from "@/lib/market";

export function Field({ label, hint, children, err }: { label: string; hint?: React.ReactNode; children: React.ReactNode; err?: string }) {
  return (
    <div className="field">
      <label><span>{label}</span>{hint && <span style={{ fontWeight: 500, color: "var(--mute)" }}>{hint}</span>}</label>
      {children}
      {err && <div className="err">{err}</div>}
    </div>
  );
}

export function Seg<T extends string | number>({ value, options, onChange }: { value: T; options: [T, string][]; onChange: (v: T) => void }) {
  return (
    <div className="seg" role="tablist">
      {options.map(([v, l]) => <button key={String(v)} type="button" role="tab" aria-selected={v === value} className={v === value ? "on" : ""} onClick={() => onChange(v)}>{l}</button>)}
    </div>
  );
}

export function KaratSelect({ value, karats, onChange }: { value: number; karats: number[]; onChange: (k: number) => void }) {
  return (
    <select value={value} onChange={(e) => onChange(+e.target.value)}>
      {karats.map((k) => <option key={k} value={k}>عيار {k} — {((k / 24) * 100).toFixed(1)}%</option>)}
    </select>
  );
}

export function WeightInput({ w, unit, onW, onUnit, quick, units = ["g", "m", "oz"] }: { w: string; unit: string; onW: (v: string) => void; onUnit: (u: string) => void; quick?: number[]; units?: string[] }) {
  return (
    <>
      <div className="inline">
        <input type="number" inputMode="decimal" min={0} step="any" value={w} placeholder="0" onChange={(e) => onW(e.target.value)} />
        <select value={unit} onChange={(e) => onUnit(e.target.value)}>{UNITS.filter((u) => units.includes(u.id)).map((u) => <option key={u.id} value={u.id}>{u.label}</option>)}</select>
      </div>
      {quick && <div className="quick">{quick.map((q) => <button type="button" key={q} onClick={() => onW(String(q))}>{q}</button>)}</div>}
    </>
  );
}

export const toGrams = (w: string, unit: string) => (parseFloat(w) || 0) * (UNITS.find((u) => u.id === unit)?.g ?? 1);

export function ResultLine({ label, value }: { label: string; value: React.ReactNode }) {
  return <div className="ln"><span>{label}</span><b className="n">{value}</b></div>;
}
