import type { Metadata } from "next";
import { countryParamsWith, resolveCountry, type CParams } from "@/lib/params";
import { fmt, gold } from "@/lib/market";
import { CalcShell } from "@/components/calc/Shell";
import { R2GCalc } from "@/components/calc/R2G";
import { SectionHead } from "@/components/ui/Basics";

export const dynamicParams = false;
export const generateStaticParams = () => countryParamsWith("riyals-to-grams");
export const metadata: Metadata = { title: "تحويل العملة إلى جرام ذهب - كم جرام ذهب يمكنك شراؤه بميزانيتك؟" };

export default async function Page({ params }: CParams) {
  const c = await resolveCountry(params, "riyals-to-grams");
  return (
    <CalcShell
      c={c} id="riyals-to-grams"
      title="كم جرام ذهب يمكنك شراؤه بميزانيتك؟"
      lead="أدخل المبلغ لتعرف عدد الجرامات لكل عيار، مع توصية ذكية بأفضل سبيكة تناسب ميزانيتك."
      steps={[["أدخل المبلغ المتاح", `بالـ${c.curName} في حقل المبلغ.`], ["راجع النتائج", "عدد الجرامات لكل عيار (24، 22، 21، 18)."], ["اطلع على التوصية الذكية", "أفضل سبيكة تناسب ميزانيتك مع المبلغ المتبقي."], ["احسب التفاصيل الكاملة", "انتقل لحاسبة قيمة الذهب لإضافة المزيد من القطع."]]}
      faq={[
        ["كيف أحسب كم جرام ذهب يمكنني شراؤه؟", `أدخل المبلغ بالـ${c.curName} وستحصل فوراً على عدد الجرامات لكل عيار بناءً على الأسعار اللحظية.`],
        ["هل السعر المعروض يشمل المصنعية؟", "لا، الحاسبة تعرض سعر الذهب الخام فقط. السعر في المحلات يشمل المصنعية والضريبة وهامش الربح، عادة 5-20% إضافية حسب نوع القطعة."],
        ["ما الفرق بين الجرام والمثقال؟", "الجرام هو الوحدة الأساسية، والمثقال يساوي 4.25 جرام."],
      ]}
      related={["gold-value", "gold-karat-converter", "gold/buy"]}
      after={
        <section className="container sec">
          <SectionHead eb="جدول مقارنة شامل" title="كم جرام ذهب لكل مبلغ" />
          <div className="tbl-wrap rv">
            <table className="tbl">
              <thead><tr><th>المبلغ</th>{[24, 22, 21, 18].map((k) => <th key={k}>عيار {k}</th>)}</tr></thead>
              <tbody>{[500, 1000, 2000, 5000, 10000, 20000, 50000].map((a) => <tr key={a}><td className="strong n">{fmt(a, 0)} {c.curName}</td>{[24, 22, 21, 18].map((k) => <td key={k} className="n">{fmt(a / gold(c, k), 2)} جرام</td>)}</tr>)}</tbody>
            </table>
          </div>
        </section>
      }
    >
      <R2GCalc slug={c.slug} />
    </CalcShell>
  );
}
