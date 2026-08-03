import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight, Sparkles } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import { COLLECTIONS } from "@/lib/collections";

const POKEMON_COLLECTIONS = COLLECTIONS.filter((c) => c.subcategory === "pokemon-tcg");

const FEATURED_BY_CATEGORY: Record<string, string[]> = {
  "trading-cards": POKEMON_COLLECTIONS.map((c) => c.slug),
  watches: ["luxury-watches"],
  jewelry: ["gold-tone-bangles"],
  "outdoor-fitness": ["vibration-training"],
};

export function MegaMenu() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  return (
    <nav
      aria-label="Product categories"
      className="relative hidden lg:block"
      onMouseLeave={() => setOpenSlug(null)}
    >
      <ul className="flex items-center gap-1">
        {CATEGORIES.map((cat) => (
          <li key={cat.slug}>
            <Link
              to="/category/$category"
              params={{ category: cat.slug }}
              onMouseEnter={() => setOpenSlug(cat.slug)}
              onFocus={() => setOpenSlug(cat.slug)}
              className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13.5px] font-semibold text-navy-foreground/85 transition hover:bg-white/10 hover:text-navy-foreground"
              activeProps={{ className: "bg-white/10 text-navy-foreground" }}
            >
              {cat.name}
            </Link>
          </li>
        ))}
        <li>
          <Link
            to="/shop"
            onMouseEnter={() => setOpenSlug(null)}
            className="rounded-full px-3.5 py-2 text-[13.5px] font-semibold text-navy-foreground/85 transition hover:bg-white/10 hover:text-navy-foreground"
          >
            Shop All
          </Link>
        </li>
        <li>
          <Link
            to="/blog"
            onMouseEnter={() => setOpenSlug(null)}
            className="rounded-full px-3.5 py-2 text-[13.5px] font-semibold text-navy-foreground/85 transition hover:bg-white/10 hover:text-navy-foreground"
          >
            Guides
          </Link>
        </li>
      </ul>

      {openSlug && <Panel slug={openSlug} onNavigate={() => setOpenSlug(null)} />}
    </nav>
  );
}

function Panel({ slug, onNavigate }: { slug: string; onNavigate: () => void }) {
  const cat = CATEGORIES.find((c) => c.slug === slug);
  if (!cat) return null;
  const collections = (FEATURED_BY_CATEGORY[slug] ?? [])
    .map((s) => COLLECTIONS.find((c) => c.slug === s))
    .filter(Boolean);

  return (
    <div className="absolute left-0 top-full z-50 w-[860px] animate-rise pt-3">
      <div className="grid grid-cols-[1.1fr_1fr_1fr] gap-0 overflow-hidden rounded-2xl border border-border bg-popover shadow-lift">
        <div className="border-r border-border p-5">
          <p className="eyebrow mb-3 text-muted-foreground">Browse {cat.name}</p>
          <ul className="space-y-0.5">
            {cat.subcategories.map((sub) => (
              <li key={sub.slug}>
                <Link
                  to="/category/$category/$sub"
                  params={{ category: cat.slug, sub: sub.slug }}
                  onClick={onNavigate}
                  className="group flex items-start justify-between gap-2 rounded-xl px-3 py-2 transition hover:bg-surface"
                >
                  <span className="min-w-0">
                    <span className="block text-[13.5px] font-bold text-primary">{sub.name}</span>
                    {sub.blurb && (
                      <span className="mt-0.5 block text-[11.5px] leading-snug text-muted-foreground">
                        {sub.blurb}
                      </span>
                    )}
                  </span>
                  <ChevronRight
                    size={15}
                    className="mt-0.5 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-accent"
                  />
                </Link>
              </li>
            ))}
          </ul>
          <Link
            to="/category/$category"
            params={{ category: cat.slug }}
            onClick={onNavigate}
            className="mt-3 inline-flex items-center gap-1 px-3 text-[12.5px] font-bold text-accent hover:underline"
          >
            View all {cat.name} <ChevronRight size={13} />
          </Link>
        </div>

        <div className="border-r border-border p-5">
          <p className="eyebrow mb-3 flex items-center gap-1.5 text-muted-foreground">
            <Sparkles size={12} className="text-accent" /> Collections
          </p>
          <ul className="space-y-0.5">
            {collections.map((col) => (
              <li key={col!.slug}>
                <Link
                  to="/collections/$slug"
                  params={{ slug: col!.slug }}
                  onClick={onNavigate}
                  className="block rounded-xl px-3 py-2 text-[13.5px] font-semibold text-foreground transition hover:bg-surface hover:text-accent"
                >
                  {col!.short}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <Link
          to="/category/$category"
          params={{ category: cat.slug }}
          onClick={onNavigate}
          className="group relative flex flex-col justify-end overflow-hidden bg-navy p-5"
        >
          {cat.image && (
            <img
              src={cat.image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-45 transition duration-700 group-hover:scale-105 group-hover:opacity-60"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/50 to-transparent" />
          <div className="relative">
            <p className="eyebrow text-accent">Featured</p>
            <p className="mt-1 font-display text-lg font-bold leading-tight text-navy-foreground">
              {cat.name}
            </p>
            <p className="mt-1 text-[12px] leading-snug text-navy-foreground/75">{cat.tagline}</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
