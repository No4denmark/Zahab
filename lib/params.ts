import { notFound } from "next/navigation";
import { COUNTRIES, getCountry } from "./countries";
import { hasCalc, type CalcId } from "./market";
import { getLive } from "./live";
import { mergeLive } from "./live-shared";

export type CParams = { params: Promise<{ c: string }> };

export const allCountryParams = () => COUNTRIES.map((c) => ({ c: c.slug }));
export const countryParamsWith = (id: CalcId) => COUNTRIES.filter((c) => hasCalc(c, id)).map((c) => ({ c: c.slug }));

export async function resolveCountry(params: CParams["params"], calc?: CalcId) {
  const { c: slug } = await params;
  const c = getCountry(slug);
  if (!c || (calc && !hasCalc(c, calc))) notFound();
  return mergeLive(c, await getLive());
}

/** Snapshot country merged with the latest live prices, for server components. */
export async function liveCountry(slug: string) {
  return mergeLive(getCountry(slug), await getLive());
}
