import { COUNTRIES, type Country } from "./countries";
import { mergeLive, type Live } from "./live-shared";
import { fmt, gold, money, MITHQAL, NISAB, silverPrice, TROY } from "./market";

/** Arabic digits → Latin, then pick numbers out of free text. */
const norm = (s: string) =>
  s.replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d))).replace(/[٬،]/g, ",").replace(/٫/g, ".");
const numbers = (s: string) => (norm(s).match(/\d[\d,]*(?:\.\d+)?/g) ?? []).map((x) => parseFloat(x.replace(/,/g, "")));

const ALIASES: Record<string, string[]> = {
  sa: ["سعودي", "ريال سعودي", "الرياض"], eg: ["مصري", "جنيه مصري", "القاهرة"], ae: ["إمارات", "امارات", "دبي", "درهم إماراتي"],
  us: ["أمريكا", "امريكا", "دولار أمريكي"], gb: ["إنجلترا", "انجلترا", "لندن"], kw: ["كويت"], qa: ["قطر"], tr: ["تركي", "اسطنبول", "إسطنبول"],
};

export function findCountry(text: string, fallback: Country): Country {
  const t = text;
  for (const c of COUNTRIES) {
    if (t.includes(c.name) || t.includes(c.name.replace(/^ال/, "")) || (ALIASES[c.code] ?? []).some((a) => t.includes(a))) return c;
    if (new RegExp(`\\b${c.cur}\\b`, "i").test(t)) return c;
  }
  return fallback;
}

function findKarat(text: string, c: Country) {
  const m = norm(text).match(/(?:عيار|قيراط|k)\s*(\d{1,2})|(\d{1,2})\s*(?:k|قيراط)/i);
  const k = m ? +(m[1] ?? m[2]) : 0;
  return k >= 8 && k <= 24 ? k : c.karats.includes(21) ? 21 : 24;
}

const gw = (g: number) => fmt(g, Number.isInteger(g) ? 0 : 2);

export type Reply = { text: string; suggestions: string[] };

