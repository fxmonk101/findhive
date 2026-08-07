import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useQuery, queryOptions } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { ChevronRight, Heart, ShoppingBag, Zap, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { getProduct, getRelated } from "@/lib/products";
import { getCategory, getSubcategory } from "@/lib/categories";
import { RatingStars } from "@/components/product/RatingStars";
import { PriceTag } from "@/components/product/PriceTag";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ImageGallery } from "@/components/product/ImageGallery";
import { ViewerBadge } from "@/components/product/ViewerBadge";
import { TrustBadges } from "@/components/product/TrustBadges";
import { ProductDescription } from "@/components/product/ProductDescription";
import { NotifyMeForm } from "@/components/product/NotifyMeForm";
import { ProductReviews } from "@/components/product/ProductReviews";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWishlist } from "@/lib/stores/wishlist";
import { useCart } from "@/lib/stores/cart";
import { useRecentlyViewed } from "@/lib/stores/recently-viewed";
import { useHydrated } from "@/lib/use-hydrated";
import { formatPrice } from "@/lib/format";
import { useT } from "@/lib/i18n";

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
    return p;
  },
  head: ({ loaderData }) => {
    const title = loaderData?.meta_title || (loaderData ? `${loaderData.title} | findhive` : "Product | findhive");
    const desc =
      loaderData?.meta_description ||
      loaderData?.short_description ||
      "Authentic products, shipped directly by findhive from our warehouse.";
    const image = loaderData?.image_url;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "product" },
        ...(image
          ? [
              { property: "og:image", content: image },
              { name: "twitter:image", content: image },
            ]
          : []),
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const t = useT();
  const { id } = Route.useParams();
  const { data: product } = useQuery(productOpts(id));
  const related = useQuery({
    queryKey: ["related", product?.category, id],
    queryFn: () => getRelated(product!.category, id),
    enabled: !!product,
  });
  const navigate = useNavigate();

  const hydrated = useHydrated();
  const wishlisted = useWishlist((s) => (hydrated ? s.ids.includes(id) : false));
  const toggleWish = useWishlist((s) => s.toggle);
  const addToCart = useCart((s) => s.add);
  const track = useRecentlyViewed((s) => s.visit);

  const [qty, setQty] = useState(1);
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    if (product) track(product.id);
  }, [product, track]);

  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!product) return null;

  const cat = getCategory(product.category);
  const sub = getSubcategory(product.category, product.subcategory);
  const images = Array.isArray(product.images) && product.images.length > 0 ? product.images : [product.image_url];
  const inStock = product.stock_count > 0;
  const lowStock = inStock && product.stock_count <= 10;

  function doAdd(quantity = qty) {
    addToCart(
      {
        id: product!.id,
        title: product!.title,
        price: product!.price,
        image_url: product!.image_url,
      },
      quantity,
    );
    toast.success(`${quantity > 1 ? `${quantity} × ` : ""}Added to cart`);
  }

  function buyNow() {
    doAdd(qty);
    navigate({ to: "/checkout" });
  }

  return (
    <div className="bg-surface pb-24 lg:pb-16">
      <div className="mx-auto max-w-7xl px-4 py-6 md:py-10">
        <nav className="mb-6 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-accent">Home</Link>
          <ChevronRight size={12} />
          {cat && <><Link to="/category/$category" params={{ category: cat.slug }} className="hover:text-accent">{cat.name}</Link><ChevronRight size={12} /></>}
          {cat && sub && <><Link to="/category/$category/$sub" params={{ category: cat.slug, sub: sub.slug }} className="hover:text-accent">{sub.name}</Link><ChevronRight size={12} /></>}
          <span className="truncate text-primary">{product.title}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
          <ImageGallery images={images} alt={product.title} />

          <div className="flex flex-col">
            {sub && <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-accent">{sub.name}</div>}
            <h1 className="text-3xl font-black leading-tight text-primary md:text-4xl">{product.title}</h1>

            {product.review_count > 0 ? (
              <a href="#reviews" className="mt-3 inline-flex w-fit items-center gap-2 hover:opacity-90">
                <RatingStars rating={product.rating} reviewCount={product.review_count} />
              </a>
            ) : (
              <a href="#reviews" className="mt-3 w-fit text-sm text-muted-foreground hover:text-accent">
                No reviews yet — be the first to review this product
              </a>
            )}

            <div className="mt-5 flex flex-wrap items-baseline gap-4">
              <PriceTag price={product.price} original={product.original_price} size="lg" />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
              {inStock ? (
                <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  In stock{lowStock ? ` — only ${product.stock_count} left` : ""}
                </span>
              ) : (
                <span className="font-semibold text-destructive">Out of stock</span>
              )}
              {hydrated && inStock && <ViewerBadge count={product.viewer_count} size="md" />}
              {product.sold_count > 5 && (
                <span className="text-xs text-muted-foreground">
                  <span className="font-semibold text-primary">{product.sold_count.toLocaleString()}</span> sold this month
                </span>
              )}
            </div>

            {product.short_description && (
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                {product.short_description}
              </p>
            )}

            {!inStock ? (
              <div className="mt-7 space-y-4">
                <Button size="lg" disabled variant="secondary" className="w-full rounded-xl sm:w-auto sm:min-w-[220px]">
                  Out of Stock
                </Button>
                <NotifyMeForm productTitle={product.title} />
              </div>
            ) : (
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center rounded-xl border border-border bg-card">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="grid h-11 w-11 place-items-center text-primary hover:bg-muted"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center text-sm font-bold">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(product.stock_count || 99, q + 1))}
                  aria-label="Increase quantity"
                  className="grid h-11 w-11 place-items-center text-primary hover:bg-muted"
                >
                  <Plus size={14} />
                </button>
              </div>
              <Button
                size="lg"
                disabled={!inStock}
                className="min-w-[180px] flex-1 rounded-xl bg-accent text-accent-foreground shadow-sm hover:brightness-95 sm:flex-none"
                onClick={() => doAdd()}
              >
                <ShoppingBag size={18} className="mr-2" /> {t("product.addToCart")}
              </Button>
              <Button
                size="lg"
                variant="outline"
                disabled={!inStock}
                className="min-w-[140px] flex-1 rounded-xl border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground sm:flex-none"
                onClick={buyNow}
              >
                <Zap size={18} className="mr-2" /> {t("product.buyNow")}
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={() => toggleWish(product.id)}
                aria-pressed={wishlisted}
                className="rounded-xl"
              >
                <Heart size={18} className={wishlisted ? "fill-accent text-accent" : ""} />
              </Button>
            </div>
            )}
            {!inStock && (
              <Button
                variant="ghost"
                onClick={() => toggleWish(product.id)}
                aria-pressed={wishlisted}
                className="mt-3 w-fit rounded-xl px-2"
              >
                <Heart size={18} className={wishlisted ? "mr-2 fill-accent text-accent" : "mr-2"} /> Save for later
              </Button>
            )}

            <div className="mt-8">
              <TrustBadges compact />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <section className="mt-14">
          <Tabs defaultValue="description">
            <TabsList className="mb-4 h-auto flex-wrap bg-transparent p-0">
              <TabsTrigger value="description" className="rounded-lg px-4 py-2 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                {t("product.description")}
              </TabsTrigger>
              <TabsTrigger value="info" className="rounded-lg px-4 py-2 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Additional Information
              </TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-lg px-4 py-2 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                {t("product.reviewsTab")} ({product.review_count})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="rounded-2xl border border-border bg-card p-6 md:p-8">
              <ProductDescription
                content={product.long_description || product.description || product.short_description || ""}
              />
            </TabsContent>

            <TabsContent value="info" className="rounded-2xl border border-border bg-card p-6 md:p-8">
              <AttributesTable attributes={product.attributes} product={product} />
            </TabsContent>

            <TabsContent value="reviews" className="rounded-2xl border border-border bg-card p-6 md:p-8" id="reviews">
              <ProductReviews productId={product.id} />
            </TabsContent>
          </Tabs>
        </section>

        {related.data && related.data.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-6 text-2xl font-black text-primary md:text-3xl">You may also like</h2>
            <ProductGrid products={related.data.slice(0, 4)} />
          </div>
        )}
      </div>

      {/* Mobile sticky bar */}
      {showSticky && inStock && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.15)] backdrop-blur lg:hidden">
          <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
            <img src={product.image_url} alt="" className="h-11 w-11 shrink-0 rounded-lg object-cover" />
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-semibold text-foreground">{product.title}</div>
              <div className="text-sm font-bold text-primary">{formatPrice(product.price)}</div>
            </div>
            <Button
              className="rounded-xl bg-accent text-accent-foreground hover:brightness-95"
              onClick={() => doAdd()}
            >
              <ShoppingBag size={16} className="mr-1.5" /> Add
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function AttributesTable({
  attributes,
  product,
}: {
  attributes: Record<string, string>;
  product: { category: string; subcategory: string; source_retailer?: string };
}) {
  const rows = useMemo(() => {
    const entries = Object.entries(attributes || {});
    if (entries.length === 0) {
      return [
        ["Category", product.category.replace(/-/g, " ")],
        ["Subcategory", product.subcategory.replace(/-/g, " ")],
        ["Ships from", "findhive warehouse"],
        ["Authenticity", "Verified authentic"],
      ];
    }
    return entries;
  }, [attributes, product]);

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="w-full text-sm">
        <tbody>
          {rows.map(([k, v], i) => (
            <tr key={k} className={i % 2 === 0 ? "bg-muted/40" : ""}>
              <th className="w-1/3 px-4 py-3 text-left align-top text-xs font-bold uppercase tracking-wide text-muted-foreground">
                {k.replace(/_/g, " ")}
              </th>
              <td className="px-4 py-3 text-foreground">{String(v)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
