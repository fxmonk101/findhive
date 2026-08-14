import { useCallback } from "react";
import { useLocale } from "@/lib/stores/locale";
import { useHydrated } from "@/lib/use-hydrated";
import { translate, type TKey } from "./dictionaries";

export type { TKey };
export { translate };

/** Returns a translator bound to the visitor's selected language. */
export function useT() {
  const hydrated = useHydrated();
  const language = useLocale((s) => s.language);
  const lang = hydrated ? language : "en";
  return useCallback((key: TKey) => translate(lang, key), [lang]);
}