/** Rule-based Arabic assistant over the live prices — used when no Claude API key is configured. */
export function localAnswer(question: string, base: Country, live: Live | null): Reply {
  const q = question.trim();
  const c = mergeLive(findCountry(q, base), live);
  const k = findKarat(q, c);
  const nums = numbers(q).filter((n) => ![8, 9, 10, 12, 14, 18, 21, 22, 24].includes(n) || /جرام|جم|غرام/.test(q));
  const amount = numbers(q).find((n) => n >= 50) ?? 0;
  const grams = (() => {
    const m = norm(q).match(/(\d[\d,.]*)\s*(?:جرام|جم|غرام|g)/);
    if (m) return parseFloat(m[1].replace(/,/g, ""));
    const mt = norm(q).match(/(\d[\d,.]*)\s*مثقال/);
    if (mt) return parseFloat(mt[1]) * MITHQAL;
    const oz = norm(q).match(/(\d[\d,.]*)\s*(?:أونصة|اونصة|أوقية)/);
    if (oz) return parseFloat(oz[1]) * TROY;
    return 0;
  })();
  const p = gold(c, k);
  const cur = c.curName;
  const sugg = [`سعر عيار 21 في ${c.name}`, `كم جرام بـ 10,000 ${cur}؟`, `زكاة 100 جرام عيار 21`, `سعر الفضة 925 في ${c.name}`];
  const market = live?.marketOpen === false ? "\n\nملاحظة: السوق العالمي مغلق الآن، فالأسعار هي آخر سعر إغلاق." : "";

  if (/زكا/.test(q) && !/شروط|الحول|ملبوس/.test(q)) {
    const g = grams || nums[0] || 0;
    if (!g) return { text: `النصاب 85 جراماً من الذهب الخالص (عيار 24)، وقيمته الآن في ${c.name} نحو ${money(c, NISAB * c.g24)} ${cur}. اكتب لي وزن ذهبك وعياره، مثلاً: «زكاة 120 جرام عيار 21».`, suggestions: ["زكاة 100 جرام عيار 21", "زكاة 50 جرام عيار 18", "ما هي شروط زكاة الذهب؟"] };
    const pure = (g * k) / 24;
    return pure >= NISAB
      ? { text: `${gw(g)} جرام عيار ${k} = ${fmt(pure, 2)} جرام ذهب خالص — بلغ النصاب ✓\nالزكاة الواجبة (2.5%): ${money(c, pure * c.g24 * 0.025)} ${cur}، أو ${fmt(pure * 0.025, 3)} جرام ذهب خالص.\nبشرط مرور حول هجري كامل (354 يوماً).${market}`, suggestions: ["متى يبدأ حساب الحول؟", `قيمة ${gw(g)} جرام عيار ${k}`, "هل تجب الزكاة على الذهب الملبوس؟"] }
      : { text: `${gw(g)} جرام عيار ${k} = ${fmt(pure, 2)} جرام خالص فقط، أقل من النصاب (85 جرام). لا زكاة عليك، ويتبقى ${fmt(NISAB - pure, 2)} جرام خالص لبلوغ النصاب.`, suggestions: ["زكاة 120 جرام عيار 21", `سعر عيار 24 في ${c.name}`] };
  }
  const convTo = norm(q).match(/(?:إلى|الى)\s*(?:عيار\s*)?(\d{1,2})(?!\d)/);
  if (grams && /حوّل|حول|تحويل|يعادل|يساوي كم/.test(q) && convTo) {
    const to = +convTo[1];
    if (to >= 8 && to <= 24) return { text: `${gw(grams)} جرام عيار ${k} = ${fmt((grams * k) / to, 3)} جرام عيار ${to}
(نفس كمية الذهب الخالص: ${fmt((grams * k) / 24, 3)} جرام).`, suggestions: [`قيمة ${gw(grams)} جرام عيار ${k}`, `زكاة ${gw(grams)} جرام عيار ${k}`] };
  }
  if (/شروط|الحول/.test(q)) return { text: "تجب زكاة الذهب بأربعة شروط: بلوغ النصاب (85 جرام عيار 24 أو ما يعادله)، ومرور سنة هجرية كاملة، والملكية التامة، وأن يكون فائضاً عن الحاجة. ونسبتها 2.5% من القيمة بسعر يوم الإخراج.", suggestions: ["زكاة 100 جرام عيار 21", "هل تجب الزكاة على الذهب الملبوس؟"] };
  if (/ملبوس|المستعمل.*زكا|مجوهرات.*زكا/.test(q)) return { text: "فيها خلاف فقهي: الجمهور يرى وجوب الزكاة في الذهب المدخر، وبعض العلماء يعفي الحُلي المستعملة فعلاً للزينة. يُستحسن سؤال جهة الإفتاء في بلدك.", suggestions: ["زكاة 100 جرام عيار 21"] };
  if (/فض/.test(q)) {
    const pur = /925/.test(q) ? 0.925 : /900/.test(q) ? 0.9 : /800/.test(q) ? 0.8 : 0.999;
    const sp = silverPrice(c, pur);
    return { text: `سعر جرام الفضة ${Math.round(pur * 1000)} في ${c.name} الآن: ${fmt(sp, sp >= 100 ? 2 : 3)} ${cur}.${live?.silverOunce ? `\nأونصة الفضة عالمياً: $${fmt(live.silverOunce)}.` : ""}${market}`, suggestions: [`سعر الفضة 999 في ${c.name}`, `سعر عيار 21 في ${c.name}`] };
  }
  if (/قارن|أرخص|ارخص|أغلى|اغلى/.test(q)) {
    const other = COUNTRIES.filter((x) => x.code !== c.code && q.includes(x.name.replace(/^ال/, "")));
    const target = other[0] ? mergeLive(other[0], live) : mergeLive(COUNTRIES[0].code === c.code ? COUNTRIES[1] : COUNTRIES[0], live);
    return { text: `عيار 24 الآن:\n• ${c.name}: ${money(c, c.g24)} ${c.curName}\n• ${target.name}: ${money(target, target.g24)} ${target.curName}\nالسعر الخام متقارب عالمياً لأنه مشتق من الأونصة، والفرق الحقيقي في المحلات يأتي من المصنعية والضرائب وهامش التاجر.`, suggestions: [`مصنعية الذهب في ${c.name}`, `سعر عيار 21 في ${target.name}`] };
  }
  if (/مصنعي|ضريب/.test(q)) {
    if (!c.buy) return { text: `لا تتوفر لدينا بيانات المصنعية والضريبة في ${c.name} حالياً. السعر الخام لعيار ${k}: ${money(c, p)} ${cur}/جرام.`, suggestions: sugg };
    return { text: `في ${c.name}: المصنعية للمجوهرات تقريباً ${c.buy.tiers[1][0]}–${c.buy.tiers[2][1]} ${cur}/جرام، و${c.buy.tax ? `ضريبة القيمة المضافة ${c.buy.tax}% ${c.buy.taxOn === "making" ? "على المصنعية فقط" : "على السعر والمصنعية"} (السبائك عيار 24 معفاة)` : "لا توجد ضريبة قيمة مضافة على الذهب"}.`, suggestions: [`تكلفة شراء 10 جرام عيار 21 في ${c.name}`, `سعر عيار 21 في ${c.name}`] };
  }
  if (/أونصة|اونصة|أوقية|عالمي/.test(q) && !grams) {
    return { text: `سعر أونصة الذهب عالمياً الآن: $${fmt(live?.ounce ?? 0)} (31.1 جرام)، أي ${money(c, c.g24 * TROY, 0)} ${cur} في ${c.name}.${market}`, suggestions: [`سعر عيار 24 في ${c.name}`, "سعر الفضة عالمياً"] };
  }
  if (/كم جرام|اشتري|أشتري|ميزانية|معي|معايا|عندي/.test(q) && amount && !grams) {
    return { text: `بمبلغ ${fmt(amount, 0)} ${cur} في ${c.name} تشتري تقريباً (سعر خام بدون مصنعية):\n${[24, 21, 18].map((x) => `• عيار ${x}: ${fmt(amount / gold(c, x), 2)} جرام`).join("\n")}\nفي المحل ستحصل على أقل بسبب المصنعية والضريبة.${market}`, suggestions: [`مصنعية الذهب في ${c.name}`, `سعر عيار 21 في ${c.name}`] };
  }
  if (/شراء|تكلف/.test(q) && grams && c.buy) {
    const m = c.making?.[k] ?? c.buy.tiers[1][0];
    const tax = k === 24 ? 0 : c.buy.taxOn === "making" ? (m * grams * c.buy.tax) / 100 : ((p + m) * grams * c.buy.tax) / 100;
    return { text: `تكلفة شراء ${gw(grams)} جرام عيار ${k} جديد في ${c.name} تقريباً:\n• الخام: ${money(c, p * grams)}\n• المصنعية (${m}/جرام): ${money(c, m * grams)}\n• الضريبة: ${money(c, tax)}\nالإجمالي ≈ ${money(c, p * grams + m * grams + tax)} ${cur}`, suggestions: [`بيع ${gw(grams)} جرام عيار ${k} مستعمل`, `مصنعية الذهب في ${c.name}`] };
  }
  if (/بيع|أبيع|ابيع|مستعمل/.test(q) && grams) {
    const d = c.sell?.byKarat?.[k] ?? c.sell?.d[1] ?? 0;
    return { text: `بيع ${gw(grams)} جرام عيار ${k} مستعمل في ${c.name}:\n• قيمة الخام: ${money(c, p * grams)}\n${d ? `• خصم المحل المتوقع (~${d}/جرام): −${money(c, d * grams)}\n` : ""}المتوقع ≈ ${money(c, (p - d) * grams)} ${cur}`, suggestions: [`تكلفة شراء ${gw(grams)} جرام عيار ${k} جديد`, "زكاة 100 جرام عيار 21"] };
  }
  if (grams) {
    return { text: `قيمة ${gw(grams)} جرام عيار ${k} في ${c.name} الآن: ${money(c, p * grams)} ${cur} (سعر خام بدون مصنعية أو ضريبة).${market}`, suggestions: [`بيع ${gw(grams)} جرام عيار ${k} مستعمل`, `زكاة ${gw(grams)} جرام عيار ${k}`] };
  }
  if (/سعر|كم|بكام|الذهب|عيار/.test(q)) {
    return { text: `سعر جرام الذهب في ${c.name} الآن:\n${c.karats.map((x) => `• عيار ${x}: ${money(c, gold(c, x))} ${cur}`).join("\n")}\nالأونصة عالمياً: $${fmt(live?.ounce ?? 0)}.${market}`, suggestions: sugg };
  }
  return { text: `أنا مساعد ذهب برايس — أجيبك عن أسعار الذهب والفضة اللحظية في 37 دولة، وأحسب لك القيمة والبيع والشراء والزكاة. جرّب أحد الأسئلة بالأسفل.`, suggestions: sugg };
}

/** Compact price sheet for the LLM system prompt. */
export function priceSheet(live: Live | null) {
  return COUNTRIES.map((c0) => {
    const c = mergeLive(c0, live);
    return `${c.name} (${c.code}, ${c.cur}): 24K=${money(c, c.g24)}${c.karats.filter((k) => k !== 24).map((k) => ` ${k}K=${money(c, gold(c, k))}`).join("")} | فضة999=${fmt(silverPrice(c, 0.999), 3)}${c.buy ? ` | مصنعية ${c.buy.tiers[1][0]}-${c.buy.tiers[2][1]} ضريبة ${c.buy.tax}% على ${c.buy.taxOn === "making" ? "المصنعية" : "الإجمالي"}` : ""}${c.sell ? ` | خصم البيع ${c.sell.d.join("/")}` : ""}`;
  }).join("\n");
}
