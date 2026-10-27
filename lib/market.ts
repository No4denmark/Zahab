import type { Country } from "./countries";

export const OUNCE = { usd: 3995.84, change: 0.55, pct: 0.01, high: 3996, low: 3995, mid: 3996 };
export const TROY = 31.1035;
export const MITHQAL = 4.25;
export const NISAB = 85;
export const UPDATED = "25 أكتوبر 2026";
export const REVIEWED = "04 سبتمبر 2026";

// Silver 999 vs gold 24K ratio from the Egypt snapshot (95.7322 / 7104.78).
const SILVER_RATIO = 95.7322 / 7104.78;
export const SILVER = [
  { id: "999", label: "فضة 999", purity: 0.999, use: "السبائك الاستثمارية والعملات التذكارية" },
  { id: "925", label: "فضة 925 - إسترلينية", purity: 0.925, use: "المجوهرات والأدوات والهدايا الفاخرة" },
  { id: "900", label: "فضة 900 - عملات", purity: 0.9, use: "العملات التاريخية وبعض المجوهرات" },
  { id: "800", label: "فضة 800", purity: 0.8, use: "المجوهرات التقليدية وأدوات المائدة" },
];
export const silverPrice = (c: Country, purity: number) => ((c.s999 ?? c.g24 * SILVER_RATIO) * purity) / 0.999;

export const gold = (c: Country, k: number) => (c.g24 * k) / 24;

export const decimals = (c: Country) => (c.g24 >= 1000 ? 0 : 2);
export const fmt = (n: number, d = 2) =>
  n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
export const money = (c: Country, n: number, d?: number) => fmt(n, d ?? (Math.abs(n) >= 1000 ? 0 : 2));

export const ALL_KARATS = [24, 23, 22, 21, 20, 19, 18, 16, 14, 12, 10, 9];
export const KARAT_USE: Record<number, string> = {
  24: "السبائك والاستثمار", 22: "المجوهرات التقليدية", 21: "الأكثر انتشاراً في الخليج ومصر", 18: "التصاميم الحديثة",
  14: "المجوهرات اليومية في أوروبا وأمريكا", 9: "الحُلي الاقتصادية في بريطانيا",
};

export const UNITS = [
  { id: "g", label: "جرام", g: 1 },
  { id: "m", label: "مثقال", g: MITHQAL },
  { id: "oz", label: "أونصة", g: TROY },
  { id: "kg", label: "كيلو", g: 1000 },
];

export const ITEM_TYPES = ["بدون تحديد", "خاتم", "أسورة", "طقم", "سبيكة", "جنيه", "سلسلة", "أقراط", "خلخال", "أخرى"];

/* ---------- exchange rates (EGP per unit, 25 Oct 2026) ---------- */
export const EGP_PER: Record<string, number> = {
  USD: 55.3024, EUR: 61.9514, GBP: 73.9684, SAR: 14.7355, AED: 15.0575, KWD: 177.92947, BHD: 146.6212, OMR: 143.70054,
  QAR: 15.1802, JOD: 77.9873, CHF: 67.028, JPY: 0.3525, CNY: 8.2881, CAD: 39.4874, AUD: 38.9035, SEK: 5.5689, NOK: 5.9218, DKK: 8.2891, EGP: 1,
};
export const FX_LIST: [string, string][] = [
  ["USD", "دولار أمريكي"], ["EUR", "يورو"], ["GBP", "جنيه إسترليني"], ["SAR", "ريال سعودي"], ["AED", "درهم إماراتي"], ["KWD", "دينار كويتي"],
  ["BHD", "دينار بحريني"], ["OMR", "ريال عماني"], ["QAR", "ريال قطري"], ["JOD", "دينار أردني"], ["CHF", "فرنك سويسري"], ["JPY", "ين ياباني"],
  ["CNY", "يوان صيني"], ["CAD", "دولار كندي"], ["AUD", "دولار أسترالي"], ["SEK", "كرونة سويدية"], ["NOK", "كرونة نرويجية"], ["DKK", "كرونة دنماركية"],
];
const US_G24 = 128.47;
/** Units of the country's currency per 1 USD. */
export const perUsd = (c: Country) => (EGP_PER[c.cur] ? EGP_PER.USD / EGP_PER[c.cur] : c.g24 / US_G24);
/** How many units of country currency = 1 unit of `code`. */
export const rateIn = (c: Country, code: string) => (EGP_PER[code] / EGP_PER.USD) * perUsd(c);

/* ---------- deterministic history (until a real feed is wired) ---------- */
export function seeded(seed: number) {
  let s = seed % 2147483647 || 7;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}
export const seedOf = (str: string) => [...str].reduce((a, ch) => a * 31 + ch.charCodeAt(0), 7) % 100000;

export function series(end: number, n: number, vol: number, seed: number, drift = 0) {
  const q = seeded(seed);
  const out: number[] = [];
  let v = end * (1 + drift);
  for (let i = 0; i < n; i++) { v *= 1 + (q() - 0.5) * vol; out.push(v); }
  const k = end / out[n - 1];
  return out.map((x, i) => x * (1 + (k - 1) * (i / (n - 1))));
}

