"use client";
import Link from "next/link";
import { useState } from "react";
import { Field } from "@/components/calc/Fields";

/** UI only — wire to the real backend before launch. */
export function ContactForm() {
  const [sent, setSent] = useState(false);
  if (sent) return <div className="box">✓ تم استلام رسالتك (واجهة تجريبية — اربط النموذج بالخادم لإرسالها فعلياً). نرد خلال 24 ساعة.</div>;
  return (
    <form className="panel fields" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
      <h3>أرسل لنا رسالة</h3>
      <div className="row2">
        <Field label="الاسم الكامل *"><input required /></Field>
        <Field label="البريد الإلكتروني *"><input type="email" required /></Field>
      </div>
      <Field label="الموضوع *"><input required /></Field>
      <Field label="الرسالة *"><textarea required /></Field>
      <button className="btn btn-y">إرسال الرسالة</button>
    </form>
  );
}

/** UI only — authentication is not implemented in this redesign. */
export function LoginForm() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [note, setNote] = useState(false);
  return (
    <form className="panel fields" onSubmit={(e) => { e.preventDefault(); setNote(true); }}>
      <div className="seg">
        <button type="button" className={mode === "in" ? "on" : ""} onClick={() => setMode("in")}>تسجيل الدخول</button>
        <button type="button" className={mode === "up" ? "on" : ""} onClick={() => setMode("up")}>حساب جديد</button>
      </div>
      {mode === "up" && <Field label="الاسم"><input /></Field>}
      <Field label="البريد الإلكتروني"><input type="email" required autoComplete="email" /></Field>
      <Field label="كلمة المرور"><input type="password" required autoComplete={mode === "in" ? "current-password" : "new-password"} /></Field>
      <button className="btn btn-y">{mode === "in" ? "دخول" : "إنشاء الحساب"}</button>
      {note && <div className="note" style={{ marginTop: 0 }}><span>واجهة تجريبية — نظام الحسابات غير مربوط في هذه النسخة.</span></div>}
      <p style={{ fontSize: 13, color: "var(--mute)" }}>بالمتابعة أنت توافق على <Link href="/ar/terms" style={{ color: "var(--y-dd)" }}>شروط الاستخدام</Link> و<Link href="/ar/privacy" style={{ color: "var(--y-dd)" }}>سياسة الخصوصية</Link>.</p>
    </form>
  );
}
