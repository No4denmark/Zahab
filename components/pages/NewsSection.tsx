import type { Country } from "@/lib/countries";
import { getNews } from "@/lib/news";
import { SectionHead } from "@/components/ui/Basics";
import { NewsTabs } from "./NewsTabs";

/** Latest headlines block for the home and country pages. */
export async function NewsSection({ c, id = "news" }: { c?: Country; id?: string }) {
  const feed = await getNews(c, 6);
  const slug = c?.slug ?? "ar-eg";
  return (
    <section className="container sec" id={id}>
      <SectionHead eb="آخر الأخبار" title={c ? `أخبار الذهب والاقتصاد في ${c.name}` : "أخبار الذهب والفضة والاقتصاد"} desc="أحدث العناوين من المصادر الإخبارية خلال الأسبوع الأخير — تتحدث تلقائياً." />
      <NewsTabs feed={feed} compact moreHref={`/${slug}/news`} />
    </section>
  );
}
