import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/lib/products";
import type { Category } from "@/lib/categories";

/** Horizontal auto-advancing rail; becomes a static grid from sm upwards. */
function ProductRail({ products, cols = 4 }: { products: Product[]; cols?: 3 | 4 }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let paused = false;
    const pause = () => { paused = true; };
    const resume = () => { paused = false; };
    el.addEventListener("touchstart", pause, { passive: true });
    el.addEventListener("touchend", resume, { passive: true });
    const t = setInterval(() => {
      if (paused || el.scrollWidth <= el.clientWidth + 8) return;
      const step = el.clientWidth * 0.8;
      const next = el.scrollLeft + step;
      el.scrollTo({ left: next >= el.scrollWidth - el.clientWidth - 8 ? 0 : next, behavior: "smooth" });
    }, 3800);
    return () => {
      clearInterval(t);
      el.removeEventListener("touchstart", pause);
      el.removeEventListener("touchend", resume);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scrollbar-hide px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 ${cols === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}
    >
      {products.map((p) => (
        <div key={p.id} className="w-[62%] shrink-0 snap-start sm:w-auto">
          <ProductCard product={p} />
        </div>
      ))}
    </div>
  );
}

function ViewAll({ slug, tone = "accent" }: { slug: string; tone?: "accent" | "light" }) {
  return (
    <Link
      to="/category/$category"
      params={{ category: slug }}
      className={`inline-flex shrink-0 items-center gap-1 text-sm font-semibold hover:brightness-90 ${tone === "light" ? "text-accent" : "text-accent"}`}
    >
      View all <ChevronRight size={14} />
    </Link>
  );
}

export function CategoryShowcase({
  category,
  products,
  index = 0,
}: {
  category: Category;
  products: Product[];
  index?: number;
}) {
  if (!products.length) return null;
  const items = products.slice(0, 4);
  const variant = index % 4;

  /* 0 — cinematic full-width banner over a 4-up rail */
  if (variant === 0) {
    return (
      <section className="border-b border-border py-12">
        <div className="mx-auto max-w-7xl px-4">
          {category.image && (
            <Link
              to="/category/$category"
              params={{ category: category.slug }}
              className="group relative mb-6 block h-44 overflow-hidden rounded-2xl md:h-60"
            >
              <img src={category.image} alt={category.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/45 to-transparent" />
              <div className="absolute inset-0 flex items-center px-6 md:px-10">
                <div className="max-w-lg text-primary-foreground">
                  <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                    Shop {category.name}
                  </span>
                  <h2 className="mt-2 text-2xl font-black md:text-4xl">{category.name}</h2>
                  <p className="mt-1 text-sm text-primary-foreground/85 md:text-base">
                    Sealed, inspected and dispatched the same business day.
                  </p>
                </div>
              </div>
            </Link>
          )}
          <div className="mb-5 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-accent/15 text-accent">
                <category.icon size={20} />
              </span>
              <div className="min-w-0">
                <h3 className="truncate text-lg font-bold text-primary md:text-xl">Trending in {category.name}</h3>
                <p className="truncate text-sm text-muted-foreground">Restocked this week</p>
              </div>
            </div>
            <ViewAll slug={category.slug} />
          </div>
          <ProductRail products={items} />
        </div>
      </section>
    );
  }

  /* 1 — split editorial: sticky panel left, products right */
  if (variant === 1) {
    return (
      <section className="border-b border-border bg-surface py-12">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-[320px_minmax(0,1fr)]">
          <div className="lg:sticky lg:top-32 lg:self-start">
            {category.image && (
              <img src={category.image} alt={category.name} className="mb-4 h-40 w-full rounded-2xl object-cover" />
            )}
            <span className="inline-block rounded-full bg-accent/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">
              {category.name}
            </span>
            <h2 className="mt-3 text-2xl font-black text-primary md:text-3xl">
              Handpicked {category.name.toLowerCase()}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Every piece is checked in by hand before it reaches the shelf, so what you see in stock is what ships.
            </p>
            <div className="mt-4"><ViewAll slug={category.slug} /></div>
          </div>
          <ProductRail products={items} cols={3} />
        </div>
      </section>
    );
  }

  /* 2 — dark navy band */
  if (variant === 2) {
    return (
      <section className="hex-pattern border-b border-border py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
            <div className="min-w-0">
              <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground">
                In stock now
              </span>
              <h2 className="mt-3 text-2xl font-black text-primary-foreground md:text-3xl">{category.name}</h2>
              <p className="mt-1 text-sm text-primary-foreground/75">
                Free delivery on orders over $150 — packed and shipped by us.
              </p>
            </div>
            <ViewAll slug={category.slug} tone="light" />
          </div>
          <ProductRail products={items} />
        </div>
      </section>
    );
  }

  /* 3 — offset feature: first product large, rest stacked */
  return (
    <section className="border-b border-border py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 border-l-4 border-accent pl-4">
          <div className="min-w-0">
            <h2 className="truncate text-2xl font-black text-primary md:text-3xl">{category.name}</h2>
            <p className="truncate text-sm text-muted-foreground">Fresh arrivals and customer favourites</p>
          </div>
          <ViewAll slug={category.slug} />
        </div>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          {category.image && (
            <Link
              to="/category/$category"
              params={{ category: category.slug }}
              className="group relative hidden overflow-hidden rounded-2xl lg:block"
            >
              <img src={category.image} alt={category.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/85 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-primary-foreground">
                <h3 className="text-xl font-black">Shop the full {category.name.toLowerCase()} range</h3>
                <p className="mt-1 text-sm text-primary-foreground/80">Authentic products, guaranteed.</p>
              </div>
            </Link>
          )}
          <div className="grid gap-4 grid-cols-2">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}