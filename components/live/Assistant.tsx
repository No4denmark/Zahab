"use client";
import { useEffect, useRef, useState } from "react";
import { useCountrySlug } from "@/components/site/Header";
import { useCountry, useLive } from "./LiveProvider";
import { IconClose, IconSpark } from "@/components/ui/Icons";
import { barGrams, fmt, gold, money } from "@/lib/market";

type Msg = { role: "user" | "assistant"; content: string; suggestions?: string[] };
const STORE = "zp-chat";

/** Open the assistant from anywhere, optionally with a question to send right away. */
export const askAssistant = (q?: string) => window.dispatchEvent(new CustomEvent("zp-ask", { detail: q }));

export function AssistantWidget() {
  const slug = useCountrySlug();
  const c = useCountry(slug);
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const list = useRef<HTMLDivElement>(null);

  const starters = [`سعر عيار 21 في ${c.name}`, `كم جرام بـ 10,000 ${c.curName}؟`, "زكاة 100 جرام عيار 21", `بيع 20 جرام عيار 21 مستعمل`, `سعر الفضة 925 في ${c.name}`];

  useEffect(() => {
    try { const s = sessionStorage.getItem(STORE); if (s) setMsgs(JSON.parse(s)); } catch {}
  }, []);
  useEffect(() => {
    try { sessionStorage.setItem(STORE, JSON.stringify(msgs.slice(-30))); } catch {}
    list.current?.scrollTo({ top: list.current.scrollHeight, behavior: "smooth" });
  }, [msgs, busy]);

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || busy) return;
    const next: Msg[] = [...msgs, { role: "user", content: q }];
    setMsgs(next); setInput(""); setBusy(true);
    try {
      const r = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: slug, messages: next.map(({ role, content }) => ({ role, content })) }),
      });
      const j = await r.json();
      setMsgs([...next, { role: "assistant", content: j.text ?? "تعذّر الرد الآن، حاول مرة أخرى.", suggestions: j.suggestions }]);
    } catch {
      setMsgs([...next, { role: "assistant", content: "تعذّر الاتصال الآن، تأكد من الإنترنت وحاول مرة أخرى." }]);
    } finally { setBusy(false); }
  };

  useEffect(() => {
    const h = (e: Event) => { setOpen(true); const q = (e as CustomEvent<string | undefined>).detail; if (q) send(q); };
    window.addEventListener("zp-ask", h);
    return () => window.removeEventListener("zp-ask", h);
  });
  useEffect(() => { document.documentElement.classList.toggle("chat-open", open); }, [open]);

  const lastSugg = [...msgs].reverse().find((m) => m.role === "assistant")?.suggestions;

  return (
    <>
      <button className="ai-fab" onClick={() => setOpen(true)} aria-label="افتح مساعد ذهب برايس" hidden={open}>
        <IconSpark size={22} /><span>اسأل المساعد</span>
      </button>
      {open && (
        <div className="ai-sheet" role="dialog" aria-label="مساعد ذهب برايس">
          <div className="ai-head">
            <span className="ai-av"><IconSpark size={20} /></span>
            <div style={{ flex: 1 }}><b>مساعد ذهب برايس</b><small>أسعار لحظية · {c.name}</small></div>
            {msgs.length > 0 && <button className="ai-x" onClick={() => setMsgs([])} aria-label="محادثة جديدة" style={{ width: "auto", padding: "0 10px", fontSize: 12.5 }}>جديدة</button>}
            <button className="ai-x" onClick={() => setOpen(false)} aria-label="إغلاق"><IconClose size={18} /></button>
          </div>
          <div className="ai-body" ref={list}>
            {msgs.length === 0 && (
              <div className="ai-hello">
                <b>أهلاً 👋</b>
                <p>اسألني عن سعر الذهب أو الفضة في أي دولة، أو احسب قيمة ذهبك وزكاته وتكلفة الشراء أو البيع.</p>
              </div>
            )}
            {msgs.map((m, i) => <div key={i} className={`ai-msg ${m.role}`}>{m.content}</div>)}
            {busy && <div className="ai-msg assistant typing"><i /><i /><i /></div>}
          </div>
          <div className="ai-sugg">
            {(lastSugg?.length ? lastSugg : starters).map((s) => <button key={s} onClick={() => send(s)} disabled={busy}>{s}</button>)}
          </div>
          <form className="ai-input" onSubmit={(e) => { e.preventDefault(); send(input); }}>
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="اكتب سؤالك…" maxLength={500} enterKeyHint="send" aria-label="سؤالك" />
            <button className="btn btn-dark" disabled={busy || !input.trim()} aria-label="إرسال">إرسال</button>
          </form>
          <p className="ai-note">معلومات استرشادية وليست نصيحة مالية.</p>
        </div>
      )}
    </>
  );
}

