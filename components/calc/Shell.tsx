import Link from "next/link";
import type { Country } from "@/lib/countries";
import { CALCS, calcsFor, money, type CalcId } from "@/lib/market";
import { Crumbs, Faq, Flag, SectionHead, Steps, Updated } from "@/components/ui/Basics";
import { CalcIcon } from "@/components/ui/Icons";
import { MobileResultBar } from "@/components/live/Assistant";

type Props = {
  c: Country;
  id: CalcId;
  title: React.ReactNode;
  lead: React.ReactNode;
  children: React.ReactNode;
  steps?: [string, string][];
  faq?: [string, string][];
  related?: CalcId[];
  after?: React.ReactNode;
};

export function CalcShell({ c, id, title, lead, children, steps, faq, related, after }: Props) {
  const meta = CALCS.find((x) => x.id === id)!;
  const rel = (related ?? []).map((r) => CALCS.find((x) => x.id === r)!).filter((x) => calcsFor(c).includes(x));
  return (
    <main>
      <section className="hero">
        <div className="container calc-hero">
          <Crumbs items={[["الرئيسية", "/"], [c.name, `/${c.slug}`], ["حاسبات الذهب", `/${c.slug}/calculator`], [meta.title]]} />
          <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
            <span className="logo-mark" style={{ width: 64, height: 64, borderRadius: 20 }}><CalcIcon id={meta.icon} size={32} /></span>
            <div style={{ flex: 1, minWidth: 260 }}>
              <h1 style={{ fontSize: "clamp(28px,4vw,46px)", margin: "6px 0" }}>{title}</h1>
              <p className="lead">{lead}</p>
            </div>
          </div>
          <div className="chips dark" style={{ marginTop: 20 }}>
            <span className="chip"><span className="pulse" /> محدثة كل دقيقة</span>
            <span className="chip">دقة عالية</span>
            <span className="chip">مجانية 100%</span>
            <span className="chip"><Flag code={c.code} /> عيار 24: <span className="n">{money(c, c.g24)}</span> {c.curShort}</span>
          </div>
        </div>
      </section>

      <div className="container calc-wrap">{children}</div>
      <MobileResultBar />

      {after}

      {steps && (
        <section className="container sec">
          <SectionHead eb="خطوات بسيطة" title={`كيفية استخدام ${meta.title}`} />
          <Steps items={steps} />
        </section>
      )}

      {faq && (
        <section className="container sec">
          <SectionHead eb="الأسئلة الشائعة" title="الأسئلة الشائعة" />
          <Faq items={faq} />
        </section>
      )}

      {rel.length > 0 && (
        <section className="container sec">
          <SectionHead eb="حاسبات مرتبطة" title="جرّب أيضاً" />
          <div className="related rv">
            {rel.map((r) => (
              <Link key={r.id} className="calc-card" href={`/${c.slug}/calculator/${r.id}`}>
                <span className="ci"><CalcIcon id={r.icon} /></span>
                <h3>{r.title}</h3>
                <p>{r.desc(c)}</p>
                <span className="go">احسب الآن ←</span>
              </Link>
            ))}
          </div>
          <Updated reviewed="07 سبتمبر 2026" />
        </section>
      )}

    </main>
  );
}
