import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery, queryOptions } from "@tanstack/react-query";
import { useEffect } from "react";
import { ChevronRight, Heart, GitCompareArrows, ExternalLink, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { getProduct, getRelated } from "@/lib/products";
import { getCategory, getSubcategory } from "@/lib/categories";
import { RatingStars } from "@/components/product/RatingStars";
import { PriceTag } from "@/components/product/PriceTag";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/lib/stores/wishlist";
import { useCompare } from "@/lib/stores/compare";
import { useCart } from "@/lib/stores/cart";
import { useRecentlyViewed } from "@/lib/stores/recently-viewed";
import { useHydrated } from "@/lib/use-hydrated";

const productOpts = (id: string) =>
  queryOptions({ queryKey: ["product", id], queryFn: () => getProduct(id) });

export const Route = createFileRoute("/product/$id")({
  loader: async ({ context, params }) => {
    const p = await context.queryClient.ensureQueryData(productOpts(params.id));
    if (!p) throw notFound();
    context.queryClient.ensureQueryData({
      queryKey: ["related", p.category, params.id],
      queryFn: () => getRelated(p.category, params.id),
    });
  },
  head: ({ loaderData, params }) => {
    // Loader data isn't returned but head reads directly from query cache on hydration; provide safe default
    return {
      meta: [
        { title: `Product — findhive` },
        { name: "description", content: "Compare this deal across retailers on findhive." },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { id } = Route.useParams();
  const { data: product } = useQuery(productOpts(id));
  const related = useQuery({
    queryKey: ["related", product?.category, id],
    queryFn: () => getRelated(product!.category, id),
    enabled: !!product,
  });

  const hydrated = useHydrated();
  const wishlisted = useWishlist((s) => (hydrated ? s.ids.includes(id) : false));
  const toggleWish = useWishlist((s) => s.toggle);
  const compared = useCompare((s) => (hydrated ? s.ids.includes(id) : false));
  const toggleCompare = useCompare((s) => s.toggle);
  const addToCart = useCart((s) => s.add);
  const track = useRecentlyViewed((s) => s.visit);

  useEffect(() => {
    if (product) track(product.id);
  }, [product, track]);

  if (!product) return null;

  const cat = getCategory(product.category);
  const sub = getSubcategory(product.category, product.subcategory);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <nav className="mb-4 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-accent">Home</Link>
        <ChevronRight size={12} />
        {cat && <><Link to="/category/$category" params={{ category: cat.slug }} className="hover:text-accent">{cat.name}</Link><ChevronRight size={12} /></>}
        {cat && sub && <><Link to="/category/$category/$sub" params={{ category: cat.slug, sub: sub.slug }} className="hover:text-accent">{sub.name}</Link><ChevronRight size={12} /></>}
        <span className="truncate text-primary">{product.title}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="overflow-hidden rounded-2xl bg-muted">
          <img src={product.image_url} alt={product.title} className="aspect-square w-full object-cover" />
        </div>
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs">
            <span className="rounded bg-primary px-2 py-0.5 font-semibold uppercase tracking-wider text-primary-foreground">
              {product.source_retailer}
            </span>
            {sub && <span className="text-muted-foreground">{sub.name}</span>}
          </div>
          <h1 className="text-2xl font-bold text-primary md:text-3xl">{product.title}</h1>
          <div className="mt-3">
            <RatingStars rating={product.rating} reviewCount={product.review_count} />
          </div>
          <div className="mt-4">
            <PriceTag price={product.price} original={product.original_price} size="lg" />
          </div>
          {product.description && (
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{product.description}</p>
          )}

          <div className="mt-6 flex flex-wrap gap-2">
            <Button
              size="lg"
              className="flex-1 bg-accent text-accent-foreground hover:brightness-95 sm:flex-none"
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
              <ExternalLink size={16} className="mr-2" /> Add to Cart
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => toggleWish(product.id)}
              aria-pressed={wishlisted}
            >
              <Heart size={16} className={wishlisted ? "fill-accent text-accent" : ""} /> {wishlisted ? "Saved" : "Wishlist"}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                const r = toggleCompare(product.id);
                if (!r.ok && r.reason) toast.error(r.reason);
              }}
              aria-pressed={compared}
            >
              <GitCompareArrows size={16} /> {compared ? "Comparing" : "Compare"}
            </Button>
          </div>

          <a
            href={product.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex text-sm font-semibold text-accent hover:underline"
          >
            View on {product.source_retailer} ↗
          </a>

          <ul className="mt-6 grid grid-cols-1 gap-3 border-t border-border pt-6 text-sm sm:grid-cols-3">
            <li className="flex items-center gap-2 text-muted-foreground"><Truck size={16} className="text-accent" /> Free shipping over $150</li>
            <li className="flex items-center gap-2 text-muted-foreground"><ShieldCheck size={16} className="text-accent" /> Verified retailer</li>
            <li className="flex items-center gap-2 text-muted-foreground"><RotateCcw size={16} className="text-accent" /> Easy returns</li>
          </ul>
        </div>
      </div>

      {related.data && related.data.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-5 text-xl font-bold text-primary md:text-2xl">Related products</h2>
          <ProductGrid products={related.data} />
        </div>
      )}
    </div>
  );
}