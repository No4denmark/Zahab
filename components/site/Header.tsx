"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BY_SLUG, COUNTRIES } from "@/lib/countries";
import { calcsFor } from "@/lib/market";
import { Flag } from "@/components/ui/Basics";
import { CalcIcon, IconBell, IconChevron, IconClose, IconMenu, IconSearch, IconUser, LogoMark } from "@/components/ui/Icons";

const KEY = "zp-country";

export function useCountrySlug() {
  const path = usePathname();
  const seg = path.split("/")[1] ?? "";
  const [stored, setStored] = useState("ar-eg");
  useEffect(() => {
    try {
      if (BY_SLUG[seg]) localStorage.setItem(KEY, seg);
      else { const s = localStorage.getItem(KEY); if (s && BY_SLUG[s]) setStored(s); }
    } catch {}
  }, [seg]);
  return BY_SLUG[seg] ? seg : stored;
}

export function Header() {
  const path = usePathname();
  const slug = useCountrySlug();
  const c = BY_SLUG[slug];
  const [pop, setPop] = useState(false);
  const [q, setQ] = useState("");
  const [mob, setMob] = useState(false);
  const popRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setPop(false); setMob(false); }, [path]);
  useEffect(() => {
    const close = (e: MouseEvent) => { if (popRef.current && !popRef.current.contains(e.target as Node)) setPop(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const list = COUNTRIES.filter((x) => !q || x.name.includes(q) || x.cur.toLowerCase().includes(q.toLowerCase()));
  const calcs = calcsFor(c);
  const on = (p: string) => (path === p ? "on" : "");

  return (
    <header className="hdr">
      <div className="container hdr-in">
        <Link href="/" className="logo" aria-label="ذهب برايس — الرئيسية">
          <span className="logo-mark"><LogoMark /></span>
          <span>ذهب <b>برايس</b></span>
        </Link>

        <nav className="nav" aria-label="القائمة الرئيسية">
          <Link className={on(`/${slug}`)} href={`/${slug}`}>أسعار الذهب</Link>
          <Link className={on(`/${slug}/silver`)} href={`/${slug}/silver`}>الفضة</Link>
          <div className="dd">
            <button className={path.includes("/calculator") ? "on" : ""} aria-haspopup="true">الحاسبات <IconChevron size={15} /></button>
            <div className="menu wide" role="menu">
              {calcs.map((x) => (
                <Link key={x.id} href={`/${slug}/calculator/${x.id}`} role="menuitem">
                  <span className="mi"><CalcIcon id={x.icon} size={20} /></span>
                  <span>{x.title}<small>{x.desc(c)}</small></span>
                </Link>
              ))}
              <Link href={`/${slug}/calculator`} role="menuitem" style={{ gridColumn: "1/-1", justifyContent: "center", fontWeight: 700, color: "var(--y-dd)" }}>كل الحاسبات ←</Link>
            </div>
          </div>
          <Link className={on(`/${slug}/exchange-rates`)} href={`/${slug}/exchange-rates`}>أسعار العملات</Link>
          <Link className={on(`/${slug}/news`)} href={`/${slug}/news`}>الأخبار</Link>
          <Link className={on("/")} href="/">جميع الدول</Link>
        </nav>

        <div className="hdr-act">
          <div style={{ position: "relative" }} ref={popRef}>
            <button className="ctry-btn" onClick={() => setPop((v) => !v)} aria-expanded={pop}>
              <Flag code={c.code} /> <span className="t">{c.name}</span> <IconChevron size={14} />
            </button>
            {pop && (
              <div className="ctry-pop">
                <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث عن دولة أو عملة…" />
                <div className="ctry-grid">
                  {list.map((x) => (
                    <Link key={x.slug} href={`/${x.slug}`} className={x.slug === slug ? "on" : ""}><Flag code={x.code} /> {x.name}<small>{x.cur}</small></Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <Link className="icon-btn" href="/my-account/login" aria-label="تنبيهات الأسعار"><IconBell size={19} /></Link>
          <Link className="icon-btn" href="/my-account/login" aria-label="حسابي"><IconUser size={19} /></Link>
          <button className="icon-btn burger" onClick={() => setMob((v) => !v)} aria-label="القائمة">{mob ? <IconClose /> : <IconMenu />}</button>
        </div>
      </div>

      <div className={`mnav${mob ? " open" : ""}`}>
        <h5>{c.name}</h5>
        <Link href={`/${slug}`}>أسعار الذهب</Link>
        <Link href={`/${slug}/silver`}>أسعار الفضة</Link>
        <Link href={`/${slug}/exchange-rates`}>أسعار العملات</Link>
        <Link href={`/${slug}/news`}>أخبار الذهب والاقتصاد</Link>
        <h5>الحاسبات</h5>
        {calcs.map((x) => <Link key={x.id} href={`/${slug}/calculator/${x.id}`}><CalcIcon id={x.icon} size={18} /> {x.title}</Link>)}
        <h5>المزيد</h5>
        <Link href="/"><IconSearch size={18} /> جميع الدول</Link>
        <Link href="/ar/about">من نحن</Link>
        <Link href="/my-account/login">تسجيل الدخول</Link>
      </div>
    </header>
  );
}
