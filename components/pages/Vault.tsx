import type { Country } from "@/lib/countries";
import { barGrams, money } from "@/lib/market";
import { VaultGrid } from "./VaultGrid";

export function Vault({ c, title, desc }: { c: Country; title: string; desc: string }) {
  const big = c.bars[c.bars.length - 1], small = c.bars[0];
  const gBig = barGrams(big[0]), gSmall = barGrams(small[0]);
  const perBig = big[2] / gBig, perSmall = small[2] / gSmall;
  const oz = c.bars.find(([n]) => n.includes("أونصة (31.1"));
  return (
    <section className="dark-sec" id="bullion">
      <div className="container">
        <div className="sec-head rv">
          <div><div className="eb">خزنة السبائك</div><h2>{title}</h2><p>{desc}</p></div>
          <span className="badge">{c.bars.length} قطعة · محدّثة لحظياً</span>
        </div>
      </div>
      <div className="container">
        <VaultGrid slug={c.slug} />
        <p className="rv" style={{ color: "#aeb6bf", marginTop: 10, fontSize: 15 }}>
          تبدأ الأسعار من {small[0]} بسعر <b className="n" style={{ color: "var(--y)" }}>{money(c, small[2])}</b> {c.curName} وتصل إلى {big[0]} بسعر <b className="n" style={{ color: "var(--y)" }}>{money(c, big[2])}</b> {c.curName}.
          {" "}سعر الجرام داخل السبيكة الكبيرة يقارب <b className="n">{money(c, perBig)}</b> مقابل <b className="n">{money(c, perSmall)}</b> للصغيرة
          {perSmall > perBig ? <> — الكبيرة أرخص بنسبة <b className="n">{(((perSmall - perBig) / perSmall) * 100).toFixed(2)}%</b> للجرام.</> : "."}
          {oz && <> الأوقية الطروادية تُسعَّر اليوم بـ <b className="n">{money(c, oz[2])}</b> {c.curName}.</>}
        </p>
      </div>
    </section>
  );
}