/** Data-driven tips for a country page, each with a one-tap question for the assistant. */
export function SmartTips({ slug }: { slug: string }) {
  const c = useCountry(slug);
  const live = useLive();
  const bars = c.bars.filter(([n, k]) => k === 24 && /^\d|كيلو/.test(n));
  const small = bars[0], big = bars[bars.length - 1];
  const save = small && big ? (1 - big[2] / barGrams(big[0]) / (small[2] / barGrams(small[0]))) * 100 : 0;
  const k = c.karats.includes(21) ? 21 : c.karats[1];
  const tips = [
    live?.marketOpen === false
      ? { t: "السوق العالمي مغلق الآن", d: "الأسعار المعروضة هي آخر سعر إغلاق وستتحرك مع افتتاح السوق.", q: `ما سعر الأونصة عالمياً الآن؟` }
      : { t: "السوق مفتوح الآن", d: "الأسعار تتحدث تلقائياً كل دقيقة على هذه الصفحة.", q: `سعر عيار ${k} في ${c.name}` },
    save > 0.5 ? { t: `السبيكة الكبيرة أوفر بـ ${fmt(save, 1)}%`, d: `سعر الجرام في ${big[0].replace(/\s*\(.*\)/, "")} أقل منه في ${small[0]}.`, q: `كم جرام بـ 50,000 ${c.curName}؟` } : null,
    { t: `عيار ${k} = ${fmt((k / 24) * 100, 1)}% ذهب خالص`, d: `10 جرام عيار ${k} تساوي ${money(c, gold(c, k) * 10)} ${c.curName} خام.`, q: `قيمة 10 جرام عيار ${k}` },
    { t: "هل بلغ ذهبك النصاب؟", d: `النصاب 85 جرام خالص ≈ ${money(c, 85 * c.g24, 0)} ${c.curName} الآن.`, q: "زكاة 100 جرام عيار 21" },
  ].filter(Boolean) as { t: string; d: string; q: string }[];

  return (
    <div className="tips rv">
      {tips.map((x) => (
        <button key={x.t} className="tip" onClick={() => askAssistant(x.q)}>
          <b>{x.t}</b><span>{x.d}</span><em>اسأل المساعد ←</em>
        </button>
      ))}
    </div>
  );
}

/** Sticky summary of a calculator's result on phones, until the full result card scrolls into view. */
export function MobileResultBar() {
  const [state, setState] = useState<{ label: string; value: string; hidden: boolean }>({ label: "", value: "", hidden: true });
  useEffect(() => {
    const card = document.querySelector(".calc-wrap .result");
    if (!card) return;
    const read = () => {
      const label = card.querySelector(".lab")?.textContent ?? "";
      const value = card.querySelector(".big")?.textContent ?? "";
      setState((s) => ({ ...s, label, value }));
    };
    read();
    const mo = new MutationObserver(read);
    mo.observe(card, { subtree: true, childList: true, characterData: true });
    const io = new IntersectionObserver(([e]) => setState((s) => ({ ...s, hidden: e.isIntersecting })), { threshold: 0.25 });
    io.observe(card);
    return () => { mo.disconnect(); io.disconnect(); };
  }, []);
  const show = !!state.value && !state.hidden;
  useEffect(() => { document.documentElement.classList.toggle("rb-on", show); return () => document.documentElement.classList.remove("rb-on"); }, [show]);
  if (!state.value) return null;
  return (
    <button className={`rbar${show ? " show" : ""}`} onClick={() => document.querySelector(".calc-wrap .result")?.scrollIntoView({ behavior: "smooth", block: "center" })}>
      <small>{state.label}</small><b>{state.value}</b><span>عرض التفاصيل ↓</span>
    </button>
  );
}
