import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery, queryOptions } from "@tanstack/react-query";
import { useState } from "react";
import { listBySubcategory } from "@/lib/products";
import { getCategory, getSubcategory } from "@/lib/categories";
import { ProductGrid } from "@/components/product/ProductGrid";
import { FilterSidebar, applyFilters, sortProducts, type Filters } from "@/components/filters/FilterSidebar";
import { CategoryWidget } from "@/components/filters/CategoryWidget";
import { ChevronRight } from "lucide-react";

const opts = (cat: string, sub: string) =>
  queryOptions({ queryKey: ["subcategory", cat, sub], queryFn: () => listBySubcategory(cat, sub) });

export const Route = createFileRoute("/category/$category/$sub")({
  loader: ({ context, params }) => {
    if (!getSubcategory(params.category, params.sub)) throw notFound();
    return context.queryClient.ensureQueryData(opts(params.category, params.sub));
  },
  head: ({ params }) => {
    const sub = getSubcategory(params.category, params.sub);
    const name = sub?.name ?? "Products";
    return {
      meta: [
        { title: `${name} — findhive` },
        { name: "description", content: `Shop ${name.toLowerCase()} at findhive — authentic products, shipped from our warehouse.` },
        { property: "og:title", content: `${name} — findhive` },
        { property: "og:description", content: `Authentic ${name.toLowerCase()}, shipped fast by findhive.` },
      ],
    };
  },
  component: SubPage,
});

function SubPage() {
  const { category, sub } = Route.useParams();
  const cat = getCategory(category)!;
  const subCat = getSubcategory(category, sub)!;
  const { data = [], isLoading } = useQuery(opts(category, sub));
  const [sort, setSort] = useState("rating");
  const [filters, setFilters] = useState<Filters>({ priceMax: 10000, minRating: 0, subcategories: [] });
  const filtered = sortProducts(applyFilters(data, filters), sort);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <nav className="mb-4 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-accent">Home</Link>
        <ChevronRight size={12} />
        <Link to="/category/$category" params={{ category }} className="hover:text-accent">{cat.name}</Link>
        <ChevronRight size={12} />
        <span className="text-primary">{subCat.name}</span>
      </nav>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary md:text-3xl">{subCat.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{filtered.length} products</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="space-y-5">
          <CategoryWidget activeCategory={category} activeSub={sub} />
          <FilterSidebar allProducts={data} filters={filters} onChange={setFilters} />
        </div>
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
          <ProductGrid products={filtered} loading={isLoading} />
        </div>
      </div>
    </div>
  );
}