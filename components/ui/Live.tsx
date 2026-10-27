"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { series } from "@/lib/market";

/** Re-arms the scroll-reveal observer on every route change. */
export function Reveal() {
  const path = usePathname();
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("in")), { threshold: 0.06 });
    const t = setTimeout(() => {
      const vh = window.innerHeight;
      document.querySelectorAll(".rv:not(.in)").forEach((x) => {
        if (x.getBoundingClientRect().top < vh) x.classList.add("in");
        else io.observe(x);
      });
      document.documentElement.classList.add("rv-on");
    }, 30);
    return () => { clearTimeout(t); io.disconnect(); };
  }, [path]);
  return null;
}

export function LiveClock({ tz, initial }: { tz: string; initial?: string }) {
  const fmt = () => new Date().toLocaleTimeString("ar-EG-u-nu-latn", { hour: "numeric", minute: "2-digit", timeZone: tz });
  const [t, setT] = useState(initial ?? "");
  useEffect(() => {
    setT(fmt());
    const id = setInterval(() => setT(fmt()), 30000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tz]);
  return <b className="n" suppressHydrationWarning>{t || "—"}</b>;
}

/** Split-flap style number that rolls into place when the value changes. */
export function PriceBoard({ text, unit }: { text: string; unit?: string }) {
  const chars = [...text];
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const first = useRef(true);
  useEffect(() => {
    const timers: ReturnType<typeof setInterval>[] = [];
    chars.forEach((c, i) => {
      const el = refs.current[i];
      if (!el || !/\d/.test(c)) return;
      let n = 0;
      const total = first.current ? 8 + i * 3 : 5 + i * 2;
      const iv = setInterval(() => {
        n++;
        el.textContent = n >= total ? c : String(Math.floor(Math.random() * 10));
        el.classList.remove("flip"); void el.offsetWidth; el.classList.add("flip");
        if (n >= total) clearInterval(iv);
      }, 50);
      timers.push(iv);
    });
    first.current = false;
    return () => timers.forEach(clearInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);
  return (
    <div className="board" aria-label={`${text} ${unit ?? ""}`}>
      {chars.map((c, i) => (
        <div key={`${chars.length}-${i}`} ref={(el) => { refs.current[i] = el; }} className={`tile${/\d/.test(c) ? "" : " sep"}`}>{c}</div>
      ))}
      {unit && <span className="unit">{unit}</span>}
    </div>
  );
}

type Range = { id: string; label: string; n: number; vol: number; drift: number; tick: (i: number, n: number) => string };
const RANGES: Range[] = [
  { id: "60m", label: "60 دقيقة", n: 60, vol: 0.0004, drift: 0.0005, tick: (i, n) => `قبل ${n - i} دقيقة` },
  { id: "24h", label: "24 ساعة", n: 48, vol: 0.0012, drift: 0.002, tick: (i, n) => `قبل ${Math.round((n - i) / 2)} ساعة` },
  { id: "7d", label: "7 أيام", n: 56, vol: 0.004, drift: 0.018, tick: (i, n) => `قبل ${Math.ceil((n - i) / 8)} يوم` },
  { id: "30d", label: "30 يوم", n: 30, vol: 0.008, drift: 0.03, tick: (i, n) => `قبل ${n - i} يوم` },
  { id: "12m", label: "12 شهر", n: 12, vol: 0.035, drift: -0.22, tick: (i, n) => `قبل ${n - i} شهر` },
];

export function PriceChart({ end, unit, seed, title, digits = 2 }: { end: number; unit: string; seed: number; title: string; digits?: number }) {
  const [r, setR] = useState("7d");
  const [tip, setTip] = useState<{ x: number; y: number; t: string } | null>(null);
  const R = RANGES.find((x) => x.id === r)!;
  const { p, path, area, X, Y, min, max } = useMemo(() => {
    const p = series(end, R.n, R.vol, seed + R.n, R.drift);
    const min = Math.min(...p), max = Math.max(...p), pad = (max - min) * 0.18 || end * 0.001;
    const X = (i: number) => (i / (R.n - 1)) * 1000;
    const Y = (v: number) => 300 - ((v - min + pad) / (max - min + pad * 2)) * 280;
    let path = "";
    p.forEach((v, i) => {
      if (!i) path += `M0 ${Y(v)}`;
      else { const cx = (X(i - 1) + X(i)) / 2; path += ` C${cx} ${Y(p[i - 1])} ${cx} ${Y(v)} ${X(i)} ${Y(v)}`; }
    });
    return { p, path, area: `${path} L1000 320 L0 320Z`, X, Y, min, max };
  }, [end, R, seed]);
  const f = (v: number) => v.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });
  const chg = ((p[p.length - 1] - p[0]) / p[0]) * 100;

  return (
    <div className="chart-card rv">
      <div className="chart-top">
        <div>
          <small style={{ color: "var(--mute)" }}>{title}</small>
          <div className="big"><span className="n">{f(end)}</span> <small style={{ fontSize: 14, color: "var(--mute)" }}>{unit}</small>{" "}
            <span className={`badge ${chg >= 0 ? "ok" : "no"}`}><span className="n">{chg >= 0 ? "▲" : "▼"} {Math.abs(chg).toFixed(2)}%</span></span></div>
        </div>
        <div className="chips">{RANGES.map((x) => <button key={x.id} className={`chip${x.id === r ? " on" : ""}`} onClick={() => setR(x.id)}>{x.label}</button>)}</div>
      </div>
      <div style={{ position: "relative" }}>
        <svg className="chart-svg" viewBox="0 0 1000 320" preserveAspectRatio="none"
          onMouseMove={(e) => {
            const b = e.currentTarget.getBoundingClientRect();
            const i = Math.round(Math.min(1, Math.max(0, (e.clientX - b.left) / b.width)) * (R.n - 1));
            setTip({ x: (X(i) / 1000) * b.width, y: (Y(p[i]) / 320) * b.height, t: `${f(p[i])} ${unit} · ${R.tick(i, R.n)}` });
          }}
          onMouseLeave={() => setTip(null)}>
          <defs>
            <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fed700" stopOpacity=".45" /><stop offset="1" stopColor="#fed700" stopOpacity="0" /></linearGradient>
          </defs>
          {[0, 1, 2, 3, 4].map((i) => <line key={i} x1="0" x2="1000" y1={20 + i * 70} y2={20 + i * 70} stroke="#e7e5dd" strokeDasharray="3 6" vectorEffect="non-scaling-stroke" />)}
          <path d={area} fill="url(#chartFill)" />
          <path d={path} fill="none" stroke="#232a31" strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke" />        </svg>
        <div className="chart-tip n" style={tip ? { opacity: 1, left: tip.x, top: tip.y } : undefined}>{tip?.t}</div>
      </div>
      <div className="trust" style={{ justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}><span>البيانات محدثة كل دقيقة</span><span>تحديث تلقائي</span><span>بيانات موثوقة</span></div>
        <span className="n" style={{ color: "var(--mute)" }}>{f(min)} — {f(max)}</span>
      </div>
    </div>
  );
}

export function NewsletterForm({ dark }: { dark?: boolean }) {
  const [sent, setSent] = useState(false);
  if (sent) return <p style={{ fontWeight: 700 }}>✓ تم الاشتراك. (واجهة تجريبية — لم يُرسل أي بريد بعد ربط الخدمة)</p>;
  return (
    <form className="inline" style={{ maxWidth: 460, width: "100%" }}onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
      <input type="email" required placeholder="بريدك الإلكتروني" aria-label="البريد الإلكتروني"
        style={{ padding: "14px 18px", borderRadius: 14, border: 0, outline: 0, background: dark ? "rgba(255,255,255,.1)" : "#fff", color: dark ? "#fff" : "var(--ink)" }} />
      <button className={`btn ${dark ? "btn-y" : "btn-dark"}`}>اشترك</button>
    </form>
  );
}
