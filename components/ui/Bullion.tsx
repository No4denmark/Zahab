"use client";
import { useId } from "react";

export type BullionKind = "minted" | "cast" | "coin";

/** Short hallmark label for a bar or coin weight. */
export function weightMark(g: number) {
  if (g >= 1000) return `${g / 1000} kg`;
  const oz: Record<string, string> = { "31.1": "1 oz", "15.55": "½ oz", "7.78": "¼ oz", "3.11": "1/10 oz", "311": "10 oz", "116.6": "10 tola" };
  return oz[String(g)] ?? `${g} g`;
}

export function bullionKind(name: string, karat: number, grams: number): BullionKind {
  if (!/^سبيكة/.test(name) && (karat < 24 || /[A-Za-z]|جنيه|ليرة|لويزة/.test(name))) return "coin";
  return grams >= 250 ? "cast" : "minted";
}

const coinTitle = (name: string) => {
  const n = name.replace(/\s*\(.*\)/, "").replace(/\s*-\s*(عُشر|ربع|نصف)?\s*أونصة.*/, "");
  if (/Krugerrand/.test(n)) return "KRUGERRAND";
  if (/Maple/.test(n)) return "MAPLE LEAF";
  if (/Eagle/.test(n)) return "EAGLE";
  if (/Buffalo/.test(n)) return "BUFFALO";
  if (/Britannia/.test(n)) return "BRITANNIA";
  if (/Philharmoniker/.test(n)) return "PHILHARMONIC";
  if (/Sovereign/.test(n)) return "SOVEREIGN";
  if (/Vreneli/.test(n)) return "VRENELI";
  if (/لويزة/.test(n)) return "LOUIS D'OR";
  if (/ليرة تركية/.test(n)) return "ATATÜRK";
  if (/رشادية/.test(n)) return "RESHADI";
  if (/ليرة/.test(n)) return "LIRA";
  return "GOLD POUND";
};

const GOLD = ["#fff7c4", "#ffe14d", "#fed700", "#d9b400", "#a88a00", "#6e5a00"];