const DAYS = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
export function pastDays(n: number) {
  const base = new Date(Date.UTC(2026, 9, 24));
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(base.getTime() - i * 864e5);
    return { day: DAYS[d.getUTCDay()], date: `${d.getUTCDate()}/${d.getUTCMonth() + 1}` };
  });
}

/* ---------- calculators ---------- */
export type CalcId = "gold/sell" | "gold-karat-converter" | "gold-value" | "gold/buy" | "zakat" | "riyals-to-grams" | "installment";
export const CALCS: { id: CalcId; title: string; desc: (c: Country) => string; icon: string; hot?: boolean }[] = [
  { id: "gold/sell", title: "حاسبة بيع الذهب", desc: () => "احسب سعر بيع الذهب المستعمل مع الخصم المتوقع من المحلات", icon: "sell", hot: true },
  { id: "gold-karat-converter", title: "محول عيارات الذهب", desc: () => "حوّل بين عيار 24 و21 و18 — جميع العيارات من 9 إلى 24 قيراط", icon: "convert", hot: true },
  { id: "gold-value", title: "حاسبة قيمة الذهب", desc: () => "احسب قيمة ذهبك بدقة حسب الوزن والعيار — دعم جميع الأوزان والعيارات", icon: "value" },
  { id: "gold/buy", title: "حاسبة شراء الذهب", desc: (c) => `احسب تكلفة شراء الذهب الجديد مع المصنعية${c.buy?.tax ? ` وضريبة القيمة المضافة ${c.buy.tax}%` : ""}`, icon: "buy" },
  { id: "zakat", title: "حاسبة زكاة الذهب", desc: () => "احسب زكاة ذهبك وفقاً للشريعة الإسلامية — نصاب 85 جرام عيار 24", icon: "zakat" },
  { id: "riyals-to-grams", title: "تحويل ريال إلى جرام", desc: () => "حوّل المبلغ بالعملة المحلية إلى وزن الذهب بالجرام حسب السعر الحالي", icon: "r2g" },
  { id: "installment", title: "حاسبة تقسيط تابي وتمارا", desc: () => "احسب قيمة القسط الشهري مع تابي وتمارا وقارن بين الخيارات المتاحة", icon: "inst" },
];
export const hasCalc = (c: Country, id: CalcId) =>
  id === "gold/sell" ? !!c.sell
  : id === "gold/buy" ? !!c.buy
  : id === "riyals-to-grams" ? !!c.extra?.includes("r2g")
  : id === "installment" ? !!c.extra?.includes("inst")
  : true;
export const calcsFor = (c: Country) => CALCS.filter((x) => hasCalc(c, x.id));

/* ---------- shop pricing rules ---------- */
const lerp = (a: number, b: number, t: number) => a + (b - a) * Math.min(1, Math.max(0, t));
/** Typical shop discount per gram when selling used jewellery of karat k. */
export const discountFor = (c: Country, k: number) =>
  c.sell?.byKarat?.[k] ?? (c.sell ? +lerp(c.sell.d[0], c.sell.d[2], (24 - k) / 6).toFixed(2) : 0);
/** Lowest and highest shop discount per gram across karats and conditions. */
export const sellRange = (c: Country): [number, number] => {
  const v = [...(c.sell?.d ?? [0]), ...Object.values(c.sell?.byKarat ?? {})];
  return [Math.min(...v), Math.max(...v)];
};
/** Typical making charge per gram for jewellery of karat k. */
export const makingFor = (c: Country, k: number) =>
  c.making?.[k] ?? (c.buy ? Math.round(lerp(c.buy.tiers[1][0], c.buy.tiers[2][1] ?? c.buy.tiers[2][0], (24 - k) / 6)) : 0);
/** Tax on a purchase of `w` grams at karat k with making `m` per gram. Bars (24K) are exempt. */
export function buyTax(c: Country, k: number, w: number, m: number) {
  if (!c.buy || k === 24) return 0;
  const base = c.buy.taxOn === "making" ? m * w : (gold(c, k) + m) * w;
  return (base * c.buy.tax) / 100;
}
/* ---------- installments (Saudi BNPL providers) ---------- */
export type Provider = "tamara" | "tabby";
/** Total fee rate by provider and number of installments (from the providers' published plans). */
export const PLANS: Record<Provider, [number, number][]> = {
  tamara: [[2, 0], [3, 0], [4, 0], [6, 0.17], [9, 0.17], [12, 0.17], [24, 0.4]],
  tabby: [[3, 0], [4, 0.0115], [6, 0.0115]],
};
export const perInstallment = (amount: number, p: Provider, n: number) =>
  (amount * (1 + (PLANS[p].find(([x]) => x === n)?.[1] ?? 0))) / n;

export const TIER_LABELS =["سبائك الذهب", "مجوهرات بسيطة", "مجوهرات معقدة", "تصميم خاص"];

/** Grams parsed out of a bar label such as "نصف أونصة (15.55 جرام)" or "10 جرام". */
export function barGrams(name: string) {
  const m = name.match(/\(([\d.]+) جرام\)/) || name.match(/^([\d.]+) جرام/);
  return m ? +m[1] : 1;
}
