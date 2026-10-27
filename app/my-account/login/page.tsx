import type { Metadata } from "next";
import { LoginForm } from "@/components/pages/Forms";
import { BellArt } from "@/components/ui/Art";
import { IconBell, IconMail, IconShield } from "@/components/ui/Icons";
import { CalcIcon } from "@/components/ui/Icons";

export const metadata: Metadata = { title: "تسجيل الدخول", robots: { index: false } };

export default function Login() {
  return (
    <main>
      <section className="hero">
        <div className="container hero-in">
          <div>
            <span className="kicker">حسابي في ذهب برايس</span>
            <h1>تنبيهات أسعار <span className="hl">ذكية</span> وحساباتك محفوظة</h1>
            <ul style={{ listStyle: "none", display: "grid", gap: 14, marginTop: 20, color: "var(--ink-3)", fontSize: 16 }}>
              <li style={{ display: "flex", gap: 12 }}><IconBell /> تنبيه فوري لحظة وصول السعر لهدفك</li>
              <li style={{ display: "flex", gap: 12 }}><CalcIcon id="zakat" size={22} /> احفظ حسابات الزكاة وقيمة الذهب واسترجعها</li>
              <li style={{ display: "flex", gap: 12 }}><IconMail /> ملخصات وتحليلات السوق على بريدك</li>
              <li style={{ display: "flex", gap: 12 }}><IconShield /> لا نبيع بياناتك — أبداً</li>
            </ul>
            <div style={{ maxWidth: 220, marginTop: 20 }}><BellArt /></div>
          </div>
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
