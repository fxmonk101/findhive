import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, queryOptions } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { searchProducts } from "@/lib/products";
import { ProductGrid } from "@/components/product/ProductGrid";
import { FilterSidebar, applyFilters, sortProducts, type Filters } from "@/components/filters/FilterSidebar";
import { CATEGORIES } from "@/lib/categories";

const schema = z.object({
  q: fallback(z.string(), "").default(""),
  category: fallback(z.string().optional(), undefined).default(undefined as any),
});

const opts = (q: string, category?: string) =>
  queryOptions({ queryKey: ["search", q, category ?? ""], queryFn: () => searchProducts(q, category) });

export const Route = createFileRoute("/search")({
  validateSearch: zodValidator(schema),
  loaderDeps: ({ search }) => ({ q: search.q, category: search.category }),
  loader: ({ context, deps }) => context.queryClient.ensureQueryData(opts(deps.q, deps.category)),
  head: ({ loaderData }) => ({
    meta: [
      { title: "Search Results — findhive" },
      { name: "description", content: "Search the findhive catalog for top-rated products and fast shipping deals." },
    ],
  }),
  component: Search,
});

function Search() {
  const { q, category } = Route.useSearch();
  const { data = [], isLoading } = useQuery(opts(q, category));
  const [sort, setSort] = useState("rating");
  const [filters, setFilters] = useState<Filters>({ priceMax: 10000, minRating: 0, subcategories: [] });
  const filtered = sortProducts(applyFilters(data, filters), sort);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary md:text-3xl">
          {q ? <>Results for "<span className="text-accent">{q}</span>"</> : "Search"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {filtered.length} products {category && <>· in <Link to="/category/$category" params={{ category }} className="text-accent hover:underline">{CATEGORIES.find((c) => c.slug === category)?.name}</Link></>}
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <FilterSidebar allProducts={data} filters={filters} onChange={setFilters} />
        <div>
          <div className="mb-4 flex items-center justify-end">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Sort:</label>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="ml-2 rounded border border-border bg-background px-2 py-1.5 text-sm">
              <option value="rating">Top Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>
          <ProductGrid products={filtered} loading={isLoading} empty={q ? "No products matched your search." : "Type something to search."} />
        </div>
      </div>
    </div>
  );
}