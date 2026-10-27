/* Decorative SVG illustrations used by heroes and banners. */

function Ingot({ x, y, w = 150, tone = "gold", label }: { x: number; y: number; w?: number; tone?: "gold" | "silver"; label?: string }) {
  const h = w * 0.36, d = w * 0.16;
  const g = tone === "gold" ? ["#fff6b8", "#fed700", "#c9a800", "#9c8200"] : ["#ffffff", "#dfe3e8", "#aab2bc", "#7c858f"];
  const id = `${tone}${x}${y}`;
  return (
    <g transform={`translate(${x} ${y})`}>
      <defs>
        <linearGradient id={`t${id}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={g[0]} /><stop offset=".55" stopColor={g[1]} /><stop offset="1" stopColor={g[2]} /></linearGradient>
        <linearGradient id={`f${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={g[1]} /><stop offset="1" stopColor={g[3]} /></linearGradient>
      </defs>
      <path d={`M${d} 0H${w - d}L${w} ${h}H0Z`} fill={`url(#t${id})`} />
      <path d={`M0 ${h}H${w}L${w - d * 0.4} ${h + d}H${d * 0.4}Z`} fill={`url(#f${id})`} />
      {label && <text x={w / 2} y={h * 0.62} textAnchor="middle" fontSize={w * 0.085} fontWeight="800" fill={tone === "gold" ? "#5c4a00" : "#39414a"} fontFamily="inherit">{label}</text>}
    </g>
  );
}

function Coin({ cx, cy, r, tone = "gold" }: { cx: number; cy: number; r: number; tone?: "gold" | "silver" }) {
  const g = tone === "gold" ? ["#fff6c2", "#fed700", "#a88c00"] : ["#ffffff", "#d5dae0", "#8a929c"];
  const id = `c${tone}${cx}${cy}`;
  return (
    <g>
      <defs><radialGradient id={id} cx=".32" cy=".28"><stop offset="0" stopColor={g[0]} /><stop offset=".55" stopColor={g[1]} /><stop offset="1" stopColor={g[2]} /></radialGradient></defs>
      <ellipse cx={cx} cy={cy + r * 0.12} rx={r} ry={r} fill={g[2]} />
      <circle cx={cx} cy={cy} r={r} fill={`url(#${id})`} />
      <circle cx={cx} cy={cy} r={r * 0.78} fill="none" stroke={g[2]} strokeOpacity=".5" strokeDasharray="3 4" />
    </g>
  );
}

export function GoldStackArt({ tone = "gold" }: { tone?: "gold" | "silver" }) {
  return (
    <svg viewBox="0 0 420 360" width="100%" style={{ maxWidth: 460 }} aria-hidden="true">
      <ellipse cx="210" cy="320" rx="180" ry="22" fill="#000" opacity=".25" />
      <g className="float"><Ingot x={60} y={232} w={150} tone={tone} label="999.9" /><Ingot x={210} y={232} w={150} tone={tone} label="FINE" /></g>
      <g className="float d2"><Ingot x={135} y={168} w={150} tone={tone} label={tone === "gold" ? "GOLD 24K" : "SILVER 999"} /></g>
      <g className="float d3"><Coin cx={340} cy={110} r={34} tone={tone} /><Coin cx={78} cy={140} r={24} tone={tone} /></g>
      <g className="float"><Coin cx={230} cy={70} r={18} tone={tone} /></g>
      <g fill={tone === "gold" ? "#fed700" : "#e5e7eb"}>
        <path d="M120 60l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" opacity=".9" />
        <path d="M370 210l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" opacity=".7" />
        <path d="M40 260l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" opacity=".6" />
      </g>
    </svg>
  );
}

export function CoinsArt() {
  return (
    <svg viewBox="0 0 300 220" width="100%" style={{ maxWidth: 320 }} aria-hidden="true">
      {[0, 1, 2, 3, 4, 5].map((i) => <ellipse key={i} cx="110" cy={170 - i * 13} rx="62" ry="16" fill={i % 2 ? "#e0bd00" : "#fed700"} stroke="#a88c00" />)}
      {[0, 1, 2, 3].map((i) => <ellipse key={i} cx="210" cy={180 - i * 13} rx="52" ry="14" fill={i % 2 ? "#e0bd00" : "#fed700"} stroke="#a88c00" />)}
      <g className="float"><Coin cx={225} cy={70} r={38} /></g>
    </svg>
  );
}

export function CalcArt() {
  return (
    <svg viewBox="0 0 300 260" width="100%" style={{ maxWidth: 300 }} aria-hidden="true">
      <g className="float">
        <rect x="70" y="20" width="160" height="220" rx="26" fill="#232a31" />
        <rect x="88" y="40" width="124" height="54" rx="12" fill="#fed700" />
        <text x="200" y="76" textAnchor="end" fontSize="24" fontWeight="800" fill="#232a31" fontFamily="inherit">7,105</text>
        {[0, 1, 2, 3].map((r) => [0, 1, 2].map((c) => (
          <rect key={`${r}${c}`} x={90 + c * 42} y={108 + r * 32} width="34" height="24" rx="7" fill={r === 3 && c === 2 ? "#fed700" : "#3a444f"} />
        )))}
      </g>
      <g className="float d2"><Coin cx={250} cy={60} r={26} /></g>
      <g className="float d3"><Coin cx={46} cy={200} r={20} /></g>
    </svg>
  );
}

export function BellArt() {
  return (
    <svg viewBox="0 0 260 220" width="100%" style={{ maxWidth: 260 }} aria-hidden="true">
      <circle cx="130" cy="110" r="90" fill="#fed700" opacity=".12" />
      <circle cx="130" cy="110" r="60" fill="#fed700" opacity=".18" />
      <g className="float">
        <path d="M95 125V98a35 35 0 0 1 70 0v27l12 16H83z" fill="#fed700" />
        <circle cx="130" cy="152" r="10" fill="#fed700" />
        <circle cx="165" cy="72" r="14" fill="#e11d48" />
        <text x="165" y="77" textAnchor="middle" fontSize="14" fontWeight="800" fill="#fff">1</text>
      </g>
    </svg>
  );
}

export function PhoneArt() {
  return (
    <svg viewBox="0 0 260 260" width="100%" style={{ maxWidth: 260 }} aria-hidden="true">
      <g className="float">
        <rect x="70" y="10" width="120" height="240" rx="24" fill="#232a31" />
        <rect x="80" y="26" width="100" height="208" rx="14" fill="#2c343d" />
        <rect x="92" y="44" width="76" height="44" rx="10" fill="#fed700" />
        <text x="130" y="72" textAnchor="middle" fontSize="16" fontWeight="800" fill="#232a31" fontFamily="inherit">482.15</text>
        {[0, 1, 2, 3].map((i) => <rect key={i} x="92" y={100 + i * 26} width="76" height="18" rx="6" fill="#3a444f" />)}
        <path d="M95 210l15-14 12 8 20-20 18 10" stroke="#fed700" strokeWidth="3" fill="none" />
      </g>
    </svg>
  );
}

export function GlobeArt() {
  const dots: [number, number][] = [[60, 90], [95, 70], [130, 100], [150, 80], [180, 120], [110, 140], [75, 130], [160, 150], [200, 95], [130, 60], [90, 170], [175, 175]];
  return (
    <svg viewBox="0 0 260 260" width="100%" style={{ maxWidth: 300 }} aria-hidden="true">
      <circle cx="130" cy="125" r="100" fill="none" stroke="#fed700" strokeOpacity=".35" />
      <ellipse cx="130" cy="125" rx="45" ry="100" fill="none" stroke="#fed700" strokeOpacity=".25" />
      <ellipse cx="130" cy="125" rx="100" ry="38" fill="none" stroke="#fed700" strokeOpacity=".25" />
      {dots.map(([x, y], i) => (
        <g key={i}><circle cx={x} cy={y} r="5" fill="#fed700"><animate attributeName="r" values="4;7;4" dur={`${2 + (i % 4) * 0.5}s`} repeatCount="indefinite" /></circle></g>
      ))}
    </svg>
  );
}
