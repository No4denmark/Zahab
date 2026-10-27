import type { Metadata } from "next";
import Link from "next/link";
import { allCountryParams, resolveCountry, type CParams } from "@/lib/params";
import { getCountry } from "@/lib/countries";
import { fmt, seedOf, SILVER, silverPrice } from "@/lib/market";
import { Coin3D, Crumbs, Faq, Flag, SectionHead, Updated } from "@/components/ui/Basics";
import { PriceChart } from "@/components/ui/Live";
import { CalcBanner, NewsletterBanner } from "@/components/ui/Banners";
import { SilverHeroCard, SilverTabs } from "@/components/pages/SilverParts";
import { SectionNav } from "@/components/site/SectionNav";

export const dynamicParams = false;
export const generateStaticParams = allCountryParams;

export async function generateMetadata({ params }: CParams): Promise<Metadata> {
  const c = getCountry((await params).c);
  return c ? { title: `أسعار الفضة اليوم في ${c.name} - عيار 999 و925`, description: `أسعار الفضة في ${c.name} بالـ${c.curName} حسب درجة النقاء (999، 925، 900، 800) — تحديث مستمر مع رسومات بيانية تفاعلية.` } : {};
}

const FAQ: [string, string][] = [
  ["ما هي الفضة الإسترلينية 925؟", "فضة 925 (الإسترلينية) تحتوي على 92.5% فضة نقية و7.5% معادن أخرى (عادةً نحاس) لزيادة الصلابة. هي المعيار العالمي الأكثر شيوعاً في المجوهرات والأدوات الفضية."],
  ["لماذا يختلف سعر فضة 999 عن فضة 925؟", "كلما زادت نسبة الفضة النقية زاد السعر. فضة 999 تحتوي على 99.9% فضة بينما 925 تحتوي على 92.5% فقط، مما يجعل 999 أغلى بنحو 8%."],
  ["هل الفضة استثمار جيد؟", "الفضة خيار شائع للادخار طويل المدى خاصة في سبائك 999، فهي أقل تكلفة من الذهب وتُستخدم في صناعات حديثة كالإلكترونيات والطاقة الشمسية. هذه معلومات عامة وليست نصيحة استثمارية."],
  ["هل تتأكسد الفضة؟ وكيف أحافظ عليها؟", "نعم، تتأكسد بالتعرض للهواء والرطوبة. احفظها في أكياس مانعة للهواء، ونظفها بقطعة قماش ناعمة وملمع فضة عند الحاجة."],
  ["هل تختلف أسعار الفضة من مدينة لأخرى؟", "السعر الأساسي للفضة عالمي، لكن أسعار البيع في المحلات قد تختلف حسب التكاليف التشغيلية وهامش الربح."],
];

