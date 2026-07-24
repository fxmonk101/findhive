import { createFileRoute } from "@tanstack/react-router";
import { useQuery, queryOptions } from "@tanstack/react-query";
import { useState } from "react";
import { listProducts } from "@/lib/products";
import { ProductGrid } from "@/components/product/ProductGrid";
import { FilterSidebar, applyFilters, sortProducts, type Filters } from "@/components/filters/FilterSidebar";

const opts = queryOptions({ queryKey: ["all-products"], queryFn: listProducts });

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop All Deals — findhive" },
      { name: "description", content: "Browse every deal on findhive across all categories. Compare and shop the best prices." },
      { property: "og:title", content: "Shop All — findhive" },
      { property: "og:description", content: "Browse every deal on findhive across all categories." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(opts),
  component: Shop,
});

function Shop() {
  const { data = [], isLoading } = useQuery(opts);
  const [sort, setSort] = useState("rating");
  const [filters, setFilters] = useState<Filters>({ priceMax: 10000, minRating: 0, subcategories: [], retailers: [] });
  const filtered = sortProducts(applyFilters(data, filters), sort);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary md:text-3xl">Shop All Deals</h1>
        <p className="mt-1 text-sm text-muted-foreground">{filtered.length} products</p>
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
          <ProductGrid products={filtered} loading={isLoading} empty="No products match your filters." />
        </div>
      </div>
    </div>
  );
}