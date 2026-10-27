import type { Metadata } from "next";
import Link from "next/link";
import { allCountryParams, resolveCountry, type CParams } from "@/lib/params";
import { getCountry } from "@/lib/countries";
import { getNews } from "@/lib/news";
import { money } from "@/lib/market";
import { Crumbs, Flag } from "@/components/ui/Basics";
import { NewsTabs } from "@/components/pages/NewsTabs";
import { CalcBanner } from "@/components/ui/Banners";

export const dynamicParams = false;
export const generateStaticParams = allCountryParams;
export const revalidate = 900;

export async function generateMetadata({ params }: CParams): Promise<Metadata> {
  const c = getCountry((await params).c);
  return c ? { title: `أخبار الذهب والفضة والاقتصاد في ${c.name}`, description: `آخر أخبار أسعار الذهب والفضة والاقتصاد في ${c.name} — تحديث مستمر من المصادر الإخبارية.` } : {};
}

export default async function NewsPage({ params }: CParams) {
  const c = await resolveCountry(params);
  const feed = await getNews(c, 30);
  return (
    <main>
      <section className="hero">
        <div className="container hero-in" style={{ gridTemplateColumns: "1fr" }}>
          <div>
            <Crumbs items={[["الرئيسية", "/"], [c.name, `/${c.slug}`], ["الأخبار"]]} />
            <span className="kicker"><Flag code={c.code} /> عيار 24 الآن <span className="n">{money(c, c.g24)}</span> {c.curShort}</span>
            <h1>أخبار الذهب والفضة <span className="hl">والاقتصاد</span></h1>
            <p className="lead">آخر العناوين عن أسعار الذهب والفضة والدولار والبورصة في {c.name} والعالم — مجمّعة تلقائياً وتتحدث كل 15 دقيقة.</p>
            <div className="hero-cta"><Link className="btn btn-y" href={`/${c.slug}`}>أسعار الذهب في {c.name} ←</Link></div>
          </div>
        </div>
      </section>
      <section className="container sec">
        <NewsTabs feed={feed} />
      </section>
      <CalcBanner c={c} />
    </main>
  );
}
