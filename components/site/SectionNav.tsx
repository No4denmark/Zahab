"use client";
import { useEffect, useRef, useState } from "react";
import { IconBars, IconChart, IconCoins, IconExchange, IconHelp, IconLayers, IconNews, IconPulse, IconSilver } from "@/components/ui/Icons";

const ICONS = {
  coins: IconCoins, trade: IconExchange, chart: IconChart, bars: IconBars,
  pulse: IconPulse, help: IconHelp, silver: IconSilver, layers: IconLayers, news: IconNews,
};
export type SectionTile = { id: string; label: string; hint?: string; icon: keyof typeof ICONS };

/** Sticky in-page navigation as icon tiles, highlighting the section currently in view. */
export function SectionNav({ items }: { items: SectionTile[] }) {
  const [active, setActive] = useState(items[0]?.id);
  const bar = useRef<HTMLDivElement>(null);

  // Active = the last section whose top has scrolled past the sticky bars (plus a small lead).
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = (bar.current?.getBoundingClientRect().bottom ?? 140) + 72;
      let cur = items[0]?.id;
      for (const x of items) {
        const el = document.getElementById(x.id);
        if (el && el.getBoundingClientRect().top <= line) cur = x.id;
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) cur = items[items.length - 1].id;
      setActive(cur);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, [items]);

  // Keep the active tile centred in the horizontal strip on phones. Only the strip scrolls:
  // scrollIntoView would also nudge the window and cancel the page's in-progress anchor scroll.
  useEffect(() => {
    const strip = bar.current;
    const el = strip?.querySelector<HTMLElement>(`[data-id="${active}"]`);
    if (!strip || !el || strip.scrollWidth <= strip.clientWidth) return;
    const a = el.getBoundingClientRect(), b = strip.getBoundingClientRect();
    strip.scrollBy({ left: a.left + a.width / 2 - (b.left + b.width / 2), behavior: "smooth" });
  }, [active]);

  return (
    <nav className="secnav" aria-label="أقسام الصفحة">
      <div className="container secnav-in" ref={bar}>
        {items.map((x) => {
          const Icon = ICONS[x.icon];
          return (
            <a key={x.id} href={`#${x.id}`} data-id={x.id} className={`sn${active === x.id ? " on" : ""}`} aria-current={active === x.id ? "location" : undefined}>
              <span className="sn-ic"><Icon size={19} /></span>
              <span className="sn-tx"><b>{x.label}</b>{x.hint && <small>{x.hint}</small>}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
