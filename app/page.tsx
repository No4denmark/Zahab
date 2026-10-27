import Link from "next/link";
import { COUNTRIES, FEATURED } from "@/lib/countries";
import { getLive } from "@/lib/live";
import { mergeLive } from "@/lib/live-shared";
import { FeaturedPrices, OunceCard } from "@/components/live/LiveParts";
import { fmt, money, OUNCE } from "@/lib/market";
import { Faq, Flag, SectionHead, Updated } from "@/components/ui/Basics";
import { PriceChart } from "@/components/ui/Live";
import { AlertsBanner, CalcBanner, NewsletterBanner } from "@/components/ui/Banners";
import { GoldStackArt } from "@/components/ui/Art";
import { CompareTable } from "@/components/pages/CompareTable";
import { NewsSection } from "@/components/pages/NewsSection";
import { IconBolt, IconGlobe, IconShield } from "@/components/ui/Icons";

const FAQ: [string, string][] = [
  ["ما هو سعر الذهب العالمي؟", "سعر الذهب العالمي (سعر الأونصة) هو السعر المرجعي الدولي الذي يُحدَّد في أسواق لندن ونيويورك. يُقاس بالدولار الأمريكي لكل أونصة تروي (31.1 جرام)، وتُشتق منه جميع أسعار الدول بعد تحويل العملة."],
  ["لماذا يختلف سعر الذهب من دولة إلى أخرى؟", "المعدن واحد، لكن سعره يُحوَّل إلى العملة المحلية بسعر الصرف الحالي في كل دولة. كما تختلف أسعار المحلات بسبب الضرائب المحلية والمصنعية وهامش ربح التاجر."],
  ["كيف أقرأ أسعار الذهب في الجدول؟", "كل صف يعرض سعر جرام الذهب بالعملة المحلية للدولة، ويمكنك التبديل بين عيار 24 و21 و18، والبحث باسم الدولة أو رمز العملة، أو الضغط على الدولة لعرض كل التفاصيل."],
  ["هل الأسعار محدثة؟", "نعم، تُجلب الأسعار من المصدر كل دقيقة وتُحدَّث تلقائياً دون الحاجة لإعادة تحميل الصفحة."],
  ["كيف أحسب قيمة ذهبي؟", "اضرب الوزن بالجرام × نسبة نقاء العيار × سعر جرام عيار 24. أو استخدم حاسبة قيمة الذهب لتحسبها تلقائياً بأسعار دولتك."],
  ["كيف يتم تحديد سعر الذهب عالمياً؟", "يتحدد بالعرض والطلب في أسواق التداول الكبرى، ويتأثر بأسعار الفائدة وقوة الدولار والتوترات الجيوسياسية وطلب البنوك المركزية."],
  ["ما الفرق بين أونصة الذهب والجرام؟", "الأونصة التروي تساوي 31.1035 جرام. سعر الأونصة يُستخدم عالمياً، بينما تُسعَّر المحلات بالجرام."],
];

