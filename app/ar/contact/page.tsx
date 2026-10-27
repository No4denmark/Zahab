import type { Metadata } from "next";
import { StaticPage } from "@/components/pages/StaticPage";
import { ContactForm } from "@/components/pages/Forms";
import { IconMail } from "@/components/ui/Icons";

export const metadata: Metadata = { title: "اتصل بنا" };

export default function Contact() {
  return (
    <StaticPage title="اتصل بنا" hl="ذهب برايس" desc="نحن هنا لمساعدتك. تواصل معنا للاستفسارات والاقتراحات والدعم الفني.">
      <div className="grid-2" style={{ alignItems: "start" }}>
        <ContactForm />
        <div className="fields">
          <div className="card">
            <h3>معلومات الاتصال</h3>
            <p>يمكنك مراسلتنا عبر البريد الإلكتروني وسنرد عليك في أقرب وقت ممكن.</p>
            <a href="mailto:info@zahabprice.com" className="btn btn-dark" style={{ marginTop: 14 }}><IconMail size={18} /> info@zahabprice.com</a>
            <p style={{ marginTop: 12 }}><span className="badge ok">نرد خلال 24 ساعة</span></p>
          </div>
          <div className="box"><b>ملاحظة مهمة:</b> ذهب برايس موقع معلوماتي فقط — لا نبيع أو نشتري الذهب ولا نقدم استشارات مالية.</div>
        </div>
      </div>
    </StaticPage>
  );
}
