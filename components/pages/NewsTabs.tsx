"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { NewsFeed, NewsTopic } from "@/lib/news";
import { IconArrow } from "@/components/ui/Icons";

const TOPICS: { id: NewsTopic; label: string }[] = [
  { id: "gold", label: "الذهب" },
  { id: "silver", label: "الفضة" },
  { id: "economy", label: "الاقتصاد" },
];

function ago(iso: string, now: number) {
  const m = Math.max(1, Math.round((now - +new Date(iso)) / 60000));
  if (m < 60) return `منذ ${m} دقيقة`;
  const h = Math.round(m / 60);
  if (h < 24) return `منذ ${h} ساعة`;
  const d = Math.round(h / 24);
  return d === 1 ? "منذ يوم" : `منذ ${d} أيام`;
}

/** Tabbed list of headlines. `compact` shows a short grid with a link to the full news page. */
export function NewsTabs({ feed, moreHref, compact }: { feed: NewsFeed; moreHref?: string; compact?: boolean }) {
  const [tab, setTab] = useState<NewsTopic>("gold");
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => setNow(Date.now()), []);
  const items = feed[tab].slice(0, compact ? 6 : 30);

  return (
    <div className="rv">
      <div className="news-tools">
        <div className="chips">
          {TOPICS.map((t) => (
            <button key={t.id} className={`chip${t.id === tab ? " on" : ""}`} onClick={() => setTab(t.id)}>
              {t.label} <small>{feed[t.id].length}</small>
            </button>
          ))}
        </div>
        {moreHref && <Link className="btn btn-dark btn-sm" href={moreHref}>كل الأخبار ←</Link>}
      </div>
      {items.length === 0 ? (
        <p className="note"><span>تعذّر تحميل الأخبار الآن — حاول مرة أخرى بعد قليل.</span></p>
      ) : (
        <div className={`news-grid${compact ? " compact" : ""}`}>
          {items.map((n, i) => (
            <a key={n.link} className={`news-card${!compact && i === 0 ? " lead" : ""}`} href={n.link} target="_blank" rel="noopener noreferrer nofollow">
              <div className="news-meta">
                <span className="news-src">{n.source || "مصدر إخباري"}</span>
                <time dateTime={n.date} suppressHydrationWarning>{now ? ago(n.date, now) : ""}</time>
              </div>
              <h3>{n.title}</h3>
              <span className="news-go">اقرأ الخبر <IconArrow size={14} /></span>
            </a>
          ))}
        </div>
      )}
      <p className="news-note">العناوين مجمّعة تلقائياً من مصادر إخبارية عبر Google News وتُفتح في مواقعها الأصلية.</p>
    </div>
  );
}
