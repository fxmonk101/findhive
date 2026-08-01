import { Link } from "@tanstack/react-router";
import { Heart, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RatingStars } from "./RatingStars";
import { PriceTag } from "./PriceTag";
import { ViewerBadge } from "./ViewerBadge";
import { useWishlist } from "@/lib/stores/wishlist";
import { useCart } from "@/lib/stores/cart";
import { useHydrated } from "@/lib/use-hydrated";
import { percentOff } from "@/lib/format";
import type { Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const hydrated = useHydrated();
  const wishlisted = useWishlist((s) => (hydrated ? s.ids.includes(product.id) : false));
  const toggleWish = useWishlist((s) => s.toggle);
  const addToCart = useCart((s) => s.add);
  const off = percentOff(product.price, product.original_price);
  const outOfStock = product.stock_count === 0;
  const hasReviews = product.review_count > 0;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-border hover:shadow-xl">
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        <Link
          to="/product/$id"
          params={{ id: product.id }}
          className="block h-full w-full"
        >
          <img
            src={product.image_url}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
          />
        </Link>
        {off && (
          <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-1 text-[11px] font-bold text-accent-foreground shadow-sm">
            -{off}% OFF
          </span>
        )}
        {outOfStock && (
          <span className="absolute inset-x-0 bottom-0 bg-primary/85 py-1.5 text-center text-[11px] font-bold uppercase tracking-wide text-primary-foreground">
            Out of Stock
          </span>
        )}
        <div className="absolute right-3 top-3 flex flex-col gap-1.5">
          <button
            type="button"
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={wishlisted}
            onClick={(e) => {
              e.preventDefault();
              toggleWish(product.id);
            }}
            className="grid h-9 w-9 place-items-center rounded-full bg-white/95 shadow-md backdrop-blur transition hover:scale-105 hover:bg-white"
          >
            <Heart
              size={17}
              className={wishlisted ? "fill-accent text-accent" : "text-primary"}
              strokeWidth={2}
            />
          </button>
        </div>
        {hydrated && !outOfStock && product.viewer_count >= 3 && (
          <div className="absolute bottom-3 left-3">
            <ViewerBadge count={product.viewer_count} />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link
          to="/product/$id"
          params={{ id: product.id }}
          className="line-clamp-2 min-h-[2.6rem] text-sm font-semibold leading-snug text-foreground hover:text-accent md:text-base"
        >
          {product.title}
        </Link>
        {hasReviews ? (
          <RatingStars rating={product.rating} reviewCount={product.review_count} />
        ) : (
          <span className="text-xs text-muted-foreground">No reviews yet</span>
        )}
        <PriceTag price={product.price} original={product.original_price} />
        {hydrated && !outOfStock && product.sold_count > 5 && (
          <div className="text-xs font-medium text-muted-foreground">
            <span className="text-primary">{product.sold_count.toLocaleString()}</span> sold this month
          </div>
        )}
        <div className="mt-auto pt-2">
          {outOfStock ? (
            <Button disabled className="w-full rounded-xl text-sm font-bold" variant="secondary">
              Out of Stock
            </Button>
          ) : (
            <Button
              className="w-full rounded-xl bg-accent text-sm font-bold text-accent-foreground shadow-sm transition hover:brightness-95"
              onClick={() => {
                addToCart({
                  id: product.id,
                  title: product.title,
                  price: product.price,
                  image_url: product.image_url,
                });
                toast.success("Added to cart");
              }}
            >
              <ShoppingBag size={16} className="mr-2" />
              Add to Cart
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}