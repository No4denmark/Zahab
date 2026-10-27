import type { Metadata } from "next";
import Link from "next/link";
import { allCountryParams, resolveCountry, type CParams } from "@/lib/params";
import { getCountry } from "@/lib/countries";
import { getLive } from "@/lib/live";
import { buyTax, discountFor, fmt, gold, makingFor, money, OUNCE, perUsd, sellRange, series, seedOf, TROY } from "@/lib/market";
import { Crumbs, Faq, Flag, SectionHead, Updated } from "@/components/ui/Basics";
import { PriceChart } from "@/components/ui/Live";
import { CalcBanner, NewsletterBanner } from "@/components/ui/Banners";
import { GoldStackArt } from "@/components/ui/Art";
import { GoldHeroCard, KaratTabs } from "@/components/pages/GoldParts";
import { SmartTips } from "@/components/live/Assistant";
import { Vault } from "@/components/pages/Vault";
import { SectionNav } from "@/components/site/SectionNav";
import { NewsSection } from "@/components/pages/NewsSection";

export const dynamicParams = false;
export const generateStaticParams = allCountryParams;

export async function generateMetadata({ params }: CParams): Promise<Metadata> {
  const c = getCountry((await params).c);
  return c ? { title: `سعر الذهب في ${c.name} الآن - تحديث كل دقيقة`, description: `أسعار الذهب اليوم في ${c.name} لجميع العيارات والسبائك بالـ${c.curName}، محدثة كل دقيقة.` } : {};
}

