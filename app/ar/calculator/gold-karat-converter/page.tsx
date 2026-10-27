import type { Metadata } from "next";
import { BY_SLUG } from "@/lib/countries";
import { ConverterPage } from "@/components/calc/ConverterPage";

export const metadata: Metadata = { title: "حاسبة تحويل عيار الذهب - حوّل بين عيار 24، 21، 18 بدقة" };

export default function Page() {
  return <ConverterPage c={BY_SLUG["ar-eg"]} />;
}
