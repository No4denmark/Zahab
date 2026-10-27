import type { Metadata } from "next";
import { allCountryParams, resolveCountry, type CParams } from "@/lib/params";
import { getCountry } from "@/lib/countries";
import { money, NISAB } from "@/lib/market";
import { CalcShell } from "@/components/calc/Shell";
import { ZakatCalc } from "@/components/calc/Zakat";
import { SectionHead } from "@/components/ui/Basics";

export const dynamicParams = false;
export const generateStaticParams = allCountryParams;
export async function generateMetadata({ params }: CParams): Promise<Metadata> {
  const c = getCountry((await params).c);
  return c ? { title: `حاسبة زكاة الذهب في ${c.name} - حساب دقيق وفوري للنصاب الشرعي` } : {};
}

const CONDITIONS: [string, string][] = [
  ["بلوغ النصاب الشرعي", "85 جراماً من الذهب الخالص (عيار 24) أو ما يعادلها: نحو 92.7 جرام من عيار 22، أو 97.1 جرام من عيار 21."],
  ["حولان الحول", "مرور سنة هجرية كاملة (354 يوماً) على امتلاك النصاب بشكل متواصل."],
  ["الملكية التامة", "أن يكون الذهب مملوكاً ملكية تامة، غير مرهون ولا مديون به."],
  ["الفائض عن الحاجة", "أن يكون مدخراً أو مقتنى للزينة الفائضة عن الحاجة (مع خلاف فقهي حول المجوهرات المستعملة فعلياً)."],
];

export default async function Page({ params }: CParams) {
  const c = await resolveCountry(params);
  return (
    <CalcShell
      c={c} id="zakat"
      title={<>حاسبة زكاة الذهب في {c.name}</>}
      lead={`احسب زكاة ذهبك بدقة وفق الشريعة الإسلامية — النصاب 85 جرام عيار 24 (قيمته الآن ${money(c, NISAB * c.g24)} ${c.curName}) ونسبة 2.5%.`}
      steps={[["أدخل وزن الذهب", "أدخل وزن ذهبك مع تحديد العيار، وأضف أكثر من قطعة."], ["احسب النصاب", "تتحقق الحاسبة إن كان ذهبك بلغ النصاب الشرعي (85 جرام خالص)."], ["اعرف مبلغ الزكاة", `تظهر قيمة الزكاة الواجبة بالـ${c.curName} وموعد استحقاقها.`]]}
      faq={[
        ["هل تجب الزكاة على الذهب المستعمل (المجوهرات)؟", "هناك خلاف فقهي: الجمهور يرى وجوب الزكاة على الذهب المدخر، وبعض العلماء يعفي المجوهرات المستعملة فعلاً."],
        ["هل أزكي على قيمة الذهب أم وزنه؟", "الزكاة تُحسب على القيمة الحالية للذهب في السوق، ويُستحسن دفعها نقداً بسعر اليوم."],
        ["هل يُجمع ذهب الزوجة مع ذهب الزوج لحساب النصاب؟", "لا، كل شخص يُحاسب على ذهبه منفرداً. ذهب الزوجة ملكها وزكاتها مستقلة."],
        ["هل تسقط الزكاة إذا كان علي دين؟", "بعض العلماء يرون أن الديون تُطرح من الأصول قبل حساب النصاب، وهو الرأي المعتمد لدى كثير من المفتين."],
        ["هل يمكنني دفع زكاة الذهب ذهباً وليس نقداً؟", "نعم، يمكن دفعها ذهباً (2.5% من الوزن)، لكن الأيسر عادةً دفعها نقداً بسعر اليوم."],
        ["هل توجد زكاة على الذهب الذي اشتريته للتجارة؟", "نعم، ذهب التجارة يُزكى زكاة عروض التجارة، وهي 2.5% من قيمته السوقية."],
        ["متى يبدأ حساب الحول للذهب؟", "يبدأ الحول من اليوم الذي بلغ فيه ذهبك النصاب (85 جرام ذهب خالص) للمرة الأولى."],
      ]}
      related={["gold-value", "gold-karat-converter"]}
      after={
        <section className="container sec">
          <SectionHead eb="الشروط" title="متى تجب زكاة الذهب؟" desc="تجب زكاة الذهب على المسلم بتحقق أربعة شروط مجتمعة، ونسبتها 2.5% من القيمة الإجمالية بسعر يوم الإخراج." />
          <div className="grid-4 rv">
            {CONDITIONS.map(([t, d], i) => (
              <div key={t} className={`card kcard${i === 0 ? " on" : ""}`}>
                <span className="badge">{i + 1}</span>
                <h3 style={{ marginTop: 12 }}>{t}</h3>
                <p style={{ fontSize: 14.5 }}>{d}</p>
              </div>
            ))}
          </div>
        </section>
      }
    >
      <ZakatCalc slug={c.slug} />
    </CalcShell>
  );
}
