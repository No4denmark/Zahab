import type { Metadata } from "next";
import { allCountryParams, resolveCountry, type CParams } from "@/lib/params";
import { getCountry } from "@/lib/countries";
import { gold, money } from "@/lib/market";
import { CalcShell } from "@/components/calc/Shell";
import { GoldValueCalc } from "@/components/calc/GoldValue";
import { SectionHead } from "@/components/ui/Basics";

export const dynamicParams = false;
export const generateStaticParams = allCountryParams;
export async function generateMetadata({ params }: CParams): Promise<Metadata> {
  const c = getCountry((await params).c);
  return c ? { title: `حاسبة الذهب في ${c.name} - احسب قيمة ذهبك بالـ${c.curName}` } : {};
}

export default async function Page({ params }: CParams) {
  const c = await resolveCountry(params);
  const ks = [24, 22, 21, 18].filter((k) => c.karats.includes(k) || k === 21 || k === 24);
  return (
    <CalcShell
      c={c} id="gold-value"
      title={<>حاسبة الذهب في {c.name} — احسب قيمة ذهبك بالـ{c.curName}</>}
      lead="حاسبة تفاعلية تدعم جميع العيارات (24، 22، 21، 18، 14) والأوزان (جرام، مثقال، أونصة، كيلو). أضف عدة قطع واحصل على النتيجة الإجمالية فوراً."
      steps={[
        ["أدخل وزن الذهب", "ابدأ بإدخال وزن القطعة التي تريد حساب قيمتها."],
        ["اختر العيار المناسب", "حدد عيار الذهب (24، 22، 21، 18، 14) حسب القطعة."],
        ["اختر وحدة الوزن", "جرام أو مثقال أو أونصة أو كيلو — التحويل تلقائي."],
        ["حدد نوع الذهب (اختياري)", "خاتم، سوار، سبيكة… لتنظيم حساباتك."],
        ["اضغط «أضف»", "تظهر بيانات القطعة مع كمية الذهب الصافي عيار 24."],
        ["أضف قطعاً متعددة", "بعيارات وأوزان مختلفة، والحاسبة تجمع القيمة الإجمالية."],
      ]}
      faq={[
        ["كيف أعرف عيار الذهب الذي أملكه؟", "من الختم المطبوع عليه (24k، 22k، 21k، 18k)، أو بفحصه في محل المجوهرات أو بجهاز فحص الذهب الإلكتروني."],
        ["ما الفرق بين الجرام والمثقال والأونصة؟", "الجرام هو الوحدة الأساسية، المثقال يساوي 4.25 جرام، والأونصة تساوي 31.1 جرام. الحاسبة تحول بينها تلقائياً."],
        ["هل القيمة المعروضة تشمل الضريبة والمصنعية؟", "لا، الحاسبة تعرض قيمة الذهب الخام فقط. القيمة في المحلات تشمل الضريبة والمصنعية وهامش ربح التاجر."],
        ["كيف أحسب قيمة الذهب يدوياً بدون حاسبة؟", "اضرب الوزن (بالجرام) × نسبة نقاء العيار × سعر جرام عيار 24. مثال: 100 جرام عيار 21 = 100 × 0.875 × سعر الجرام."],
      ]}
      related={["gold/sell", "zakat", "gold-karat-converter"]}
      after={
        <section className="container sec">
          <SectionHead eb="جدول مرجعي" title="أوزان شائعة وقيمتها" />
          <div className="tbl-wrap rv">
            <table className="tbl">
              <thead><tr><th>الوزن</th>{ks.map((k) => <th key={k}>عيار {k}</th>)}</tr></thead>
              <tbody>
                {[10, 20, 50, 100, 150].map((w) => (
                  <tr key={w}><td className="strong">{w} جرام</td>{ks.map((k) => <td key={k} className="n">{money(c, w * gold(c, k), 2)}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      }
    >
      <GoldValueCalc slug={c.slug} />
    </CalcShell>
  );
}
