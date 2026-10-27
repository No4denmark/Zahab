import { Crumbs } from "@/components/ui/Basics";

export function StaticPage({ title, hl, desc, updated, art, children }: { title: string; hl?: string; desc: React.ReactNode; updated?: string; art?: React.ReactNode; children: React.ReactNode }) {
  return (
    <main>
      <section className="hero">
        <div className="container hero-in" style={{ gridTemplateColumns: art ? undefined : "1fr" }}>
          <div>
            <Crumbs items={[["الرئيسية", "/"], [title]]} />
            <h1>{title}{hl && <> <span className="hl">{hl}</span></>}</h1>
            <p className="lead">{desc}</p>
            {updated && <p style={{ color: "var(--ink-3)", marginTop: 14, fontSize: 14 }}>تاريخ آخر تحديث: {updated}</p>}
          </div>
          {art && <div className="hero-art" style={{ minHeight: 280 }}>{art}</div>}
        </div>
      </section>
      <section className="container sec">
        <div className="prose rv">{children}</div>
      </section>
    </main>
  );
}

export function Sections({ items }: { items: [string, React.ReactNode][] }) {
  return <>{items.map(([h, body]) => <div key={h}><h2>{h}</h2>{typeof body === "string" ? <p>{body}</p> : body}</div>)}</>;
}
