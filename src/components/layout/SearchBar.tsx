import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Search, X, TrendingUp } from "lucide-react";
import { autocomplete } from "@/lib/products";
import { useCurrency } from "@/lib/use-currency";

const TRENDING = [
  "Charizard",
  "Booster pack",
  "Battle deck",
  "Mewtwo",
  "Vibration plate",
  "Automatic watch",
];

export function SearchBar({ variant = "light" }: { variant?: "light" | "dark" }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const money = useCurrency();

  const suggestions = useQuery({
    queryKey: ["autocomplete", q],
    queryFn: () => autocomplete(q, 6),
    enabled: q.trim().length >= 2,
    staleTime: 30_000,
  });

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const submit = (term: string) => {
    const t = term.trim();
    if (!t) return;
    setOpen(false);
    navigate({ to: "/search", search: { q: t } });
  };

  const dark = variant === "dark";

  return (
    <div ref={wrapRef} className="relative w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(q);
        }}
        role="search"
        className={`flex items-center gap-2 rounded-full border pl-4 pr-1.5 transition-all duration-200 ${
          dark
            ? "border-white/15 bg-white/10 text-navy-foreground focus-within:border-accent/70 focus-within:bg-white/15"
            : "border-border bg-surface focus-within:border-accent/70 focus-within:bg-card focus-within:shadow-card"
        }`}
      >
        <Search size={17} className={dark ? "shrink-0 opacity-70" : "shrink-0 text-muted-foreground"} />
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search Pokémon cards, watches, fitness gear…"
          aria-label="Search products"
          className={`h-11 min-w-0 flex-1 bg-transparent text-sm outline-none ${
            dark ? "placeholder:text-white/55" : "placeholder:text-muted-foreground"
          }`}
        />
        {q && (
          <button
            type="button"
            onClick={() => setQ("")}
            aria-label="Clear search"
            className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${dark ? "hover:bg-white/10" : "hover:bg-muted"}`}
          >
            <X size={15} />
          </button>
        )}
        <button
          type="submit"
          className="hidden h-9 shrink-0 items-center rounded-full bg-accent px-5 text-[13px] font-bold text-accent-foreground transition hover:brightness-95 sm:flex"
        >
          Search
        </button>
      </form>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-border bg-popover shadow-lift">
          {q.trim().length < 2 ? (
            <div className="p-4">
              <p className="eyebrow mb-3 flex items-center gap-1.5 text-muted-foreground">
                <TrendingUp size={13} className="text-accent" /> Trending searches
              </p>
              <div className="flex flex-wrap gap-2">
                {TRENDING.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => submit(t)}
                    className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground transition hover:border-accent hover:bg-accent/10"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          ) : suggestions.isLoading ? (
            <p className="p-4 text-sm text-muted-foreground">Searching…</p>
          ) : !suggestions.data?.length ? (
            <p className="p-4 text-sm text-muted-foreground">
              No matches for “{q}”. Try a set name or Pokémon.
            </p>
          ) : (
            <ul className="max-h-[380px] overflow-y-auto py-1.5">
              {suggestions.data.map((p) => (
                <li key={p.id}>
                  <Link
                    to="/product/$id"
                    params={{ id: p.id }}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 transition hover:bg-surface"
                  >
                    <img
                      src={p.image_url}
                      alt=""
                      loading="lazy"
                      className="h-11 w-11 shrink-0 rounded-lg border border-border bg-white object-contain p-1"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="line-clamp-2 block text-[13px] font-semibold leading-snug text-foreground">
                        {p.title}
                      </span>
                    </span>
                    <span className="shrink-0 text-sm font-bold text-primary">{money(p.price)}</span>
                  </Link>
                </li>
              ))}
              <li className="border-t border-border">
                <button
                  type="button"
                  onClick={() => submit(q)}
                  className="w-full px-4 py-2.5 text-left text-[13px] font-bold text-accent hover:bg-surface"
                >
                  See all results for “{q}” →
                </button>
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
