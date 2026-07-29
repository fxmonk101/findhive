import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";

export function CategoryWidget({
  activeCategory,
  activeSub,
}: {
  activeCategory?: string;
  activeSub?: string;
}) {
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(CATEGORIES.map((c) => [c.slug, c.slug === activeCategory])),
  );

  return (
    <aside className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-primary">
        Shop by Category
      </h3>
      <ul className="space-y-1">
        {CATEGORIES.map((c) => {
          const isActive = c.slug === activeCategory;
          const isOpen = open[c.slug];
          const Icon = c.icon;
          return (
            <li key={c.slug}>
              <div className="flex items-center">
                <Link
                  to="/category/$category"
                  params={{ category: c.slug }}
                  className={`flex flex-1 items-center gap-2 rounded-md px-2 py-1.5 text-sm font-semibold transition ${
                    isActive && !activeSub
                      ? "bg-accent/15 text-accent"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon size={14} className="opacity-70" />
                  <span className="flex-1">{c.name}</span>
                </Link>
                <button
                  type="button"
                  aria-label={isOpen ? "Collapse" : "Expand"}
                  onClick={() =>
                    setOpen((s) => ({ ...s, [c.slug]: !s[c.slug] }))
                  }
                  className="grid h-7 w-7 place-items-center rounded text-muted-foreground hover:bg-muted"
                >
                  {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>
              </div>
              {isOpen && (
                <ul className="ml-6 mt-1 space-y-0.5 border-l border-border pl-3">
                  {c.subcategories.map((s) => {
                    const active = c.slug === activeCategory && s.slug === activeSub;
                    return (
                      <li key={s.slug}>
                        <Link
                          to="/category/$category/$sub"
                          params={{ category: c.slug, sub: s.slug }}
                          className={`block rounded px-2 py-1 text-xs transition ${
                            active
                              ? "bg-accent/15 font-semibold text-accent"
                              : "text-muted-foreground hover:bg-muted hover:text-primary"
                          }`}
                        >
                          {s.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}