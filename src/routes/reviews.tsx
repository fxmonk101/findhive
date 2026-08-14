import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, queryOptions } from "@tanstack/react-query";
import { Star, BadgeCheck } from "lucide-react";
import { listLatestReviews } from "@/lib/reviews";

const reviewsOpts = queryOptions({ queryKey: ["latest-reviews"], queryFn: () => listLatestReviews(36) });

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "Customer Reviews — findhive" },
      { name: "description", content: "Real customer reviews of findhive trading cards, watches, jewelry and fitness equipment, with ratings and verified purchases." },
      { property: "og:title", content: "Customer Reviews — findhive" },
      { property: "og:description", content: "See what customers say about findhive products before you buy." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(reviewsOpts);
  },
  component: ReviewsPage,
});

function Stars({ value, size = 16 }: { value: number; size?: number }) {
  return (
    <div className="flex" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={size} className={n <= Math.round(value) ? "fill-accent text-accent" : "text-muted-foreground/40"} />
      ))}
    </div>
  );
}

function ReviewsPage() {
  const q = useQuery(reviewsOpts);
  const list = q.data ?? [];
  const total = list.length;
  const avg = total ? list.reduce((n, r) => n + r.rating, 0) / total : 0;
  const dist = [5, 4, 3, 2, 1].map((s) => ({ star: s, count: list.filter((r) => r.rating === s).length }));

  return (
    <div className="bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">Reviews</span>
        <h1 className="mt-4 text-3xl font-black text-primary md:text-4xl">What customers say</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Every review below was left on a product we stocked, packed and shipped ourselves. To review something you
          bought, open its product page and use the Reviews tab.
        </p>

        <div className="mt-8 grid gap-6 rounded-2xl border border-border bg-card p-6 shadow-sm sm:grid-cols-[auto_minmax(0,1fr)]">
          <div className="text-center">
            <div className="text-5xl font-black text-primary">{avg.toFixed(1)}</div>
            <div className="mt-2 flex justify-center"><Stars value={avg} size={18} /></div>
            <div className="mt-1 text-xs text-muted-foreground">from {total} recent review{total === 1 ? "" : "s"}</div>
          </div>
          <ul className="min-w-0 space-y-2 self-center">
            {dist.map((d) => {
              const pct = total ? (d.count / total) * 100 : 0;
              return (
                <li key={d.star} className="flex items-center gap-3 text-xs">
                  <span className="w-8 shrink-0 text-muted-foreground">{d.star} star</span>
                  <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-8 shrink-0 text-right text-muted-foreground">{d.count}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {q.isLoading ? (
          <p className="mt-8 text-sm text-muted-foreground">Loading reviews…</p>
        ) : total === 0 ? (
          <p className="mt-8 text-sm text-muted-foreground">
            No reviews yet. <Link to="/shop" className="font-semibold text-accent">Browse the shop</Link> and be the first.
          </p>
        ) : (
          <ul className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {list.map((r) => (
              <li key={r.id} className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                  <h2 className="min-w-0 text-sm font-bold text-primary">{r.title}</h2>
                  <Stars value={r.rating} size={14} />
                </div>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{r.body}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">{r.author_name}</span>
                  {r.verified_purchase && (
                    <span className="inline-flex items-center gap-1 text-emerald-700"><BadgeCheck size={13} /> Verified</span>
                  )}
                  <span>{new Date(r.created_at).toLocaleDateString()}</span>
                </div>
                {r.products && (
                  <Link
                    to="/product/$id"
                    params={{ id: r.products.id }}
                    className="mt-3 flex items-center gap-3 rounded-xl bg-muted/50 p-2 hover:bg-muted"
                  >
                    <img src={r.products.image_url} alt={r.products.title} className="h-10 w-10 shrink-0 rounded-lg object-contain" />
                    <span className="min-w-0 truncate text-xs font-semibold text-primary">{r.products.title}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}