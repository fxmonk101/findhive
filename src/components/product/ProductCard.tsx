import { Link } from "@tanstack/react-router";
import { Heart, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RatingStars } from "./RatingStars";
import { PriceTag } from "./PriceTag";
import { useWishlist } from "@/lib/stores/wishlist";
import { useCart } from "@/lib/stores/cart";
import { useHydrated } from "@/lib/use-hydrated";
import type { Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const hydrated = useHydrated();
  const wishlisted = useWishlist((s) => (hydrated ? s.ids.includes(product.id) : false));
  const toggleWish = useWishlist((s) => s.toggle);
  const addToCart = useCart((s) => s.add);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Link
          to="/product/$id"
          params={{ id: product.id }}
          className="block h-full w-full"
        >
          <img
            src={product.image_url}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        <div className="absolute right-2 top-2 flex flex-col gap-1.5">
          <button
            type="button"
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={wishlisted}
            onClick={(e) => {
              e.preventDefault();
              toggleWish(product.id);
            }}
            className="grid h-8 w-8 place-items-center rounded-full bg-white/90 shadow-sm backdrop-blur transition hover:bg-white"
          >
            <Heart
              size={16}
              className={wishlisted ? "fill-accent text-accent" : "text-primary"}
              strokeWidth={2}
            />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <Link
          to="/product/$id"
          params={{ id: product.id }}
          className="line-clamp-2 min-h-[2.5rem] text-sm font-medium text-foreground hover:text-accent"
        >
          {product.title}
        </Link>
        <RatingStars rating={product.rating} reviewCount={product.review_count} />
        <PriceTag price={product.price} original={product.original_price} />
        <div className="mt-auto pt-1">
          <Button
            size="sm"
            className="w-full bg-accent text-xs text-accent-foreground hover:bg-accent/90"
            onClick={() => {
              addToCart({
                id: product.id,
                title: product.title,
                price: product.price,
                image_url: product.image_url,
                source_retailer: product.source_retailer,
                source_url: product.source_url,
              });
              toast.success("Added to cart");
            }}
          >
            <ExternalLink size={12} className="mr-1" />
            View Deal
          </Button>
        </div>
      </div>
    </article>
  );
}