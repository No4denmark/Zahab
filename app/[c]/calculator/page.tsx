import type { Metadata } from "next";
import Link from "next/link";
import { allCountryParams, resolveCountry, type CParams } from "@/lib/params";
import { getCountry } from "@/lib/countries";
import { calcsFor, gold, money } from "@/lib/market";
import { Crumbs, Faq, Flag, SectionHead, Updated } from "@/components/ui/Basics";
import { CalcIcon } from "@/components/ui/Icons";
import { CalcArt } from "@/components/ui/Art";
import { NewsletterBanner } from "@/components/ui/Banners";

export const dynamicParams = false;
export const generateStaticParams = allCountryParams;

export async function generateMetadata({ params }: CParams): Promise<Metadata> {
  const c = getCountry((await params).c);
  return c ? { title: `حاسبات الذهب في ${c.name} 2026 - تحويل العيار والبيع والشراء`, description: `أدوات مجانية لحساب قيمة الذهب بالـ${c.curName}: تحويل العيارات، بيع المستعمل، الشراء والزكاة.` } : {};
}

const FAQ: [string, string][] = [
  ["ما هي أدق حاسبة ذهب؟", "جميع حاسباتنا تستخدم أحدث أسعار الذهب العالمية والمحلية. حاسبة قيمة الذهب هي الأكثر شمولاً وتدعم جميع العيارات (24، 22، 21، 18، 14) والأوزان (جرام، مثقال، أونصة)."],
  ["هل الحاسبات مجانية؟", "نعم، جميع حاسبات ذهب برايس مجانية 100% للأبد وبدون حدود استخدام. لا نطلب تسجيلاً أو اشتراكاً أو رسوماً."],
  ["هل الأسعار محدثة؟", "نعم، نحدّث أسعار الذهب من مصادر موثوقة عالمية ومحلية، ونعرض وقت آخر تحديث في كل صفحة حاسبة."],
];

export default async function CalcHub({ params }: CParams) {
  const c = await resolveCountry(params);
  const list = calcsFor(c);
  return (
    <main>
      <section className="hero">
        <div className="container hero-in">
          <div>
            <Crumbs items={[["الرئيسية", "/"], [c.name, `/${c.slug}`], ["حاسبات الذهب"]]} />
            <span className="kicker"><Flag code={c.code} /> {list.length} حاسبات مجانية</span>
            <h1>حاسبات الذهب في <span className="hl">{c.name}</span></h1>
            <p className="lead">أدوات مجانية لحساب قيمة الذهب بالـ{c.curName}: تحويل العيارات (24→21→18)، بيع الذهب المستعمل، سعر الشراء مع المصنعية، وزكاة الذهب. سعر عيار 24 الآن: <b className="n">{money(c, c.g24)}</b> {c.curName} للجرام.</p>
            <div className="chips dark" style={{ marginTop: 22 }}>
              <span className="chip"><span className="pulse" /> محدثة كل دقيقة</span><span className="chip">دقة عالية</span><span className="chip">مجانية 100%</span><span className="chip">جميع العيارات</span>
            </div>
          </div>
          <div className="hero-art"><CalcArt /></div>
        </div>
      </section>

      <section className="container sec">
        <SectionHead eb="جميع الحاسبات" title="حاسبات الذهب والمجوهرات" />
        <div className="related rv">
          {list.map((x, i) => (
            <Link key={x.id} className={`calc-card${i === 0 ? " feature" : ""}`} href={`/${c.slug}/calculator/${x.id}`}>
              {x.hot && <span className="badge hot">🔥 شائع</span>}
              <span className="ci"><CalcIcon id={x.icon} /></span>
              <h3>{x.title}</h3>
              <p>{x.desc(c)}</p>
              <span className="go">احسب الآن ←</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container sec">
        <SectionHead eb="أسعار العيارات اليوم" title={`أسعار الذهب في ${c.name} الآن`} />
        <div className="grid-4 rv">
          {c.karats.map((k) => (
            <Link key={k} href={`/${c.slug}`} className="card kcard">
              <div className="k-top"><div className="ring" style={{ ["--p" as string]: (k / 24) * 100 }}><span>{k}</span></div></div>
              <div className="k-price"><span className="n">{money(c, gold(c, k))}</span><small>{c.curShort}</small></div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container sec">
        <SectionHead eb="الأسئلة الشائعة" title="الأسئلة الشائعة عن حاسبات الذهب" />
        <Faq items={FAQ} one />
        <Updated reviewed="07 سبتمبر 2026" />
      </section>

      <NewsletterBanner />
    </main>
  );
}
