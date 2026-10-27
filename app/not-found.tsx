import Link from "next/link";
import { GoldStackArt } from "@/components/ui/Art";

export default function NotFound() {
  return (
    <main>
      <section className="hero">
        <div className="container hero-in">
          <div>
            <span className="kicker">خطأ 404</span>
            <h1>هذه الصفحة <span className="hl">غير موجودة</span></h1>
            <p className="lead">ربما نُقلت أو أن هذه الحاسبة غير متاحة في الدولة المختارة.</p>
            <div className="hero-cta"><Link className="btn btn-y" href="/">أسعار الذهب في جميع الدول ←</Link></div>
          </div>
          <div className="hero-art"><GoldStackArt /></div>
        </div>
      </section>
    </main>
  );
}
