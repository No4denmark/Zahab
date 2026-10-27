import "server-only";
import type { Country } from "./countries";

export type NewsTopic = "gold" | "silver" | "economy";
export type NewsItem = { title: string; link: string; source: string; date: string };
export type NewsFeed = Record<NewsTopic, NewsItem[]>;

export const NEWS_TOPICS: { id: NewsTopic; label: string }[] = [
  { id: "gold", label: "الذهب" },
  { id: "silver", label: "الفضة" },
  { id: "economy", label: "الاقتصاد" },
];

const ARAB = new Set(["sa", "eg", "ae", "kw", "qa", "bh", "om", "dz", "tn", "ma", "sy", "iq", "ye", "jo", "ps", "lb", "ly", "sd"]);
const NEWS_TTL = 900; // 15 minutes

const decode = (s: string) =>
  s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .trim();

function queryFor(topic: NewsTopic, c?: Country) {
  const where = c && ARAB.has(c.code) ? ` ${c.name}` : "";
  if (topic === "gold") return `أسعار الذهب${where}`;
  if (topic === "silver") return `أسعار الفضة`;
  return c && ARAB.has(c.code) ? `اقتصاد ${c.name} الدولار البورصة` : "الاقتصاد العالمي الدولار الفائدة";
}

async function fetchTopic(topic: NewsTopic, c?: Country, limit = 12): Promise<NewsItem[]> {
  const gl = c && ARAB.has(c.code) ? c.code.toUpperCase() : "EG";
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(`${queryFor(topic, c)} when:7d`)}&hl=ar&gl=${gl}&ceid=${gl}:ar`;
  try {
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (zahab-price)" }, next: { revalidate: NEWS_TTL }, signal: AbortSignal.timeout(8000) });
    if (!res.ok) return [];
    const xml = await res.text();
    const seen = new Set<string>();
    const items: NewsItem[] = [];
    for (const m of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
      const get = (tag: string) => decode(m[1].match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`))?.[1] ?? "");
      const source = get("source");
      const title = get("title").replace(new RegExp(`\\s+-\\s+${source.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`), "");
      const link = get("link");
      const key = title.slice(0, 50);
      if (!title || !link.startsWith("https://") || seen.has(key)) continue;
      seen.add(key);
      items.push({ title, link, source, date: new Date(get("pubDate")).toISOString() });
    }
    return items.sort((a, b) => +new Date(b.date) - +new Date(a.date)).slice(0, limit);
  } catch {
    return [];
  }
}

export async function getNews(c?: Country, limit = 12): Promise<NewsFeed> {
  const [gold, silver, economy] = await Promise.all(NEWS_TOPICS.map((t) => fetchTopic(t.id, c, limit)));
  return { gold, silver, economy };
}
