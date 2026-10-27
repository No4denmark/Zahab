import Link from "next/link";
import type { Country } from "@/lib/countries";
import { BellArt, CalcArt, GlobeArt, PhoneArt } from "./Art";
import { NewsletterForm } from "./Live";

export function CalcBanner({ c }: { c: Country }) {
  return (
    <section className="container sec">
      <div className="banner banner-y rv">
        <div>
          <span className="badge dk">مجانية 100% · بدون تسجيل</span>
          <h3 style={{ marginTop: 14 }}>احسب قيمة ذهبك في ثوانٍ</h3>
          <p>حاسبات البيع والشراء والزكاة وتحويل العيارات بأسعار {c.name} اللحظية بالـ{c.curName}.</p>
          <div className="acts">
            <Link className="btn btn-dark" href={`/${c.slug}/calculator`}>كل الحاسبات ←</Link>
            <Link className="btn btn-ghost" href={`/${c.slug}/calculator/zakat`}>حاسبة الزكاة</Link>
          </div>
        </div>
        <div className="banner-art"><CalcArt /></div>
      </div>
    </section>
  );
}

export function AlertsBanner() {
  return (
    <section className="container sec">
      <div className="grid-2 rv">
        <div className="banner banner-dark" style={{ gridTemplateColumns: "1fr", padding: 34 }}>
          <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ width: 130 }}><BellArt /></div>
            <div style={{ flex: 1, minWidth: 220 }}>
              <h3 style={{ fontSize: 24 }}>تنبيهات الأسعار</h3>
              <p>فعّل الإشعارات واستقبل تنبيهاً فورياً لحظة وصول السعر للهدف الذي حددته.</p>
              <div className="acts"><Link className="btn btn-y btn-sm" href="/my-account/login">فعّل التنبيه</Link></div>
            </div>
          </div>
        </div>
        <div className="banner banner-y" style={{ gridTemplateColumns: "1fr", padding: 34 }}>
          <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ width: 120 }}><PhoneArt /></div>
            <div style={{ flex: 1, minWidth: 220 }}>
              <span className="badge dk">قريباً</span>
              <h3 style={{ fontSize: 24, marginTop: 8 }}>تطبيق ذهب برايس للجوال</h3>
              <p>الأسعار اللحظية والحاسبات والتنبيهات في جيبك.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function NewsletterBanner() {
  return (
    <section className="container sec">
      <div className="banner banner-dark rv">
        <div>
          <h3>تابع أسعار الذهب لحظة بلحظة</h3>
          <p>اشترك في النشرة البريدية لتصلك تحديثات الأسعار وتحليلات سوق الذهب وأهم الأخبار.</p>
          <div className="acts"><NewsletterForm dark /></div>
        </div>
        <div className="banner-art"><GlobeArt /></div>
      </div>
    </section>
  );
}
