import type { Metadata } from "next";
import Link from "next/link";
import { StaticPage } from "@/components/pages/StaticPage";
import { GoldStackArt } from "@/components/ui/Art";
import { IconBell, IconBolt, IconCoins, IconMail } from "@/components/ui/Icons";
import { CalcIcon } from "@/components/ui/Icons";

export const metadata: Metadata = { title: "من نحن", description: "ذهب برايس — موقع معلوماتي متخصص في أسعار الذهب في الدول العربية وأوروبا وأمريكا، تحديث كل دقيقة." };

const OFFER: [React.ReactNode, string, string, string?][] = [
  [<IconCoins key="a" />, "أسعار الذهب والفضة لحظياً", "أسعار محدثة كل دقيقة لجميع العيارات والسبائك في 37 دولة بعملتها المحلية."],
  [<IconBolt key="b" />, "تحديث فوري عبر WebSocket", "السعر يتحرك أمامك مباشرة دون الحاجة لتحديث الصفحة يدوياً."],
  [<CalcIcon key="d" id="value" size={20} />, "حاسبة الذهب", "لمعرفة قيمة مشغولاتك الذهبية بدقة بناءً على أحدث الأسعار.", "/ar-eg/calculator/gold-value"],
  [<CalcIcon key="e" id="zakat" size={20} />, "حاسبة الزكاة", "لحساب الزكاة بدقة بناءً على النصاب الشرعي وأحدث الأسعار.", "/ar-eg/calculator/zakat"],
  [<IconBell key="f" />, "تنبيهات الأسعار", "استقبل تنبيهاً فورياً لحظة وصول السعر للهدف الذي حددته.", "/my-account/login"],
  [<IconMail key="g" />, "النشرة البريدية", "آخر تحديثات وتحليلات سوق الذهب على بريدك."],
];

export default function About() {
  return (
    <StaticPage title="من نحن" hl="ذهب برايس" desc="موقع معلوماتي متخصص في أسعار الذهب في الدول العربية وأوروبا وأمريكا — تأسسنا في مايو 2025، وكل سعر تراه هنا عمره لا يتجاوز 60 ثانية." art={<GoldStackArt />}>
      <h2>كيف نكسب المال</h2>
      <p>الشفافية حول تمويل الموقع جزء أساسي من الثقة عندنا، بنفس أهمية دقة الأسعار. الموقع مجاني بالكامل لجميع الزوار — لا رسوم اشتراك ولا حاجة لإنشاء حساب لعرض الأسعار أو استخدام الحاسبات.</p>
      <p>نعتمد على إعلانات غير متطفلة عبر شبكات معلنين معتمدة (Google AdSense) كمصدر التمويل الوحيد لتغطية تكاليف التشغيل. <Link href="/ar/privacy" style={{ color: "var(--y-dd)", fontWeight: 700 }}>لا نبيع بيانات المستخدمين</Link>، ولا نستقبل عمولة من أي جهة بيع أو شراء ذهب، ولا نروّج لمنتج مالي بعينه.</p>

      <h2>من أين تأتي أسعارنا؟</h2>
      <p>أسعارنا كلها من مصدر واحد موثّق: نجلبها مباشرة من Metal Price API، من غير أي تدخل بشري في الأرقام أو تقريب يدوي. نحدّث الأسعار كل دقيقة، لكل عيار وسبيكة، في 37 دولة بعملتها المحلية. ومنهجية حساب كل سعر موثّقة في <Link href="/ar/methodology" style={{ color: "var(--y-dd)", fontWeight: 700 }}>صفحة منهجيتنا</Link>.</p>

      <h2>ما نقدمه</h2>
      <div className="grid-2" style={{ marginTop: 10 }}>
        {OFFER.map(([ic, t, d, href]) => {
          const inner = <><span className="ci" style={{ width: 44, height: 44, borderRadius: 13 }}>{ic}</span><h3>{t}</h3><p>{d}</p>{href && <span className="go">افتح ←</span>}</>;
          return href ? <Link key={t} href={href} className="calc-card">{inner}</Link> : <div key={t} className="calc-card">{inner}</div>;
        })}
      </div>

      <h2>رؤيتنا</h2>
      <p>أن نكون المصدر الأول والأكثر موثوقية لمعلومات أسعار الذهب، من خلال توفير بيانات لحظية دقيقة لا تعتمد على وسيط أو تأخير — سواء كنت فرداً يريد تقييم مشغولاته أو حساب زكاته، أو تاجراً يحتاج مرجعاً سريعاً.</p>
      <h2>رسالتنا</h2>
      <p>نلتزم بتقديم معلومات دقيقة وشفافة، ونوسّع دورنا تدريجياً ليشمل محتوى تعليمياً يرفع وعي المتابعين بسوق الذهب وآليات تسعيره. والموقع في تطور مستمر: مقالات دورية، وتطبيق جوال قريباً.</p>
      <div className="box">للتواصل: <a href="mailto:info@zahabprice.com" style={{ fontWeight: 700 }}>info@zahabprice.com</a> أو عبر <Link href="/ar/contact" style={{ color: "var(--y-dd)", fontWeight: 700 }}>نموذج التواصل</Link>.</div>
    </StaticPage>
  );
}
