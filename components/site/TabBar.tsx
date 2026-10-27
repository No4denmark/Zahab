"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCountrySlug } from "./Header";
import { CalcIcon, IconCoins, IconExchange, IconGlobe, IconSilver } from "@/components/ui/Icons";

/** Native-style bottom navigation shown on phones and inside the mobile app's WebView. */
export function TabBar() {
  const path = usePathname();
  const slug = useCountrySlug();
  const tabs = [
    { href: `/${slug}`, label: "الذهب", icon: <IconCoins size={22} />, on: path === `/${slug}` },
    { href: `/${slug}/silver`, label: "الفضة", icon: <IconSilver size={22} />, on: path.endsWith("/silver") },
    { href: `/${slug}/calculator`, label: "الحاسبات", icon: <CalcIcon id="value" size={22} />, on: path.includes("/calculator") },
    { href: `/${slug}/exchange-rates`, label: "العملات", icon: <IconExchange size={22} />, on: path.endsWith("/exchange-rates") },
    { href: "/", label: "الدول", icon: <IconGlobe size={22} />, on: path === "/" },
  ];
  return (
    <nav className="tabbar" aria-label="التنقل السفلي">
      {tabs.map((t) => (
        <Link key={t.label} href={t.href} className={t.on ? "on" : ""} aria-current={t.on ? "page" : undefined}>
          {t.icon}
          <span>{t.label}</span>
        </Link>
      ))}
    </nav>
  );
}
