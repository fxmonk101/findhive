import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { GitCompareArrows, X } from "lucide-react";
import { getManyByIds } from "@/lib/products";
import { useCompare } from "@/lib/stores/compare";
import { useHydrated } from "@/lib/use-hydrated";
import { RatingStars } from "@/components/product/RatingStars";
import { PriceTag } from "@/components/product/PriceTag";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: "Compare Products — findhive" },
      { name: "description", content: "Compare up to 4 products side by side on findhive." },
      { property: "og:title", content: "Compare — findhive" },
      { property: "og:description", content: "Compare up to 4 products side by side." },
    ],
  }),
  component: ComparePage,
});

function ComparePage() {
  const hydrated = useHydrated();
  const ids = useCompare((s) => s.ids);
  const remove = useCompare((s) => s.remove);
  const clear = useCompare((s) => s.clear);
  const q = useQuery({
    queryKey: ["compare", ids],
    queryFn: () => getManyByIds(ids),
    enabled: hydrated && ids.length > 0,
  });
  const products = q.data ?? [];
  const bestPrice = Math.min(...products.map((p) => p.price), Infinity);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent/15 text-accent">
            <GitCompareArrows size={22} />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-primary md:text-3xl">Compare</h1>
            <p className="text-sm text-muted-foreground">{hydrated ? ids.length : 0} / 4 selected</p>
          </div>
        </div>
        {products.length > 0 && (
          <Button variant="outline" onClick={clear}>Clear all</Button>
        )}
      </div>

      {hydrated && ids.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground">Add items to compare by tapping the compare icon on any product.</p>
          <Button asChild className="mt-4"><Link to="/shop">Browse products</Link></Button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="w-32 p-4 text-left font-semibold uppercase tracking-wide text-primary">Product</th>
                {products.map((p) => (
                  <th key={p.id} className="p-4 text-left align-top">
                    <div className="relative">
                      <button onClick={() => remove(p.id)} className="absolute right-0 top-0 grid h-6 w-6 place-items-center rounded-full bg-background text-muted-foreground hover:text-destructive"><X size={14} /></button>
                      <img src={p.image_url} alt={p.title} className="mb-2 aspect-square w-full rounded object-cover" />
                      <Link to="/product/$id" params={{ id: p.id }} className="line-clamp-2 text-sm font-semibold text-foreground hover:text-accent">{p.title}</Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="p-4 font-semibold text-primary">Price</td>
                {products.map((p) => (
                  <td key={p.id} className={`p-4 ${p.price === bestPrice ? "bg-accent/10" : ""}`}>
                    <PriceTag price={p.price} original={p.original_price} />
                    {p.price === bestPrice && <div className="mt-1 text-xs font-bold uppercase text-accent">Best price</div>}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-primary">Retailer</td>
                {products.map((p) => <td key={p.id} className="p-4">{p.source_retailer}</td>)}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-primary">Rating</td>
                {products.map((p) => <td key={p.id} className="p-4"><RatingStars rating={p.rating} reviewCount={p.review_count} /></td>)}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-primary">Category</td>
                {products.map((p) => <td key={p.id} className="p-4 capitalize">{p.category.replace(/-/g, " ")}</td>)}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-primary">Action</td>
                {products.map((p) => (
                  <td key={p.id} className="p-4">
                    <Button asChild size="sm" className="bg-accent text-accent-foreground hover:brightness-95">
                      <a href={p.source_url} target="_blank" rel="noopener noreferrer">View deal ↗</a>
                    </Button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}