import type { Metadata } from "next";
import { allCountryParams, resolveCountry, type CParams } from "@/lib/params";
import { getCountry } from "@/lib/countries";
import { fmt, FX_LIST, rateIn } from "@/lib/market";
import { Crumbs, Faq, Flag, SectionHead, Updated } from "@/components/ui/Basics";
import { FxConverter } from "@/components/pages/FxConverter";
import { CurrencyLogo } from "@/components/ui/CurrencyLogo";
import { GlobeArt } from "@/components/ui/Art";
import { NewsletterBanner } from "@/components/ui/Banners";

export const dynamicParams = false;
export const generateStaticParams = allCountryParams;
export async function generateMetadata({ params }: CParams): Promise<Metadata> {
  const c = getCountry((await params).c);
  return c ? { title: `أسعار صرف العملات اليوم مقابل ${c.curName} (${c.cur})` } : {};
}

const FAQ: [string, string][] = [
  ["ما هو سعر الصرف وكيف يتم تحديده؟", "سعر الصرف هو قيمة عملة مقابل أخرى، ويتحدد بالعرض والطلب في سوق الصرف الأجنبي، ويتأثر بأسعار الفائدة ومعدلات التضخم والاستقرار السياسي وأداء الاقتصاد."],
  ["لماذا تختلف أسعار الصرف من بنك لآخر؟", "يضيف كل بنك أو شركة صرافة هامش ربح على السعر العالمي (السعر بين البنوك)، ويختلف حسب سياسة المؤسسة وحجم التعامل."],
  ["متى أفضل وقت لصرف العملات؟", "لا يوجد وقت مثالي محدد، لكن يُنصح بمتابعة الأخبار الاقتصادية وتجنب الصرف في أوقات التقلبات الشديدة، ومراقبة الاتجاه لعدة أيام."],
  ["هل الأسعار المعروضة نهائية؟", "لا، هي متوسط أسعار السوق العالمية، وقد تختلف الأسعار الفعلية حسب البنك والعمولات. تحقق قبل أي معاملة."],
  ["كيف يمكنني الحصول على أفضل سعر صرف؟", "قارن بين عدة بنوك وشركات صرافة، تجنب الصرافة في المطارات، استخدم الحوالات البنكية للمبالغ الكبيرة، وراقب السوق."],
  ["ما هي العوامل التي تؤثر على سعر الصرف؟", "أسعار الفائدة، التضخم، الاستقرار السياسي والاقتصادي، ميزان المدفوعات، الدين الحكومي، المضاربات، والتدخلات الحكومية."],
  ["هل يمكنني صرف أي عملة في أي بنك؟", "معظم البنوك تتعامل مع العملات الرئيسية، لكن العملات الأقل شيوعاً قد لا تتوفر في كل الفروع."],
];

export default async function Page({ params }: CParams) {
  const c = await resolveCountry(params);
  const list = FX_LIST.filter(([x]) => x !== c.cur);
  const top = list.slice(0, 3).map(([x, n]) => `${n} (${x}) = ${fmt(rateIn(c, x), 4)} ${c.cur}`).join("، ");
  return (
    <main>
      <section className="hero">
        <div className="container hero-in" style={{ paddingBottom: 120 }}>
          <div>
            <Crumbs items={[["الرئيسية", "/"], [c.name, `/${c.slug}`], ["أسعار صرف العملات"]]} />
            <span className="kicker"><Flag code={c.code} /> تحديث مباشر لأكثر من 18 عملة</span>
            <h1>أسعار صرف العملات اليوم مقابل <span className="hl">{c.curName}</span></h1>
            <p className="lead">احسب قيمة أي مبلغ بين العملات مقابل {c.curName} ({c.cur}) بأسعار محدثة يومياً.</p>
          </div>
          <div className="hero-art" style={{ minHeight: 260 }}><GlobeArt /></div>
        </div>
      </section>
      <div className="container calc-wrap"><FxConverter slug={c.slug} /></div>

      <section className="container sec">
        <SectionHead eb="أسعار العملات الحية" title={`جدول أسعار الصرف مقابل ${c.curName}`} desc={`آخر تحديث الأحد 25 أكتوبر 2026: ${top}.`} />
        <div className="grid-3 rv">
          {list.map(([x, n]) => (
            <div key={x} className="ccard">
              <CurrencyLogo code={x} />
              <div><b>{n}</b><small><span className="cur-code">{x}</span> {x === "JPY" ? "لكل 100 ين" : `· 1 ${x}`}</small></div>
              <span className="cp n">{fmt(rateIn(c, x) * (x === "JPY" ? 100 : 1), rateIn(c, x) >= 100 ? 2 : 4)} <small style={{ color: "var(--mute)", fontWeight: 500 }}>{c.cur}</small></span>
            </div>
          ))}
        </div>
        <p className="note rv"><span>أسعار استرشادية تتغير مع تحركات سوق الصرف الدولي. الأسعار محدثة حتى 25 أكتوبر 2026 بتوقيت {c.city}.</span></p>
      </section>

      <section className="container sec">
        <SectionHead eb="الأسئلة الشائعة" title="الأسئلة الشائعة حول صرف العملات" />
        <Faq items={FAQ} />
        <Updated reviewed="07 سبتمبر 2026" />
      </section>
      <NewsletterBanner />
    </main>
  );
}
