import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/lib/products";
import type { Category } from "@/lib/categories";

export function CategoryShowcase({ category, products }: { category: Category; products: Product[] }) {
  if (!products.length) return null;
  return (
    <section className="border-b border-border py-10">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent/15 text-accent">
              <category.icon size={20} />
            </span>
            <div>
              <h2 className="text-xl font-bold text-primary md:text-2xl">{category.name}</h2>
              <p className="text-sm text-muted-foreground">Trending picks in {category.name.toLowerCase()}</p>
            </div>
          </div>
          <Link
            to="/category/$category"
            params={{ category: category.slug }}
            className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-accent hover:brightness-90 sm:flex"
          >
            View all <ChevronRight size={14} />
          </Link>
        </div>
        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scrollbar-hide px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
          {products.slice(0, 4).map((p) => (
            <div key={p.id} className="w-64 shrink-0 snap-start sm:w-auto">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}