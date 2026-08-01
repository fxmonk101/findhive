import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Language = { code: string; label: string };
export type Country = { code: string; label: string; flag: string; currency: string; symbol: string; rate: number };

export const LANGUAGES: Language[] = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
];

export const COUNTRIES: Country[] = [
  { code: "US", label: "United States", flag: "🇺🇸", currency: "USD", symbol: "$", rate: 1 },
  { code: "CA", label: "Canada", flag: "🇨🇦", currency: "CAD", symbol: "CA$", rate: 1.37 },
  { code: "GB", label: "United Kingdom", flag: "🇬🇧", currency: "GBP", symbol: "£", rate: 0.79 },
  { code: "AU", label: "Australia", flag: "🇦🇺", currency: "AUD", symbol: "A$", rate: 1.52 },
  { code: "DE", label: "Germany", flag: "🇩🇪", currency: "EUR", symbol: "€", rate: 0.92 },
];

type LocaleState = {
  language: string;
  country: string;
  setLanguage: (code: string) => void;
  setCountry: (code: string) => void;
};

export const useLocale = create<LocaleState>()(
  persist(
    (set) => ({
      language: "en",
      country: "US",
      setLanguage: (language) => set({ language }),
      setCountry: (country) => set({ country }),
    }),
    { name: "findhive-locale" },
  ),
);

export function languageLabel(code: string) {
  return LANGUAGES.find((l) => l.code === code)?.label ?? "English";
}

export function countryOf(code: string): Country {
  return COUNTRIES.find((c) => c.code === code) ?? COUNTRIES[0];
}
