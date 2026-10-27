import type { Metadata } from "next";
import { countryParamsWith, resolveCountry, type CParams } from "@/lib/params";
import { getCountry } from "@/lib/countries";
import { TIER_LABELS } from "@/lib/market";
import { CalcShell } from "@/components/calc/Shell";
import { BuyCalc } from "@/components/calc/Buy";
import { SectionHead } from "@/components/ui/Basics";

export const dynamicParams = false;
export const generateStaticParams = () => countryParamsWith("gold/buy");
export async function generateMetadata({ params }: CParams): Promise<Metadata> {
  const c = getCountry((await params).c);
  return c ? { title: `حاسبة سعر شراء الذهب في ${c.name} - التكلفة الإجمالية للذهب الجديد` } : {};
}

export default async function Page({ params }: CParams) {
  const c = await resolveCountry(params, "gold/buy");
  const b = c.buy!;
  return (
    <CalcShell
      c={c} id="gold/buy"
      title={<>حاسبة سعر شراء الذهب في {c.name}</>}
      lead={`احسب التكلفة الكاملة للذهب الجديد شاملة المصنعية${b.tax ? ` وضريبة ${b.tax}%` : ""} — أسعار محدثة كل دقيقة.`}
      steps={[["اختر العيار", "حدد عيار الذهب أو اختر السبيكة."], ["أدخل الوزن", "أدخل وزن الذهب المراد شراؤه."], ["أضف المصنعية", "تُملأ تلقائياً حسب نوع القطعة ويمكنك تعديلها."], ["احسب الإجمالي", "التكلفة الكاملة شاملة المصنعية والضريبة."]]}
      faq={[
        ["ما هي المصنعية في الذهب؟", "المصنعية هي التكلفة الإضافية التي تُضاف إلى سعر الذهب الخام مقابل التصنيع والتشكيل."],
        ["هل تُطبق ضريبة القيمة المضافة على الذهب؟", b.tax ? (b.taxOn === "making" ? `يُعفى الذهب الخام من الضريبة، بينما تُطبق ضريبة ${b.tax}% على المصنعية فقط.` : `تُعفى السبائك عيار 24، بينما تُطبق ضريبة ${b.tax}% على سعر المجوهرات شاملاً المصنعية.`) : `لا تُفرض حالياً ضريبة قيمة مضافة على الذهب في ${c.name}.`],
        ["كيف يتم حساب الضريبة؟", b.taxOn === "making" ? `الضريبة = المصنعية × ${b.tax}% (مثال: 120 ${c.curName} مصنعية × ${b.tax}% = ${(1.2 * b.tax).toFixed(1)} ${c.curName}).` : `الضريبة = (سعر الخام + المصنعية) × ${b.tax}%.`],
      ]}
      related={["gold/sell", "gold-value", "gold-karat-converter"]}
      after={
        <section className="container sec">
          <SectionHead eb="شرائح المصنعية" title="شرائح المصنعية التفصيلية في السوق المحلي" />
          <div className="grid-4 rv">
            {b.tiers.map((t, i) => (
              <div key={i} className={`card kcard${i === 1 ? " on" : ""}`}>
                <span className="badge">{TIER_LABELS[i]}</span>
                <div className="k-price"><span className="n">{t[0]}{t[1] != null ? `–${t[1]}` : "+"}</span><small>{c.curName}/جرام</small></div>
                <p>المصنعية التقريبية</p>
              </div>
            ))}
          </div>
        </section>
      }
    >
      <BuyCalc slug={c.slug} />
    </CalcShell>
  );
}
