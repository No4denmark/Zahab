import Anthropic from "@anthropic-ai/sdk";
import { BY_SLUG } from "@/lib/countries";
import { getLive } from "@/lib/live";
import { localAnswer, priceSheet } from "@/lib/assistant";

export const dynamic = "force-dynamic";

type ChatTurn = { role: "user" | "assistant"; content: string };

const SYSTEM = `أنت «مساعد ذهب برايس»، مساعد عربي لموقع zahabprice.com المتخصص في أسعار الذهب والفضة في 37 دولة.
- أجب بالعربية الفصحى المبسطة، باختصار ووضوح، واستخدم الأرقام من جدول الأسعار المرفق فقط (سعر الجرام بالعملة المحلية، بدون مصنعية أو ضريبة).
- احسب القيم بدقة: القيمة = الوزن × سعر العيار. الذهب الخالص = الوزن × العيار ÷ 24. نصاب الزكاة 85 جرام خالص و2.5% بعد حول هجري (354 يوماً). المثقال 4.25 جم، الأونصة 31.1035 جم.
- إن لم يذكر المستخدم دولة فاعتمد دولة الصفحة الحالية.
- لست مستشاراً مالياً: لا تعطِ توصيات شراء أو بيع أو توقعات أسعار، ونبّه أن أسعار المحلات تختلف بالمصنعية والضريبة.
- اختم عند الحاجة باقتراح الحاسبة المناسبة في الموقع.
- أعد في آخر ردك سطراً يبدأ بـ «اقتراحات:» يتبعه 3 أسئلة متابعة قصيرة مفصولة بـ «|».`;

function splitSuggestions(text: string) {
  const m = text.match(/\n?اقتراحات:\s*(.+)\s*$/);
  if (!m) return { text: text.trim(), suggestions: [] as string[] };
  return { text: text.slice(0, m.index).trim(), suggestions: m[1].split("|").map((s) => s.trim()).filter(Boolean).slice(0, 3) };
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { messages?: ChatTurn[]; country?: string } | null;
  const turns = (body?.messages ?? []).filter((m) => m && typeof m.content === "string" && m.content.trim()).slice(-12);
  const last = turns[turns.length - 1];
  if (!last || last.role !== "user" || last.content.length > 1000) return Response.json({ error: "bad request" }, { status: 400 });

  const country = BY_SLUG[body?.country ?? ""] ?? BY_SLUG["ar-eg"];
  const live = await getLive();

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ ...localAnswer(last.content, country, live), engine: "local" });
  }

  try {
    const client = new Anthropic();
    const status = live ? `آخر تحديث: ${new Date(live.at).toISOString()} · السوق ${live.marketOpen === false ? "مغلق" : "مفتوح"} · الأونصة $${live.ounce} · فضة/أونصة $${live.silverOunce}` : "تعذر جلب الأسعار اللحظية — الأسعار من آخر نسخة محفوظة.";
    const response = await client.beta.messages.create({
      model: "claude-opus-5-5",
      max_tokens: 2000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "low" },
      system: [
        { type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } },
        { type: "text", text: `دولة الصفحة الحالية: ${country.name} (${country.cur}).\n${status}\nجدول الأسعار (جرام):\n${priceSheet(live)}` },
      ],
      messages: turns.map((t) => ({ role: t.role, content: t.content })),
    });
    if (response.stop_reason === "refusal") {
      return Response.json({ ...localAnswer(last.content, country, live), engine: "local" });
    }
    const text = response.content.flatMap((b) => (b.type === "text" ? [b.text] : [])).join("\n");
    return Response.json({ ...splitSuggestions(text), engine: "claude" });
  } catch (error) {
    if (error instanceof Anthropic.APIError) console.error(`Claude API error ${error.status}:`, error.message);
    else console.error("chat error", error);
    return Response.json({ ...localAnswer(last.content, country, live), engine: "local" });
  }
}