function MintedBar({ grams, karat }: { grams: number; karat: number }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 120 190" className="bullion minted" aria-hidden="true">
      <defs>
        <linearGradient id={`b${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={GOLD[0]} /><stop offset=".28" stopColor={GOLD[1]} /><stop offset=".55" stopColor={GOLD[3]} /><stop offset=".8" stopColor={GOLD[1]} /><stop offset="1" stopColor={GOLD[4]} />
        </linearGradient>
        <linearGradient id={`p${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={GOLD[2]} /><stop offset="1" stopColor={GOLD[3]} />
        </linearGradient>
        <clipPath id={`c${id}`}><rect x="4" y="4" width="112" height="182" rx="12" /></clipPath>
        <pattern id={`g${id}`} width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="5" cy="5" r="4" fill="none" stroke={GOLD[4]} strokeOpacity=".18" strokeWidth=".6" /></pattern>
      </defs>
      <rect x="4" y="8" width="112" height="182" rx="12" fill="#000" opacity=".25" />
      <rect x="4" y="4" width="112" height="182" rx="12" fill={`url(#b${id})`} />
      <rect x="10" y="10" width="100" height="170" rx="8" fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth="1.2" />
      <rect x="15" y="15" width="90" height="160" rx="6" fill={`url(#p${id})`} stroke={GOLD[4]} strokeOpacity=".55" />
      <rect x="15" y="15" width="90" height="160" rx="6" fill={`url(#g${id})`} />
      {/* brand */}
      <g transform="translate(51 24) scale(.75)" fill={GOLD[5]}>
        <path d="M3 19 6 13h5l3 6z" /><path d="M10 19l3-6h5l3 6z" opacity=".75" /><path d="M6.5 12 9.5 6h5l3 6z" opacity=".9" />
      </g>
      <text x="60" y="52" textAnchor="middle" fontSize="7.5" fontWeight="800" letterSpacing="1.4" fill={GOLD[5]}>ZAHAB PRICE</text>
      <line x1="30" y1="60" x2="90" y2="60" stroke={GOLD[5]} strokeOpacity=".4" />
      <text x="60" y="96" textAnchor="middle" fontSize={weightMark(grams).length > 5 ? 17 : 23} fontWeight="900" fill={GOLD[5]}>{weightMark(grams)}</text>
      <text x="60" y="114" textAnchor="middle" fontSize="8" fontWeight="800" letterSpacing="1.6" fill={GOLD[5]}>FINE GOLD</text>
      <text x="60" y="131" textAnchor="middle" fontSize="12" fontWeight="800" fill={GOLD[5]}>{karat === 24 ? "999.9" : `${karat}K`}</text>
      <circle cx="60" cy="152" r="10" fill="none" stroke={GOLD[5]} strokeOpacity=".55" />
      <text x="60" y="155.5" textAnchor="middle" fontSize="8" fontWeight="900" fill={GOLD[5]}>{karat}K</text>
      <text x="60" y="172" textAnchor="middle" fontSize="6" fontWeight="700" letterSpacing="1" fill={GOLD[5]} opacity=".7">ZP {String(Math.round(grams * 100)).padStart(6, "0")}</text>
      <g clipPath={`url(#c${id})`}><rect className="sheen" x="-60" y="-20" width="40" height="240" fill="#fff" opacity=".45" transform="rotate(20 60 95)" /></g>
    </svg>
  );
}

function CastBar({ grams, karat }: { grams: number; karat: number }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 220 130" className="bullion cast" aria-hidden="true">
      <defs>
        <linearGradient id={`t${id}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={GOLD[0]} /><stop offset=".45" stopColor={GOLD[1]} /><stop offset="1" stopColor={GOLD[3]} /></linearGradient>
        <linearGradient id={`f${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={GOLD[3]} /><stop offset="1" stopColor={GOLD[5]} /></linearGradient>
        <linearGradient id={`s${id}`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={GOLD[4]} /><stop offset="1" stopColor={GOLD[5]} /></linearGradient>
        <clipPath id={`c${id}`}><path d="M38 18H182L204 82H16Z" /></clipPath>
      </defs>
      <ellipse cx="110" cy="120" rx="98" ry="8" fill="#000" opacity=".35" />
      <path d="M16 82H204L196 110H24Z" fill={`url(#f${id})`} />
      <path d="M204 82 182 18 190 18 212 80 Z" fill={`url(#s${id})`} opacity=".9" />
      <path d="M38 18H182L204 82H16Z" fill={`url(#t${id})`} />
      {/* cast texture */}
      {[[60, 30], [150, 34], [90, 70], [170, 66], [48, 64], [128, 26]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={2 + (i % 3)} ry="1.2" fill={GOLD[4]} opacity=".35" />)}
      <rect x="74" y="32" width="72" height="38" rx="6" fill="none" stroke={GOLD[5]} strokeOpacity=".55" strokeWidth="1.4" />
      <text x="110" y="50" textAnchor="middle" fontSize="15" fontWeight="900" fill={GOLD[5]}>{weightMark(grams).toUpperCase()}</text>
      <text x="110" y="63" textAnchor="middle" fontSize="7.5" fontWeight="800" letterSpacing="1.2" fill={GOLD[5]}>{karat === 24 ? "999.9 FINE GOLD" : `${karat}K GOLD`}</text>
      <text x="110" y="96" textAnchor="middle" fontSize="7" fontWeight="800" letterSpacing="2" fill={GOLD[0]} opacity=".75">ZAHAB PRICE · ZP{String(grams).padStart(5, "0")}</text>
      <g clipPath={`url(#c${id})`}><rect className="sheen" x="-40" y="-20" width="34" height="160" fill="#fff" opacity=".45" transform="rotate(25 110 50)" /></g>
    </svg>
  );
}

function Coin({ name, grams, karat }: { name: string; grams: number; karat: number }) {
  const id = useId().replace(/:/g, "");
  const title = coinTitle(name);
  return (
    <svg viewBox="0 0 150 150" className="bullion coin" aria-hidden="true">
      <defs>
        <radialGradient id={`r${id}`} cx=".35" cy=".3" r=".8"><stop offset="0" stopColor={GOLD[0]} /><stop offset=".45" stopColor={GOLD[2]} /><stop offset=".85" stopColor={GOLD[3]} /><stop offset="1" stopColor={GOLD[4]} /></radialGradient>
        <path id={`a${id}`} d="M75 75 m-46 0 a46 46 0 1 1 92 0" />
        <path id={`b${id}`} d="M75 75 m-50 0 a50 50 0 0 0 100 0" />
        <clipPath id={`c${id}`}><circle cx="75" cy="75" r="66" /></clipPath>
      </defs>
      <ellipse cx="75" cy="144" rx="52" ry="5" fill="#000" opacity=".3" />
      <circle cx="75" cy="78" r="67" fill={GOLD[5]} />
      <circle cx="75" cy="75" r="67" fill={GOLD[4]} />
      <circle cx="75" cy="75" r="64" fill="none" stroke={GOLD[1]} strokeWidth="5" strokeDasharray="1.3 1.3" opacity=".9" />
      <circle cx="75" cy="75" r="60" fill={`url(#r${id})`} />
      <circle cx="75" cy="75" r="55" fill="none" stroke={GOLD[5]} strokeOpacity=".45" />
      <circle cx="75" cy="75" r="38" fill="none" stroke={GOLD[5]} strokeOpacity=".35" strokeDasharray="2 3" />
      <text fontSize="9" fontWeight="900" letterSpacing="2" fill={GOLD[5]}><textPath href={`#a${id}`} startOffset="50%" textAnchor="middle">{title}</textPath></text>
      <text fontSize="7.5" fontWeight="800" letterSpacing="1.5" fill={GOLD[5]} opacity=".8"><textPath href={`#b${id}`} startOffset="50%" textAnchor="middle">{`${karat}K · ${weightMark(grams).toUpperCase()}`}</textPath></text>
      {/* emblem: laurel + star */}
      <g fill={GOLD[5]} opacity=".85">
        <path d="M75 52l5.6 11.4 12.6 1.8-9.1 8.9 2.2 12.5L75 80.7l-11.3 5.9 2.2-12.5-9.1-8.9 12.6-1.8z" />
        {[0, 1, 2, 3].map((i) => <ellipse key={`l${i}`} cx={52 - i * 1.5} cy={92 - i * 8} rx="3" ry="6" transform={`rotate(${-35 + i * 12} ${52 - i * 1.5} ${92 - i * 8})`} />)}
        {[0, 1, 2, 3].map((i) => <ellipse key={`r${i}`} cx={98 + i * 1.5} cy={92 - i * 8} rx="3" ry="6" transform={`rotate(${35 - i * 12} ${98 + i * 1.5} ${92 - i * 8})`} />)}
      </g>
      <text x="75" y="104" textAnchor="middle" fontSize="9" fontWeight="900" fill={GOLD[5]}>{karat === 21.6 ? "900" : karat >= 24 ? "999.9" : `${Math.round((karat / 24) * 1000)}`}</text>
      <g clipPath={`url(#c${id})`}><rect className="sheen" x="-40" y="-10" width="28" height="170" fill="#fff" opacity=".5" transform="rotate(25 75 75)" /></g>
    </svg>
  );
}

export function BullionIcon({ name, grams, karat }: { name: string; grams: number; karat: number }) {
  const kind = bullionKind(name, karat, grams);
  if (kind === "coin") return <Coin name={name} grams={grams} karat={karat} />;
  if (kind === "cast") return <CastBar grams={grams} karat={karat} />;
  return <MintedBar grams={grams} karat={karat} />;
}
