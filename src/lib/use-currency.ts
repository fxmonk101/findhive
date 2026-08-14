import { countryOf, useLocale } from "@/lib/stores/locale";
import { useHydrated } from "@/lib/use-hydrated";

/** Formats prices in the visitor's selected country currency (cosmetic conversion). */
export function useCurrency() {
  const hydrated = useHydrated();
  const country = useLocale((s) => s.country);
  const c = countryOf(hydrated ? country : "US");
  return (n: number | null | undefined) => {
    if (n == null) return "";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: c.currency,
      currencyDisplay: "narrowSymbol",
      minimumFractionDigits: 2,
    }).format(n * c.rate);
  };
}
