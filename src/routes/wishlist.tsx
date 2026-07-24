import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { getManyByIds } from "@/lib/products";
import { useWishlist } from "@/lib/stores/wishlist";
import { useHydrated } from "@/lib/use-hydrated";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "My Wishlist — findhive" },
      { name: "description", content: "Your saved deals on findhive." },
      { property: "og:title", content: "My Wishlist — findhive" },
      { property: "og:description", content: "Your saved deals on findhive." },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const hydrated = useHydrated();
  const ids = useWishlist((s) => s.ids);
  const q = useQuery({
    queryKey: ["wishlist", ids],
    queryFn: () => getManyByIds(ids),
    enabled: hydrated && ids.length > 0,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent/15 text-accent">
          <Heart size={22} />
        </span>
        <div>
          <h1 className="text-2xl font-bold text-primary md:text-3xl">My Wishlist</h1>
          <p className="text-sm text-muted-foreground">{hydrated ? ids.length : 0} saved items</p>
        </div>
      </div>
      {hydrated && ids.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground">Your wishlist is empty.</p>
          <Button asChild className="mt-4"><Link to="/shop">Start browsing</Link></Button>
        </div>
      ) : (
        <ProductGrid products={q.data ?? []} loading={q.isLoading} />
      )}
    </div>
  );
}