import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery, queryOptions } from "@tanstack/react-query";
import { useState } from "react";
import { listByCategory } from "@/lib/products";
import { getCategory, CATEGORIES } from "@/lib/categories";
import { ProductGrid } from "@/components/product/ProductGrid";
import { FilterSidebar, applyFilters, sortProducts, type Filters } from "@/components/filters/FilterSidebar";
import { ChevronRight } from "lucide-react";

const opts = (slug: string) =>
  queryOptions({ queryKey: ["category", slug], queryFn: () => listByCategory(slug) });

export const Route = createFileRoute("/category/$category")({
  loader: ({ context, params }) => {
    const cat = getCategory(params.category);
    if (!cat) throw notFound();
    return context.queryClient.ensureQueryData(opts(params.category));
  },
  head: ({ params }) => {
    const cat = getCategory(params.category);
    const name = cat?.name ?? "Category";
    return {
      meta: [
        { title: `${name} — findhive` },
        { name: "description", content: `Shop and compare ${name.toLowerCase()} deals from trusted retailers on findhive.` },
        { property: "og:title", content: `${name} — findhive` },
        { property: "og:description", content: `Shop and compare ${name.toLowerCase()} deals on findhive.` },
      ],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useParams();
  const cat = getCategory(category)!;
  const { data = [], isLoading } = useQuery(opts(category));
  const [sort, setSort] = useState("rating");
  const [filters, setFilters] = useState<Filters>({ priceMax: 10000, minRating: 0, subcategories: [], retailers: [] });
  const filtered = sortProducts(applyFilters(data, filters), sort);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <nav className="mb-4 flex items-center gap-1 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-accent">Home</Link>
        <ChevronRight size={12} />
        <span className="text-primary">{cat.name}</span>
      </nav>
      <div className="mb-6 flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent/15 text-accent">
          <cat.icon size={22} />
        </span>
        <div>
          <h1 className="text-2xl font-bold text-primary md:text-3xl">{cat.name}</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} products</p>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {cat.subcategories.map((s) => (
          <Link
            key={s.slug}
            to="/category/$category/$sub"
            params={{ category: cat.slug, sub: s.slug }}
            className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-primary transition hover:border-accent hover:text-accent"
          >
            {s.name}
          </Link>
        ))}
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
          <ProductGrid products={filtered} loading={isLoading} />
        </div>
      </div>
    </div>
  );
}