import { COUNTRIES } from "@/lib/countries";

/** Issuing country (flagcdn code) and symbol for each currency we quote. */
const META: Record<string, [flag: string, symbol: string]> = {
  USD: ["us", "$"], EUR: ["eu", "€"], GBP: ["gb", "£"], SAR: ["sa", "﷼"], AED: ["ae", "د.إ"], KWD: ["kw", "د.ك"],
  BHD: ["bh", ".د.ب"], OMR: ["om", "ر.ع"], QAR: ["qa", "ر.ق"], JOD: ["jo", "د.أ"], CHF: ["ch", "Fr"], JPY: ["jp", "¥"],
  CNY: ["cn", "¥"], CAD: ["ca", "C$"], AUD: ["au", "A$"], SEK: ["se", "kr"], NOK: ["no", "kr"], DKK: ["dk", "kr"],
  EGP: ["eg", "£E"], TRY: ["tr", "₺"], ILS: ["ps", "₪"],
};

export function currencyMeta(code: string): [string, string] {
  if (META[code]) return META[code];
  const c = COUNTRIES.find((x) => x.cur === code);
  return [c?.code ?? "un", c?.curShort ?? code];
}

export function CurrencyLogo({ code, size = 44 }: { code: string; size?: number }) {
  const [flag, symbol] = currencyMeta(code);
  return (
    <span className="cur-logo" style={{ width: size, height: size }} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`https://flagcdn.com/w80/${flag}.png`} alt="" loading="lazy" width={size} height={size} />
      <b>{symbol}</b>
    </span>
  );
}
