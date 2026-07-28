import type { Product } from "@/lib/products";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

export type Filters = {
  priceMax: number;
  minRating: number;
  subcategories: string[];
};

export function FilterSidebar({
  allProducts,
  filters,
  onChange,
}: {
  allProducts: Product[];
  filters: Filters;
  onChange: (f: Filters) => void;
}) {
  const maxPrice = Math.max(1000, ...allProducts.map((p) => p.price));
  const subs = Array.from(new Set(allProducts.map((p) => p.subcategory)));

  return (
    <aside className="space-y-6 rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-primary">Price</h3>
        <Slider
          min={0}
          max={Math.ceil(maxPrice)}
          step={10}
          value={[filters.priceMax]}
          onValueChange={(v) => onChange({ ...filters, priceMax: v[0] })}
        />
        <div className="mt-2 text-xs text-muted-foreground">Up to <span className="font-semibold text-primary">${filters.priceMax}</span></div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-primary">Rating</h3>
        <div className="space-y-2">
          {[4, 3, 2, 0].map((r) => (
            <label key={r} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                checked={filters.minRating === r}
                onChange={() => onChange({ ...filters, minRating: r })}
                className="accent-[oklch(0.79_0.16_75)]"
              />
              {r === 0 ? "All ratings" : `${r}★ & up`}
            </label>
          ))}
        </div>
      </div>

      {subs.length > 1 && (
        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-primary">Subcategory</h3>
          <ul className="space-y-2">
            {subs.map((s) => {
              const checked = filters.subcategories.includes(s);
              return (
                <li key={s} className="flex items-center gap-2">
                  <Checkbox
                    id={`sub-${s}`}
                    checked={checked}
                    onCheckedChange={(v) =>
                      onChange({
                        ...filters,
                        subcategories: v
                          ? [...filters.subcategories, s]
                          : filters.subcategories.filter((x) => x !== s),
                      })
                    }
                  />
                  <label htmlFor={`sub-${s}`} className="text-sm text-foreground">{s.replace(/-/g, " ")}</label>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <button
        onClick={() => onChange({ priceMax: Math.ceil(maxPrice), minRating: 0, subcategories: [] })}
        className="w-full rounded border border-border py-2 text-sm font-semibold text-primary hover:bg-muted"
      >
        Reset filters
      </button>
    </aside>
  );
}

export function applyFilters(products: Product[], f: Filters): Product[] {
  return products.filter((p) => {
    if (p.price > f.priceMax) return false;
    if (f.minRating && p.rating < f.minRating) return false;
    if (f.subcategories.length && !f.subcategories.includes(p.subcategory)) return false;
    return true;
  });
}

export function sortProducts(products: Product[], sort: string): Product[] {
  const copy = [...products];
  switch (sort) {
    case "price-asc": return copy.sort((a, b) => a.price - b.price);
    case "price-desc": return copy.sort((a, b) => b.price - a.price);
    case "rating": return copy.sort((a, b) => b.rating - a.rating);
    case "newest": return copy.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
    default: return copy;
  }
}