import "server-only";
import { unstable_cache } from "next/cache";
import { COUNTRIES } from "./countries";
import { OUNCE } from "./market";
import type { Live } from "./live-shared";

const ENDPOINT = "https://www.zahabprice.com/mcp";
export const LIVE_TTL = 60;

const num = (s?: string) => (s ? parseFloat(s.replace(/,/g, "")) : NaN);

async function callTool(name: string, args: Record<string, unknown>): Promise<string> {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json, text/event-stream" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name, arguments: args } }),
    signal: AbortSignal.timeout(8000),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`MCP ${name} ${res.status}`);
  const json = await res.json();
  const text = json?.result?.content?.[0]?.text;
  if (typeof text !== "string") throw new Error(`MCP ${name}: unexpected payload`);
  return text;
}

async function fetchLive(): Promise<Live> {
  const live: Live = { at: Date.now(), ok: false, ounce: OUNCE.usd, silverOunce: 0, marketOpen: null, gold: {}, silver: {} };
  const jobs = COUNTRIES.flatMap((c) => [
    callTool("get_gold_price", { country: c.code, karat: 24 }).then((t) => {
      const g = num(t.match(/24K gold:\s*([\d,.]+)/)?.[1]);
      if (g > 0) live.gold[c.code] = g;
      const oz = num(t.match(/Global spot:\s*\$([\d,.]+)/)?.[1]);
      if (oz > 0) live.ounce = oz;
      const m = t.match(/Market:\s*(\w+)/)?.[1];
      if (m) live.marketOpen = /open/i.test(m);
    }),
    callTool("get_silver_price", { country: c.code, purity: 999 }).then((t) => {
      const s = num(t.match(/999 purity silver:\s*([\d,.]+)/)?.[1]);
      if (s > 0) live.silver[c.code] = s;
      const oz = num(t.match(/Global spot:\s*\$([\d,.]+)/)?.[1]);
      if (oz > 0) live.silverOunce = oz;
    }),
  ]);
  const results = await Promise.allSettled(jobs);
  live.ok = results.some((r) => r.status === "fulfilled") && Object.keys(live.gold).length > 0;
  if (!live.ok) throw new Error("MCP unavailable");
  return live;
}

/** Cached for 60 s across all pages and the /api/prices route; falls back to the bundled snapshot when the MCP is down. */
const cached = unstable_cache(fetchLive, ["zahab-live-v1"], { revalidate: LIVE_TTL });

export async function getLive(): Promise<Live | null> {
  try {
    return await cached();
  } catch {
    return null;
  }
}
