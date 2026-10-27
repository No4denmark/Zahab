import type { Country } from "./countries";

/** Live snapshot pulled from the zahabprice MCP server (see lib/live.ts). Safe to import on the client. */
export type Live = {
  at: number;
  ok: boolean;
  ounce: number;
  silverOunce: number;
  marketOpen: boolean | null;
  gold: Record<string, number>;
  silver: Record<string, number>;
};

/** Overlay live 24K / silver prices on a country's snapshot data; bullion premiums scale with the 24K move. */
export function mergeLive(c: Country, live: Live | null): Country {
  const g = live?.gold[c.code];
  if (!g) return live?.silver[c.code] ? { ...c, s999: live.silver[c.code] } : c;
  const k = g / c.g24;
  return { ...c, g24: g, bars: c.bars.map(([n, kt, p]) => [n, kt, p * k]), s999: live?.silver[c.code] ?? c.s999 };
}
