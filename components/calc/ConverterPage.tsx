import type { Country } from "@/lib/countries";
import { fmt, KARAT_USE } from "@/lib/market";
import { CalcShell } from "./Shell";
import { ConverterCalc } from "./Converter";
import { SectionHead } from "@/components/ui/Basics";

export function ConverterPage({ c }: { c: Country }) {
  return (
    <CalcShell
      c={c} id="gold-karat-converter"
      title="حاسبة تحويل عيار الذهب — حوّل بين عيار 24 و21 و18 بدقة"
      lead="تُحوّل الوزن بين جميع العيارات (24، 23، 22، 21، 20، 19، 18، 16، 14، 12، 10، 9) بدقة، مع شرح واضح للنسب وخطوات الحساب."
      steps={[["أدخل وزن الذهب", "بالجرام أو بأي وحدة أخرى."], ["اختر العيار الأصلي", "حدد عيار الذهب الحالي."], ["اختر العيار المستهدف", "حدد العيار الذي تريد التحويل إليه."], ["اطلع على النتيجة", "الوزن المعادل مع شرح تفصيلي ونسبة التحويل."]]}
      faq={[
        ["لماذا يقل الوزن عند التحويل من عيار أقل إلى عيار أعلى؟", "لأن العيارات الأقل تحتوي على معادن أخرى (نحاس، فضة). عند التحويل للذهب الخالص نستبعد هذه المعادن فيقل الوزن."],
        ["هل يمكن تحويل الذهب فعلياً بين العيارات؟", "نعم. يمكن رفع العيار بإزالة المعادن الأخرى (صهر وتنقية)، وخفض العيار بإضافة نحاس أو فضة."],
        ["هل القيراط (العيار) وحدة وزن؟", "لا، القيراط مقياس لنقاء الذهب وليس وحدة وزن. «18 قيراط» يصف نسبة الذهب الخالص (75%) وليس الوزن."],
      ]}
      related={["gold-value", "zakat"]}
      after={
        <section className="container sec">
          <div className="grid-2">
            <div className="rv">
              <SectionHead eb="أمثلة سريعة" title="أوزان شائعة عيار 21" />
              <div className="tbl-wrap">
                <table className="tbl">
                  <thead><tr><th>الوزن (عيار 21)</th><th>المعادل بعيار 24</th><th>المعادل بعيار 18</th></tr></thead>
                  <tbody>{[10, 12, 18, 85, 150].map((w) => <tr key={w}><td className="strong">{w} جرام (21k)</td><td className="n">{fmt((w * 21) / 24, 1)} جرام</td><td className="n">{fmt((w * 21) / 18, 1)} جرام</td></tr>)}</tbody>
                </table>
              </div>
            </div>
            <div className="rv">
              <SectionHead eb="المسميات" title="جدول شرح العيارات" />
              <div className="tbl-wrap">
                <table className="tbl">
                  <thead><tr><th>العيار</th><th>نسبة النقاء</th><th>الاستخدام الشائع</th></tr></thead>
                  <tbody>{[24, 22, 21, 18, 14, 9].map((k) => <tr key={k}><td className="strong">{k}k</td><td className="n">{k === 24 ? "99.9" : ((k / 24) * 100).toFixed(1)}%</td><td style={{ whiteSpace: "normal" }}>{KARAT_USE[k]}</td></tr>)}</tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      }
    >
      <ConverterCalc slug={c.slug} />
    </CalcShell>
  );
}