export default async function SilverPage({ params }: CParams) {
  const c = await resolveCountry(params);
  const p999 = silverPrice(c, 0.999);
  const d = p999 >= 1000 ? 0 : p999 >= 10 ? 2 : 4;
  return (
    <main>
      <section className="hero">
        <div className="container hero-in">
          <div>
            <Crumbs items={[["الرئيسية", "/"], [c.name, `/${c.slug}`], ["أسعار الفضة"]]} />
            <span className="kicker"><Flag code={c.code} /> حسب درجة النقاء (999، 925، 900، 800)</span>
            <h1>أسعار الفضة اليوم في <span className="hl">{c.name}</span></h1>
            <p className="lead">كم سعر جرام الفضة اليوم في {c.name}؟ سعر جرام الفضة عيار 999 حوالي <b className="n">{fmt(p999, d)}</b> {c.curName}، استناداً لسعر الفضة العالمي وسعر صرف الـ{c.curName}.</p>
            <div className="hero-cta">
              <a className="btn btn-y" href="#prices">الأسعار ←</a>
              <Link className="btn btn-ghost" href={`/${c.slug}`}>أسعار الذهب</Link>
            </div>
          </div>
          <div style={{ display: "grid", gap: 22, justifyItems: "center" }}>
            <SilverHeroCard slug={c.slug} />
          </div>
        </div>
      </section>

      <SectionNav items={[
        { id: "prices", label: "الأسعار", hint: "4 درجات نقاء", icon: "silver" },
        { id: "chart", label: "الرسم البياني", hint: "60 د – 12 شهر", icon: "chart" },
        { id: "compare", label: "المقارنة", hint: "999 · 925 · 900 · 800", icon: "layers" },
        { id: "faq", label: "الأسئلة", hint: `${FAQ.length} أسئلة`, icon: "help" },
      ]} />

      <section className="container sec" id="prices">
        <SectionHead eb="الأسعار الحالية" title={`أسعار الفضة اليوم في ${c.name}`} desc={`يبلغ سعر جرام الفضة النقية (999) نحو ${fmt(p999, d)} ${c.curName}، محدّث لحظياً.`} />
        <SilverTabs slug={c.slug} />
        <div className="grid-4 rv" style={{ marginTop: 18 }}>
          {SILVER.map((s) => <div key={s.id} className="card" style={{ padding: 18 }}><b>{s.label}:</b> <span className="n">{(s.purity * 100).toFixed(1)}%</span><p style={{ fontSize: 13.5 }}>نسبة الفضة النقية</p></div>)}
        </div>
      </section>

      <section className="container sec" id="chart">
        <SectionHead eb="الرسم البياني" title={`الرسم البياني لأسعار الفضة في ${c.name}`} />
        <PriceChart end={p999} unit={c.curShort} seed={seedOf(c.code) + 51} title={`فضة 999 · ${c.curName} للجرام`} digits={d} />
      </section>

      <section className="dark-sec" id="compare">
        <div className="container">
          <div className="banner" style={{ padding: 0 }}>
            <div className="rv">
              <div className="sec-head" style={{ marginBottom: 18 }}><div><div className="eb">مقارنة درجات النقاء</div><h2>أي فضة تناسبك؟</h2></div></div>
              <div className="tbl-wrap" style={{ background: "transparent", borderColor: "rgba(255,255,255,.1)" }}>
                <table className="tbl" style={{ color: "#e5e7eb" }}>
                  <thead><tr><th>درجة النقاء</th><th>النسبة</th><th>السعر</th><th>الاستخدامات</th></tr></thead>
                  <tbody>
                    {SILVER.map((s) => { const p = silverPrice(c, s.purity); return (
                      <tr key={s.id}><td className="strong">{s.label}</td><td className="n">{(s.purity * 100).toFixed(1)}%</td><td className="n" style={{ color: "var(--y)", fontWeight: 700 }}>{fmt(p, p >= 1000 ? 0 : p >= 10 ? 2 : 4)}</td><td style={{ whiteSpace: "normal" }}>{s.use}</td></tr>
                    ); })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="banner-art rv" style={{ minHeight: 300 }}>
              <Coin3D silver top={<b>999</b>} sub="FINE SILVER" back={<b>فضة</b>} subBack={c.cur} />
            </div>
          </div>
        </div>
      </section>

      <section className="container sec">
        <div className="grid-3 rv">
          <div className="card"><h3>ما الفرق بين درجات نقاء الفضة؟</h3><p>يتأثر سعر الفضة بعوامل عديدة منها الطلب الصناعي (الإلكترونيات، الطاقة الشمسية)، ومستوى المخاطرة في الأسواق، وسعر صرف الدولار.</p></div>
          <div className="card"><h3>تحقق من الختم</h3><p>ابحث عن ختم 925 أو 999 أو 800 منقوشاً على القطعة قبل الشراء.</p></div>
          <div className="card"><h3>انتبه للأكسدة</h3><p>الفضة تتأكسد بالتعرض للهواء — احفظها في أكياس مانعة للأكسدة.</p></div>
        </div>
      </section>

      <CalcBanner c={c} />

      <section className="container sec" id="faq">
        <SectionHead eb="الأسئلة الشائعة" title="الأسئلة الشائعة حول أسعار الفضة" />
        <Faq items={FAQ} />
        <Updated />
      </section>

      <NewsletterBanner />
    </main>
  );
}
