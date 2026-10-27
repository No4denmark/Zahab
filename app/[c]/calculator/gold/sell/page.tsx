import type { Metadata } from "next";
import { countryParamsWith, resolveCountry, type CParams } from "@/lib/params";
import { getCountry } from "@/lib/countries";
import { fmt, money } from "@/lib/market";
import { CalcShell } from "@/components/calc/Shell";
import { SellCalc } from "@/components/calc/Sell";
import { SectionHead } from "@/components/ui/Basics";

export const dynamicParams = false;
export const generateStaticParams = () => countryParamsWith("gold/sell");
export async function generateMetadata({ params }: CParams): Promise<Metadata> {
  const c = getCountry((await params).c);
  return c ? { title: c.cashback ? `حاسبة سعر بيع السبائك الذهبية مع الكاش باك في ${c.name}` : `حاسبة سعر بيع الذهب المستعمل في ${c.name}` } : {};
}

const CB_ROWS: [string, number, number][] = [["0.25 جرام (ربع)", 0.25, 28], ["1 جرام", 1, 28], ["5 جرام", 5, 28], ["10 جرام", 10, 28], ["31.1 جرام (أونصة)", 31.1, 28], ["50 جرام", 50, 28], ["100 جرام", 100, 28], ["250 جرام", 250, 12], ["500 جرام", 500, 12], ["1,000 جرام (كيلو)", 1000, 12]];

export default async function Page({ params }: CParams) {
  const c = await resolveCountry(params, "gold/sell");
  const d = c.sell!.d;
  const g24 = Math.round(c.g24);
  const cashback = c.cashback ? (
    <>
      <section className="container sec">
        <SectionHead eb="ميزة فريدة في السوق المصري" title="ما هو الكاش باك (Cash Back) عند بيع السبائك؟"
          desc="بدلاً من خصم مبلغ من سعر الذهب (كما يحدث مع المجوهرات المستعملة)، تحصل عند بيع السبائك على مبلغ إضافي يُضاف إلى سعر الذهب الخام." />
        <div className="cmp rv">
          <div className="card loss">
            <span className="badge no">مجوهرات مستعملة</span>
            <div className="ln" style={{ marginTop: 12 }}><span>سعر الذهب</span><b className="n">{fmt(g24, 0)} جنيه/جرام</b></div>
            <div className="ln"><span>الخصم</span><b className="n down">− 80 جنيه/جرام</b></div>
            <div className="ln"><span>السعر النهائي</span><b className="n">{fmt(g24 - 80, 0)} جنيه</b></div>
            <span className="tag-big down">خسارة!</span>
          </div>
          <div className="card win">
            <span className="badge ok">سبيكة ذهب (عيار 24)</span>
            <div className="ln" style={{ marginTop: 12 }}><span>سعر الذهب</span><b className="n">{fmt(g24, 0)} جنيه/جرام</b></div>
            <div className="ln"><span>كاش باك</span><b className="n up">+ 28 جنيه/جرام</b></div>
            <div className="ln"><span>السعر النهائي</span><b className="n">{fmt(g24 + 28, 0)} جنيه</b></div>
            <span className="tag-big up">ربح إضافي!</span>
          </div>
        </div>
      </section>
      <section className="container sec">
        <SectionHead eb="جدول الكاش باك" title="كم قيمة الكاش باك حسب وزن السبيكة؟" desc="كلما زاد وزن السبيكة حتى 100 جرام ثبت الكاش باك عند 28 جنيه/جرام، وأكبر من 100 جرام يصبح أقل. السبائك بدون غلاف: 11 جنيه/جرام لجميع الأوزان." />
        <div className="tbl-wrap rv">
          <table className="tbl">
            <thead><tr><th>وزن السبيكة</th><th>كاش باك مغلفة</th><th>كاش باك بدون غلاف</th><th>المجموع (مغلفة)</th></tr></thead>
            <tbody>{CB_ROWS.map(([l, g, r]) => <tr key={l}><td className="strong">{l}</td><td>{r} جنيه/جرام</td><td>11 جنيه/جرام</td><td className="gold n">+{fmt(Math.max(r, g * r), 0)} جنيه</td></tr>)}</tbody>
          </table>
        </div>
        <p className="note rv"><span>* القيم تقريبية وتختلف حسب المحل والشركة. استخدم الحاسبة أعلاه لمعرفة السعر الدقيق.</span></p>
      </section>
    </>
  ) : null;

  return (
    <CalcShell
      c={c} id="gold/sell"
      title={c.cashback ? <>حاسبة سعر بيع الذهب والسبائك مع الكاش باك في {c.name}</> : <>حاسبة سعر بيع الذهب المستعمل في {c.name}</>}
      lead={`احسب قيمة بيع ذهبك المستعمل${c.cashback ? " أو سبائكك مع الكاش باك" : ""} بدقة — الخصم المعتاد بين ${d[0]}-${d[2]} ${c.curName}/جرام حسب الحالة.`}
      steps={[["اختر عيار الذهب", "حدد عيار القطعة المراد بيعها أو اختر السبيكة."], ["أدخل الوزن", "بالجرام أو المثقال أو الأونصة."], ["احصل على السعر الفوري", "تظهر قيمة الذهب فوراً مع تفاصيل الخصم."], ["قارن واتخذ القرار", "استخدم النتيجة لمقارنة عروض المحلات."]]}
      faq={[
        ["كم نسبة الخصم المعتادة عند بيع الذهب المستعمل؟", `تتراوح بين ${d[0]}-${d[2]} ${c.curName}/جرام حسب الحالة: ممتازة (${d[0]} ${c.curName})، جيدة (${d[1]} ${c.curName})، عادية (${d[2]} ${c.curName}).`],
        ["لماذا سعر البيع أقل من السعر الخام؟", "لتغطية تكاليف الفحص والتنظيف وإعادة التصنيع، إضافة إلى هامش التاجر."],
        ...(c.cashback ? [
          ["ما هو الكاش باك عند بيع السبائك في مصر؟", "مكافأة مالية تُضاف إلى سعر الذهب الخام عند بيع السبائك، بدلاً من الخصم المطبق على المجوهرات."],
          ["كم قيمة الكاش باك عند بيع سبائك الذهب في مصر؟", "السبائك المغلفة من ربع جرام إلى 100 جرام: 28 جنيه/جرام، وأكبر من 100 جرام: 12 جنيه/جرام. بدون غلاف: 11 جنيه/جرام لجميع الأوزان. احتفظ بالغلاف الأصلي!"],
        ] as [string, string][] : []),
      ]}
      related={["gold-value", "gold-karat-converter", "gold/buy"]}
      after={cashback}
    >
      <SellCalc slug={c.slug} />
      <p className="note rv"><span>سعر عيار 24 المعتمد الآن: <b className="n">{money(c, c.g24)}</b> {c.curName}/جرام.</span></p>
    </CalcShell>
  );
}
