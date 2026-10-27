import Link from "next/link";

export function Flag({ code, lg }: { code: string; lg?: boolean }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img className={`flag${lg ? " lg" : ""}`} src={`https://flagcdn.com/w80/${code}.png`} alt="" loading="lazy" width={lg ? 34 : 24} height={lg ? 24 : 17} />;
}

export function SectionHead({ eb, title, desc, children }: { eb: string; title: React.ReactNode; desc?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <div className="sec-head rv">
      <div>
        <div className="eb">{eb}</div>
        <h2>{title}</h2>
        {desc && <p>{desc}</p>}
      </div>
      {children}
    </div>
  );
}

export function Faq({ items, one }: { items: [string, string][]; one?: boolean }) {
  return (
    <div className={`faq rv${one ? " one" : ""}`}>
      {items.map(([q, a], i) => (
        <details key={q} open={i === 0}>
          <summary>{q}</summary>
          <p>{a}</p>
        </details>
      ))}
    </div>
  );
}

export function Crumbs({ items }: { items: [string, string?][] }) {
  return (
    <nav className="crumbs" aria-label="مسار التنقل">
      {items.map(([label, href], i) => (
        <span key={label} style={{ display: "contents" }}>
          {i > 0 && <span aria-hidden="true">‹</span>}
          {href ? <Link href={href}>{label}</Link> : <b>{label}</b>}
        </span>
      ))}
    </nav>
  );
}

export function Coin3D({ top, sub, back, subBack, silver }: { top: React.ReactNode; sub: string; back: React.ReactNode; subBack: string; silver?: boolean }) {
  return (
    <div className={`coin3d${silver ? " silver" : ""}`}>
      {Array.from({ length: 13 }, (_, i) => i - 6).map((z) => <div key={z} className="e" style={{ transform: `translateZ(${z}px)` }} />)}
      <div className="f fr"><div>{top}<small>{sub}</small></div></div>
      <div className="f bk"><div>{back}<small>{subBack}</small></div></div>
    </div>
  );
}

export function Steps({ items }: { items: [string, string][] }) {
  return (
    <div className="steps rv">
      {items.map(([t, d]) => <div key={t} className="step"><b>{t}</b><p>{d}</p></div>)}
    </div>
  );
}

export function Updated({ reviewed }: { reviewed?: string }) {
  return (
    <p className="rv" style={{ marginTop: 28, color: "var(--mute)", fontSize: 13.5 }}>
      تصميم وبرمجة مصطفى محمد · آخر تحديث: 25 أكتوبر 2026 · آخر مراجعة لمحتوى الصفحة: {reviewed ?? "04 سبتمبر 2026"}
    </p>
  );
}
