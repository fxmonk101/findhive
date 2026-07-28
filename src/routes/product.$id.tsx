import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useQuery, queryOptions } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { ChevronRight, Heart, ShoppingBag, Zap, Minus, Plus, Star } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { getProduct, getRelated } from "@/lib/products";
import { getCategory, getSubcategory } from "@/lib/categories";
import { RatingStars } from "@/components/product/RatingStars";
import { PriceTag } from "@/components/product/PriceTag";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ImageGallery } from "@/components/product/ImageGallery";
import { ViewerBadge } from "@/components/product/ViewerBadge";
import { TrustBadges } from "@/components/product/TrustBadges";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWishlist } from "@/lib/stores/wishlist";
import { useCart } from "@/lib/stores/cart";
import { useReviews } from "@/lib/stores/reviews";
import { useRecentlyViewed } from "@/lib/stores/recently-viewed";
import { useHydrated } from "@/lib/use-hydrated";
import { formatPrice } from "@/lib/format";

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

            <a href="#reviews" className="mt-3 inline-flex w-fit items-center gap-2 hover:opacity-90">
              <RatingStars rating={product.rating} reviewCount={product.review_count} />
            </a>

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
              {hydrated && <ViewerBadge count={product.viewer_count} size="md" />}
              {product.sold_count >= 20 && (
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
                <ShoppingBag size={18} className="mr-2" /> Add to Cart
              </Button>
              <Button
                size="lg"
                variant="outline"
                disabled={!inStock}
                className="min-w-[140px] flex-1 rounded-xl border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground sm:flex-none"
                onClick={buyNow}
              >
                <Zap size={18} className="mr-2" /> Buy Now
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
                Description
              </TabsTrigger>
              <TabsTrigger value="info" className="rounded-lg px-4 py-2 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Additional Information
              </TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-lg px-4 py-2 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Reviews ({product.review_count})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="rounded-2xl border border-border bg-card p-6 md:p-8">
              <div className="prose prose-sm max-w-none whitespace-pre-line leading-relaxed text-muted-foreground">
                {product.long_description || product.description || product.short_description || "No description available."}
              </div>
            </TabsContent>

            <TabsContent value="info" className="rounded-2xl border border-border bg-card p-6 md:p-8">
              <AttributesTable attributes={product.attributes} product={product} />
            </TabsContent>

            <TabsContent value="reviews" className="rounded-2xl border border-border bg-card p-6 md:p-8" id="reviews">
              <ProductReviews productId={product.id} productTitle={product.title} />
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

const reviewSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(60),
  title: z.string().trim().min(3, "Title is too short").max(80),
  body: z.string().trim().min(10, "Review should be at least 10 characters").max(1000),
  rating: z.number().int().min(1, "Please pick a rating").max(5),
});

function ProductReviews({ productId, productTitle }: { productId: string; productTitle: string }) {
  const hydrated = useHydrated();
  const allReviews = useReviews((s) => s.reviews);
  const add = useReviews((s) => s.add);
  const list = hydrated ? allReviews.filter((r) => r.productId === productId) : [];

  const total = list.length;
  const avg = total ? list.reduce((n, r) => n + r.rating, 0) / total : 0;
  const dist = [5, 4, 3, 2, 1].map((s) => ({ star: s, count: list.filter((r) => r.rating === s).length }));

  const [form, setForm] = useState({ name: "", title: "", body: "", rating: 0 });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = reviewSchema.safeParse(form);
    if (!parsed.success) {
      const errs: typeof errors = {};
      for (const iss of parsed.error.issues) {
        const k = iss.path[0] as keyof typeof form;
        if (!errs[k]) errs[k] = iss.message;
      }
      setErrors(errs);
      return;
    }
    setErrors({});
    add({ ...parsed.data, productId });
    setForm({ name: "", title: "", body: "", rating: 0 });
    toast.success("Thanks — your review has been posted.");
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
      <div>
        <div className="mb-6 flex items-start gap-6 rounded-xl bg-muted/40 p-5">
          <div className="text-center">
            <div className="text-4xl font-black text-primary">{avg.toFixed(1)}</div>
            <div className="mt-1 flex justify-center">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star key={n} size={16} className={n <= Math.round(avg) ? "fill-accent text-accent" : "text-muted-foreground/40"} />
              ))}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">{total} review{total === 1 ? "" : "s"}</div>
          </div>
          <ul className="flex-1 space-y-1.5">
            {dist.map((d) => {
              const pct = total ? (d.count / total) * 100 : 0;
              return (
                <li key={d.star} className="flex items-center gap-3 text-xs">
                  <span className="w-6 text-muted-foreground">{d.star}★</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-6 text-right text-muted-foreground">{d.count}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {list.length === 0 ? (
          <p className="text-sm text-muted-foreground">No reviews yet for this product — be the first to share your experience.</p>
        ) : (
          <ul className="space-y-4">
            {list.map((r) => (
              <li key={r.id} className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-primary">{r.title}</h3>
                    <div className="mt-1 text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">{r.name}</span> · {new Date(r.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star key={n} size={14} className={n <= r.rating ? "fill-accent text-accent" : "text-muted-foreground/40"} />
                    ))}
                  </div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{r.body}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <aside>
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-lg font-bold text-primary">Write a review</h3>
          <p className="mt-1 text-xs text-muted-foreground">Reviewing: {productTitle}</p>
          <form onSubmit={onSubmit} noValidate className="mt-4 space-y-3">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-primary">Your rating</label>
              <div className="flex gap-1" role="radiogroup">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    role="radio"
                    aria-checked={form.rating === n}
                    aria-label={`${n} star${n === 1 ? "" : "s"}`}
                    onClick={() => setForm((f) => ({ ...f, rating: n }))}
                    className="p-0.5"
                  >
                    <Star size={22} className={n <= form.rating ? "fill-accent text-accent" : "text-muted-foreground/40 hover:text-accent"} />
                  </button>
                ))}
              </div>
              {errors.rating && <p className="mt-1 text-xs text-destructive">{errors.rating}</p>}
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-primary">Name</label>
              <input maxLength={60} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40" />
              {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-primary">Title</label>
              <input maxLength={80} value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40" />
              {errors.title && <p className="mt-1 text-xs text-destructive">{errors.title}</p>}
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-primary">Review</label>
              <textarea rows={4} maxLength={1000} value={form.body} onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40" />
              {errors.body && <p className="mt-1 text-xs text-destructive">{errors.body}</p>}
            </div>
            <Button type="submit" className="w-full rounded-xl bg-accent text-accent-foreground hover:brightness-95">Post review</Button>
          </form>
        </div>
      </aside>
    </div>
  );
}