export default async function Home() {
  const live = await getLive();
  const all = COUNTRIES.map((c) => mergeLive(c, live));
  const by = (s: string) => all.find((c) => c.slug === s)!;
  const ounce = live?.ounce ?? OUNCE.usd;
  const eg = by("ar-eg");
  return (
    <main>
      <section className="hero">
        <div className="container">
          <div className="hero-in">
            <div>
              <span className="kicker"><span className="pulse" /> يتحدث تلقائياً كل دقيقة</span>
              <h1>أسعار الذهب اليوم في <span className="hl">37 دولة</span> بعملتها المحلية</h1>
              <p className="lead">السعر العالمي للذهب اليوم <b className="n">{fmt(ounce)}</b> دولار للأونصة. قارن أسعار الذهب في الدول العربية وأوروبا وأمريكا لحظة بلحظة.</p>
              <div className="hero-cta">
                <Link className="btn btn-y" href="/ar-eg"><Flag code="eg" /> أسعار الذهب في مصر ←</Link>
                <a className="btn btn-ghost" href="#compare">قارن الأسعار</a>
              </div>
            </div>
            <OunceCard />
          </div>
          <div style={{ paddingBottom: 46 }}>
            <small style={{ color: "var(--ink-3)", fontWeight: 600 }}>📍 أبرز الأسعار — جرام عيار 24</small>
            <FeaturedPrices slugs={FEATURED} />
          </div>
        </div>
      </section>

      <section className="container sec">
        <div className="grid-3 rv">
          <div className="card"><span className="badge"><IconBolt size={14} /> لحظي</span><h3 style={{ marginTop: 10 }}>تحديث كل 60 ثانية</h3><p>بيانات مباشرة من Metal Price API دون تدخل بشري أو تقريب يدوي.</p></div>
          <div className="card"><span className="badge"><IconGlobe size={14} /> شامل</span><h3 style={{ marginTop: 10 }}>37 دولة بعملتها</h3><p>من الخليج ومصر والمغرب العربي إلى أوروبا وأمريكا وأستراليا.</p></div>
          <div className="card"><span className="badge"><IconShield size={14} /> شفاف</span><h3 style={{ marginTop: 10 }}>منهجية موثّقة</h3><p>كل معادلة حساب منشورة بالتفصيل في <Link href="/ar/methodology" style={{ color: "var(--y-dd)", fontWeight: 700 }}>صفحة المنهجية</Link>.</p></div>
        </div>
      </section>

      <section className="container sec" id="compare">
        <SectionHead eb="مقارنة الدول" title="أسعار الذهب في الدول العربية وأوروبا وأمريكا" desc="سعر جرام الذهب بالعملة المحلية لكل دولة لعيارات 24 و21 و18 — ابحث، صفِّ حسب المنطقة، واضغط على أي دولة للتفاصيل." />
        <CompareTable />
      </section>

      <section className="dark-sec">
        <div className="container">
          <div className="banner" style={{ padding: 0, gridTemplateColumns: "1.1fr .9fr" }}>
            <div className="rv">
              <div className="sec-head" style={{ marginBottom: 14 }}><div><div className="eb">سعر أونصة الذهب اليوم</div><h2><span className="n">${fmt(ounce)}</span> USD</h2></div></div>
              <p style={{ color: "#c3c9d0", fontSize: 16.5 }}>من هذا السعر العالمي تُشتق أسعار الذهب في جميع الدول بعد تحويله بسعر صرف العملة المحلية — ولهذا يختلف سعر الذهب من دولة لأخرى رغم أن المعدن نفسه واحد.</p>
              <div className="grid-3" style={{ marginTop: 22 }}>
                {["ar-eg", "ar-sa", "ar-de"].map((s) => { const c = by(s); return (
                  <Link key={s} href={`/${s}`} className="card" style={{ background: "rgba(255,255,255,.05)", borderColor: "rgba(255,255,255,.1)", color: "#fff", padding: 18 }}>
                    <small style={{ color: "#9ca3af", display: "flex", gap: 8, alignItems: "center" }}><Flag code={c.code} /> {c.name}</small>
                    <b style={{ fontSize: 22, display: "block", marginTop: 4 }}><span className="n">{money(c, c.g24)}</span> <small style={{ color: "var(--y)", fontSize: 13 }}>{c.curName}</small></b>
                  </Link>
                ); })}
              </div>
            </div>
            <div className="hero-art rv"><GoldStackArt /></div>
          </div>
        </div>
      </section>

      <section className="container sec" id="chart">
        <SectionHead eb="الرسم البياني" title="سعر الأونصة الذهبية عالمياً" />
        <PriceChart end={ounce} unit="$" seed={77} title="XAU/USD — دولار للأونصة" />
      </section>

      <CalcBanner c={eg} />

      <section className="container sec">
        <SectionHead eb="تصفح حسب الدولة" title="اختر دولتك" desc="كل دولة لها صفحة كاملة: العيارات، البيع والشراء، السبائك، الرسم البياني، الفضة والحاسبات." />
        <div className="grid-4 rv">
          {all.map((c) => (
            <Link key={c.slug} href={`/${c.slug}`} className="ccard">
              <Flag code={c.code} lg />
              <div><b>{c.name}</b><small>{c.cur} · {c.curName}</small></div>
              <span className="cp n">{money(c, c.g24)}</span>
            </Link>
          ))}
        </div>
      </section>

      <NewsSection />

      <AlertsBanner />

      <section className="container sec" id="faq">
        <SectionHead eb="الأسئلة الشائعة" title="الأسئلة الشائعة حول سعر الذهب" />
        <Faq items={FAQ} />
        <Updated />
      </section>

      <NewsletterBanner />
    </main>
  );
}
