import type { Metadata } from "next";
import { allCountryParams, resolveCountry, type CParams } from "@/lib/params";
import { ConverterPage } from "@/components/calc/ConverterPage";

export const dynamicParams = false;
export const generateStaticParams = allCountryParams;
export const metadata: Metadata = { title: "حاسبة تحويل عيار الذهب - حوّل بين عيار 24، 21، 18 بدقة" };

export default async function Page({ params }: CParams) {
  return <ConverterPage c={await resolveCountry(params)} />;
}
