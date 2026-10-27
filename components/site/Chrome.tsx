import Link from "next/link";
import { COUNTRIES } from "@/lib/countries";
import { Flag } from "@/components/ui/Basics";
import { LogoMark } from "@/components/ui/Icons";

export function Footer() {
  return (
    <footer className="ftr">
      <div className="container">
        <div className="ftr-top">
          <div>
            <Link href="/" className="logo"><span className="logo-mark"><LogoMark /></span><span>ذهب <b style={{ color: "var(--y)" }}>برايس</b></span></Link>
            <p style={{ fontSize: 14.5, maxWidth: 340 }}>موقع معلوماتي متخصص في أسعار الذهب والفضة في الدول العربية وأوروبا وأمريكا — كل سعر تراه هنا عمره لا يتجاوز 60 ثانية.</p>
          </div>
          <div>
            <h4>الأسعار</h4>
            <Link href="/">أسعار الذهب في جميع الدول</Link>
            <Link href="/ar-eg">سعر الذهب في مصر</Link>
            <Link href="/ar-sa">سعر الذهب في السعودية</Link>
            <Link href="/ar-ae">سعر الذهب في الإمارات</Link>
            <Link href="/ar-eg/silver">أسعار الفضة</Link>
            <Link href="/ar-eg/exchange-rates">أسعار صرف العملات</Link>
            <Link href="/ar-eg/news">أخبار الذهب والاقتصاد</Link>
          </div>
          <div>
            <h4>الحاسبات</h4>
            <Link href="/ar-eg/calculator/gold-value">حاسبة قيمة الذهب</Link>
            <Link href="/ar-eg/calculator/gold/sell">حاسبة بيع الذهب</Link>
            <Link href="/ar-eg/calculator/gold/buy">حاسبة شراء الذهب</Link>
            <Link href="/ar-eg/calculator/zakat">حاسبة الزكاة</Link>
            <Link href="/ar/calculator/gold-karat-converter">محول العيارات</Link>
            <Link href="/ar-sa/calculator/installment">حاسبة تقسيط تابي وتمارا</Link>
          </div>
          <div>
            <h4>ذهب برايس</h4>
            <Link href="/ar/about">من نحن</Link>
            <Link href="/ar/methodology">منهجيتنا</Link>
            <Link href="/ar/contact">اتصل بنا</Link>
            <Link href="/ar/privacy">سياسة الخصوصية</Link>
            <Link href="/ar/terms">شروط الاستخدام</Link>
            <Link href="/ar/disclaimer">إخلاء المسؤولية</Link>
          </div>
        </div>
        <div className="ftr-ctys">
          {COUNTRIES.map((c) => <Link key={c.slug} href={`/${c.slug}`}><Flag code={c.code} /> {c.name}</Link>)}
        </div>
        <div className="ftr-bot">
          <span>تنويه: الأسعار المعروضة للإشعار العام فقط. يُنصح بالتحقق من الأسعار مع محلات الذهب المعتمدة.</span>
          <span>© 2026 ذهب برايس · تصميم وبرمجة مصطفى محمد</span>
        </div>
      </div>
    </footer>
  );
}
