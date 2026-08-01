import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { COUNTRIES, LANGUAGES, countryOf, languageLabel, useLocale } from "@/lib/stores/locale";
import { useHydrated } from "@/lib/use-hydrated";

/** Compact inline switchers for the desktop utility bar. */
export function LocaleSwitcher() {
  const hydrated = useHydrated();
  const language = useLocale((s) => s.language);
  const country = useLocale((s) => s.country);
  const setLanguage = useLocale((s) => s.setLanguage);
  const setCountry = useLocale((s) => s.setCountry);
  const c = countryOf(hydrated ? country : "US");

  return (
    <div className="flex items-center gap-3">
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex items-center gap-1 hover:text-accent focus:outline-none">
          <Globe size={12} /> {hydrated ? languageLabel(language) : "English"} <span aria-hidden>⌄</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="z-[60] w-44">
          <DropdownMenuLabel>Language</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={language} onValueChange={setLanguage}>
            {LANGUAGES.map((l) => (
              <DropdownMenuRadioItem key={l.code} value={l.code}>{l.label}</DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <span className="opacity-30">|</span>
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex items-center gap-1 hover:text-accent focus:outline-none">
          <span aria-hidden>{c.flag}</span> {c.label} <span aria-hidden>⌄</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="z-[60] w-52">
          <DropdownMenuLabel>Ship to / currency</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={country} onValueChange={setCountry}>
            {COUNTRIES.map((x) => (
              <DropdownMenuRadioItem key={x.code} value={x.code}>
                <span className="mr-2" aria-hidden>{x.flag}</span>
                {x.label}
                <span className="ml-auto pl-3 text-xs text-muted-foreground">{x.currency}</span>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

/** Amazon-style single row for the mobile slide-out menu. */
export function MobileLocaleRow() {
  const hydrated = useHydrated();
  const language = useLocale((s) => s.language);
  const country = useLocale((s) => s.country);
  const setLanguage = useLocale((s) => s.setLanguage);
  const setCountry = useLocale((s) => s.setCountry);
  const c = countryOf(hydrated ? country : "US");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-full items-center justify-between rounded-xl bg-muted px-4 py-3 text-sm font-semibold text-primary focus:outline-none">
        <span className="flex items-center gap-2">
          <Globe size={16} className="text-accent" />
          {hydrated ? languageLabel(language) : "English"}
          <span className="opacity-40">/</span>
          <span aria-hidden>{c.flag}</span> {c.label}
        </span>
        <span aria-hidden className="text-muted-foreground">⌄</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="z-[60] w-64">
        <DropdownMenuLabel>Language</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={language} onValueChange={setLanguage}>
          {LANGUAGES.map((l) => (
            <DropdownMenuRadioItem key={l.code} value={l.code}>{l.label}</DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Ship to / currency</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={country} onValueChange={setCountry}>
          {COUNTRIES.map((x) => (
            <DropdownMenuRadioItem key={x.code} value={x.code}>
              <span className="mr-2" aria-hidden>{x.flag}</span>
              {x.label}
              <span className="ml-auto pl-3 text-xs text-muted-foreground">{x.currency}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled className="text-xs text-muted-foreground">
          Prices shown in {c.currency}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
