import type { Metadata } from "next";
import { countryParamsWith, resolveCountry, type CParams } from "@/lib/params";
import { fmt, perInstallment } from "@/lib/market";
import { CalcShell } from "@/components/calc/Shell";
import { InstallmentCalc } from "@/components/calc/Installment";
import { SectionHead } from "@/components/ui/Basics";

export const dynamicParams = false;
export const generateStaticParams = () => countryParamsWith("installment");
export const metadata: Metadata = { title: "حاسبة تقسيط تابي وتمارا - احسب القسط الشهري مجاناً" };

export default async function Page({ params }: CParams) {
  const c = await resolveCountry(params, "installment");
  return (
    <CalcShell
      c={c} id="installment"
      title="حاسبة تقسيط تابي وتمارا"
      lead="احسب قيمة القسط الشهري بدقة، قارن رسوم تابي وتمارا، واعرف التكلفة الحقيقية قبل شراء الذهب أو أي منتج بالتقسيط."
      steps={[
        ["اختر مزود خدمة التقسيط", "تابي (Tabby) أو تمارا (Tamara) حسب توفر الخدمة في المتجر."],
        ["أدخل سعر المنتج", `اكتب سعر المنتج أو اختر سبيكة ذهب بالـ${c.curName}.`],
        ["اختر عدد الأقساط", "تمارا: 2-4 أقساط بدون رسوم، 6-12 برسوم 17%. تابي: 3 أقساط مجاناً، 4 و6 برسوم 1.15% إجمالاً."],
        ["راجع تفاصيل الأقساط", "القسط الشهري وإجمالي الرسوم والمبلغ الكلي مع جدول الدفعات."],
      ]}
      faq={[
        ["كم رسوم تمارا على التقسيط؟", "تمارا بدون رسوم على 2-4 أقساط. للأقساط الطويلة (6-12 شهراً) تُضاف رسوم خدمة 17%، وللخطة الممتدة (24 شهراً) ترتفع الرسوم إلى 40% من إجمالي المبلغ."],
        ["كم رسوم معالجة تابي على 4 أقساط؟", "تابي تفرض رسوم معالجة بإجمالي 1.15% من قيمة الشراء على 4 أو 6 أقساط، تُقسَّم بالتساوي. أما 3 أقساط فمجانية تماماً."],
      ]}
      related={["gold/buy", "gold-value"]}
      after={
        <section className="container sec">
          <SectionHead eb="مقارنة سريعة" title="القسط الشهري لمبالغ شائعة (4 أقساط)" />
          <div className="tbl-wrap rv">
            <table className="tbl">
              <thead><tr><th>قيمة المنتج</th><th>tabby (4 أقساط)</th><th>tamara (4 أقساط)</th></tr></thead>
              <tbody>{[500, 1000, 2000, 5000, 10000].map((a) => (
                <tr key={a}><td className="strong n">{fmt(a, 0)} {c.curName}</td><td className="n">{fmt(perInstallment(a, "tabby", 4))} {c.curName}/شهر</td><td className="n gold">{fmt(perInstallment(a, "tamara", 4))} {c.curName}/شهر</td></tr>
              ))}</tbody>
            </table>
          </div>
        </section>
      }
    >
      <InstallmentCalc slug={c.slug} />
    </CalcShell>
  );
}