export default async function GoldPage({ params }: CParams) {
  const c = await resolveCountry(params);
  const ounce = (await getLive())?.ounce ?? OUNCE.usd;
  const k21 = c.karats.includes(21) ? 21 : c.karats[1];
  const lo = c.karats[c.karats.length - 1];
  const hist = series(c.g24, 30, 0.008, seedOf(c.code) + 3, 0.03);
  const weekAvg = hist.slice(-7).reduce((a, b) => a + b, 0) / 7;
  const vsWeek = ((c.g24 - weekAvg) / weekAvg) * 100;
  const mn = Math.min(...hist), mx = Math.max(...hist), pos = ((c.g24 - mn) / (mx - mn || 1)) * 100;
  const trade = c.sell || c.buy;
  const tradeK = c.karats.filter((k) => k !== 24);

  const faq: [string, string][] = [
    ["متى يتم تحديث سعر الذهب؟", "يتم تحديث سعر الذهب في موقعنا تلقائياً كل دقيقة لضمان حصولكم على أحدث الأسعار في السوق المحلي والعالمي."],
    ["ما الفرق بين السبائك والمجوهرات؟", "السبائك ذهب عيار 24 بهامش تصنيع منخفض وتُشترى للادخار، أما المجوهرات فتحمل مصنعية أعلى حسب التصميم وغالباً تكون بعيارات أقل."],
    [`هل سعر الذهب موحد في جميع أنحاء ${c.name}؟`, "السعر الخام موحد تقريباً، لكن المصنعية وهامش الربح يختلفان من محل لآخر ومن مدينة لأخرى."],
    ["كيف يتم تحديد سعر الذهب يومياً؟", `يُحسب من سعر الأونصة العالمي بالدولار ÷ 31.1035 للحصول على سعر الجرام، ثم يُضرب في سعر صرف الـ${c.curName} ونسبة نقاء كل عيار.`],
    ["هل أحتاج لتحديث الصفحة لرؤية أحدث سعر للذهب؟", "لا، الأسعار تتحدث تلقائياً دون الحاجة لإعادة تحميل الصفحة."],
    ["كيف أعرف بتغير سعر الذهب وأنا بعيد عن الموقع؟", "فعّل تنبيهات الأسعار من حسابك أو اشترك في النشرة البريدية لتصلك التحديثات."],
    ["ما الفرق بين أسعار البيع والشراء؟", "سعر البيع هو ما يدفعه لك المحل مقابل ذهبك المستعمل (أقل من الخام)، وسعر الشراء هو ما تدفعه للمحل شاملاً المصنعية والضريبة."],
    ...(c.buy ? [[`هل يوجد ضريبة على شراء الذهب في ${c.name}؟`, c.buy.tax ? `نعم، ضريبة القيمة المضافة ${c.buy.tax}% ${c.buy.taxOn === "making" ? "على المصنعية فقط" : "على السعر والمصنعية"} للعيارات أقل من 24، والسبائك عيار 24 معفاة.` : "لا تُفرض ضريبة قيمة مضافة على الذهب حالياً."] as [string, string]] : []),
    ["لماذا سعر بيع الذهب المستعمل أقل من السعر الخام؟", "لتغطية تكاليف الفحص والتنظيف وإعادة التصنيع التي يتحملها التاجر."],
    ["ما هي المصنعية في الذهب ولماذا تختلف؟", "المصنعية أجور التشكيل والتصميم والعمالة وربح المصنع والتاجر، وتختلف حسب العيار وتعقيد التصميم والوزن."],
  ];

  return (
    <main>
      <section className="hero">
        <div className="container hero-in">
          <div>
            <Crumbs items={[["الرئيسية", "/"], [c.name]]} />
            <span className="kicker"><Flag code={c.code} /> أسعار جميع العيارات والسبائك بالـ{c.curName}</span>
            <h1>سعر الذهب اليوم في <span className="hl">{c.name}</span></h1>
            <p className="lead">
              كم سعر جرام الذهب اليوم في {c.name}؟ يبلغ سعر عيار {k21} حوالي <b className="n">{money(c, gold(c, k21), 0)}</b> {c.curName}، وعيار 24 حوالي{" "}
              <b className="n">{money(c, c.g24, 0)}</b> {c.curName}. الأسعار محدَّثة لحظياً بدون مصنعية وضريبة.
            </p>
            <div className="hero-cta">
              <Link className="btn btn-y" href={`/${c.slug}/calculator`}>احسب قيمة ذهبك ←</Link>
              <Link className="btn btn-ghost" href={`/${c.slug}/silver`}>أسعار الفضة</Link>
            </div>
          </div>
          <GoldHeroCard slug={c.slug} />
        </div>
      </section>

      <SectionNav items={[
        { id: "karats", label: "العيارات", hint: `${c.karats.length} عيارات`, icon: "coins" },
        ...(trade ? [{ id: "trade", label: "البيع والشراء", hint: c.buy?.tax ? `ضريبة ${c.buy.tax}%` : "خصم المحلات", icon: "trade" as const }] : []),
        { id: "chart", label: "الرسم البياني", hint: "60 د – 12 شهر", icon: "chart" },
        { id: "bullion", label: "السبائك", hint: `${c.bars.length} قطعة`, icon: "bars" },
        { id: "market", label: "ملخص السوق", hint: "اليوم", icon: "pulse" },
        { id: "news", label: "الأخبار", hint: "ذهب · فضة · اقتصاد", icon: "news" },
        { id: "faq", label: "الأسئلة", hint: `${faq.length} سؤالاً`, icon: "help" },
      ]} />

      <section className="container sec" id="karats">
        <SectionHead eb="الأسعار الحالية" title={`أسعار الذهب اليوم في ${c.name} حسب العيار`} desc={`سعر الجرام الخام بالـ${c.curName} (${c.cur}).`} />
        <KaratTabs slug={c.slug} />
        <p className="note rv">
          <span>يبدأ سعر جرام الذهب اليوم في {c.name} من <b className="n">{money(c, c.g24)}</b> {c.curName} لعيار 24، وينخفض إلى <b className="n">{money(c, gold(c, lo))}</b> {c.curName} لعيار {lo} — أي بفارق <b className="n">{money(c, c.g24 - gold(c, lo))}</b> {c.curName} للجرام الواحد.</span>
        </p>
        <SmartTips slug={c.slug} />
      </section>

      {trade && (
        <section className="container sec" id="trade">
          <SectionHead eb="البيع والشراء" title={`أسعار الذهب اليوم في ${c.name} بيع وشراء`}
            desc={`عند بيع الذهب المستعمل يُشترى بسعر أقل من الخام${c.sell ? ` بخصم يتراوح بين ${sellRange(c).join("-")} ${c.curName} حسب العيار والحالة` : ""}. وعند الشراء يُضاف للخام المصنعية${c.buy?.tax ? ` وضريبة القيمة المضافة ${c.buy.tax}%${c.buy.taxOn === "making" ? " على المصنعية فقط" : ""}` : ""}.`} />
          <div className="grid-2" style={{ alignItems: "start" }}>
            <div className="tbl-wrap rv">
              <table className="tbl">
                <thead><tr><th>العيار</th>{c.sell && <th>بيع مستعمل</th>}{c.buy && <th>شراء جديد</th>}{c.buy && <th>الضريبة {c.buy.tax}%</th>}</tr></thead>
                <tbody>
                  {c.karats.map((k) => {
                    const m = makingFor(c, k), tx = buyTax(c, k, 1, m);
                    return (
                      <tr key={k}>
                        <td className="strong">عيار {k}</td>
                        {c.sell && <td className="n">{money(c, gold(c, k) - discountFor(c, k))}</td>}
                        {c.buy && <td>{k === 24 ? <a className="row-link" href="#bullion">السبائك ←</a> : <span className="n gold">{money(c, gold(c, k) + m + tx)}</span>}</td>}
                        {c.buy && <td>{k === 24 ? <span className="badge ok">معفى</span> : <span className="n">{fmt(tx)}</span>}</td>}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="card rv" style={{ background: "var(--ink)", color: "#fff", borderColor: "var(--ink)" }}>
              <span className="badge">ملاحظات مهمة</span>
              <ul style={{ marginTop: 14, paddingInlineStart: 18, display: "grid", gap: 8, color: "#c3c9d0", fontSize: 15 }}>
                {c.sell && <li><b style={{ color: "#fff" }}>بيع مستعمل:</b> السعر الخام − خصم {sellRange(c).join("-")} {c.curName} حسب العيار والحالة.</li>}
                {c.buy && <li><b style={{ color: "#fff" }}>شراء جديد:</b> {c.buy.taxOn === "making" ? `السعر الخام + (المصنعية + ضريبة ${c.buy.tax}% عليها)` : `(السعر الخام + المصنعية)${c.buy.tax ? ` + ضريبة ${c.buy.tax}%` : ""}`}.</li>}
                {c.buy && <li>المصنعية تختلف حسب التصميم والوزن ({c.buy.tiers[1][0]}-{c.buy.tiers[2][1]} {c.curName}/جرام).</li>}
                <li>هذه أسعار تقديرية وقد تختلف من محل لآخر.</li>
              </ul>
              {c.buy && tradeK[1] && (
                <div className="note" style={{ background: "rgba(254,215,0,.1)", borderColor: "rgba(254,215,0,.25)", color: "#e5e7eb" }}>
                  <span>مثال عيار {tradeK[1]}: خام <b className="n">{money(c, gold(c, tradeK[1]))}</b> + مصنعية <b className="n">{money(c, makingFor(c, tradeK[1]))}</b>
                    {c.buy.tax ? <> + ضريبة <b className="n">{fmt(buyTax(c, tradeK[1], 1, makingFor(c, tradeK[1])))}</b></> : null} = <b className="n" style={{ color: "var(--y)" }}>{money(c, gold(c, tradeK[1]) + makingFor(c, tradeK[1]) + buyTax(c, tradeK[1], 1, makingFor(c, tradeK[1])))}</b> {c.curName}</span>
                </div>
              )}
              <div className="actions" style={{ marginTop: 18 }}>
                {c.sell && <Link className="btn btn-y btn-sm" href={`/${c.slug}/calculator/gold/sell`}>حاسبة البيع</Link>}
                {c.buy && <Link className="btn btn-ghost btn-sm" href={`/${c.slug}/calculator/gold/buy`}>حاسبة الشراء</Link>}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="container sec" id="chart">
        <SectionHead eb="الرسم البياني" title={`الرسم البياني لأسعار الذهب في ${c.name}`} />
        <PriceChart end={c.g24} unit={c.curShort} seed={seedOf(c.code)} title={`عيار 24 · ${c.curName} للجرام`} digits={c.g24 >= 1000 ? 0 : 2} />
      </section>

      <Vault c={c} title={`أسعار سبائك الذهب في ${c.name} اليوم`} desc="سبائك مسكوكة ومصبوبة وعملات ذهبية — صفِّ حسب النوع، ورتّب حسب الوزن أو الأوفر سعراً للجرام." />

      <section className="container sec" id="market">
        <SectionHead eb="ملخّص السوق اليوم" title={`ملخص حركة الذهب في ${c.name}`}
          desc={`يبلغ سعر جرام عيار 24 نحو ${money(c, c.g24)} ${c.curName}, بينما تُتداول الأونصة عالمياً عند ${fmt(ounce)} دولار — ما يعادل نحو ${money(c, ounce * perUsd(c), 0)} ${c.curName}.`} />
        <div className="stats rv">
          <div className="stat"><small>عيار 24 الآن</small><b className="n">{money(c, c.g24)}</b><p>{c.curName} / جرام — مباشر</p></div>
          <div className="stat"><small>مقارنةً بمتوسط آخر 7 أيام</small><b className={`n ${vsWeek >= 0 ? "up" : "down"}`}>{vsWeek >= 0 ? "+" : "−"}{Math.abs(vsWeek).toFixed(2)}%</b><p>{vsWeek >= 0 ? "أعلى" : "أقل"} بمقدار <span className="n">{money(c, Math.abs(c.g24 - weekAvg))}</span></p></div>
          <div className="stat"><small>متوسط الأسبوع</small><b className="n">{money(c, weekAvg)}</b><p>{c.curName} / جرام</p></div>
          <div className="stat"><small>الموقع داخل نطاق 30 يوماً</small><div className="range"><i style={{ right: `${pos}%` }} /></div><p className="n">{money(c, mn)} — {money(c, mx)}</p></div>
        </div>
        <div className="grid-3 rv" style={{ marginTop: 16 }}>
          <Link href="/" className="card"><h3>سعر الأونصة العالمي</h3><p className="n">${fmt(ounce)} · {money(c, c.g24 * TROY, 0)} {c.curShort}</p></Link>
          <a href="#chart" className="card"><h3>الرسم البياني</h3><p>تابع حركة السعر من 60 دقيقة حتى 12 شهراً</p></a>
          <Link href={`/${c.slug}/exchange-rates`} className="card"><h3>أسعار صرف {c.curName}</h3><p>تحويل فوري لأكثر من 18 عملة</p></Link>
        </div>
      </section>

      <NewsSection c={c} />

      <CalcBanner c={c} />

      <section className="dark-sec" style={{ paddingBlock: 60 }}>
        <div className="container banner" style={{ padding: 0 }}>
          <div className="rv">
            <span className="badge">الفضة في {c.name}</span>
            <h3 style={{ marginTop: 12 }}>أسعار الفضة بدرجات النقاء 999 و925 و900 و800</h3>
            <p style={{ color: "#aeb6bf" }}>تابع سعر جرام الفضة بالـ{c.curName} مع الأسعار التاريخية لآخر 30 يوماً ومقارنة درجات النقاء.</p>
            <div className="acts"><Link className="btn btn-y" href={`/${c.slug}/silver`}>أسعار الفضة ←</Link></div>
          </div>
          <div className="banner-art rv"><GoldStackArt tone="silver" /></div>
        </div>
      </section>

      <section className="container sec" id="faq">
        <SectionHead eb="الأسئلة الشائعة" title="الأسئلة الشائعة حول سعر الذهب" />
        <Faq items={faq} />
        <Updated />
      </section>

      <NewsletterBanner />
    </main>
  );
}
