import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useReviews, type Review } from "@/lib/stores/reviews";
import { useHydrated } from "@/lib/use-hydrated";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "Reviews — findhive" },
      { name: "description", content: "Read reviews from findhive shoppers and share your own experience finding the best deals." },
      { property: "og:title", content: "Reviews — findhive" },
      { property: "og:description", content: "Read reviews from findhive shoppers and share your own experience." },
    ],
  }),
  component: ReviewsPage,
});

const reviewSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(60, "Name too long"),
  title: z.string().trim().min(3, "Title is too short").max(80, "Title too long"),
  body: z.string().trim().min(10, "Review should be at least 10 characters").max(1000, "Review too long"),
  rating: z.number().int().min(1, "Please pick a rating").max(5),
});

function Stars({ value, size = 16 }: { value: number; size?: number }) {
  return (
    <div className="flex" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          className={n <= value ? "fill-accent text-accent" : "text-muted-foreground/40"}
          strokeWidth={2}
        />
      ))}
    </div>
  );
}

function ReviewsPage() {
  const hydrated = useHydrated();
  const reviews = useReviews((s) => s.reviews);
  const add = useReviews((s) => s.add);

  const list: Review[] = hydrated ? reviews : [];

  const { avg, dist, total } = useMemo(() => {
    const t = list.length;
    const a = t ? list.reduce((n, r) => n + r.rating, 0) / t : 0;
    const d = [5, 4, 3, 2, 1].map((s) => ({
      star: s,
      count: list.filter((r) => r.rating === s).length,
    }));
    return { avg: a, dist: d, total: t };
  }, [list]);
  const [sort, setSort] = useState<"newest" | "highest" | "lowest" | "helpful">("newest");
  const sortedList = useMemo(() => {
    const next = [...list];
    switch (sort) {
      case "highest": return next.sort((a, b) => b.rating - a.rating || b.createdAt - a.createdAt);
      case "lowest": return next.sort((a, b) => a.rating - b.rating || b.createdAt - a.createdAt);
      case "helpful": return next.sort((a, b) => (b.helpful ?? 0) - (a.helpful ?? 0));
      default: return next.sort((a, b) => b.createdAt - a.createdAt);
    }
  }, [list, sort]);

  const [form, setForm] = useState({ name: "", title: "", body: "", rating: 0 });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = reviewSchema.safeParse(form);
    if (!result.success) {
      const errs: Partial<Record<keyof typeof form, string>> = {};
      for (const issue of result.error.issues) {
        const k = issue.path[0] as keyof typeof form;
        if (!errs[k]) errs[k] = issue.message;
      }
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    setErrors({});
    add(result.data);
    setForm({ name: "", title: "", body: "", rating: 0 });
    setSubmitting(false);
    toast.success("Thanks — your review has been posted.");
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">Shopper reviews</span>
      <h1 className="mt-4 text-3xl font-black text-primary md:text-4xl">What the hive is saying</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Honest feedback from real findhive shoppers. Read what others found — then share your own experience.
      </p>

      {/* Summary */}
      <section className="mt-8 grid gap-6 rounded-2xl border border-border bg-card p-6 md:grid-cols-3">
        {total === 0 ? (
          <div className="md:col-span-3 text-center">
            <div className="text-2xl font-bold text-primary">Be the first to share your experience with findhive</div>
            <p className="mt-2 text-sm text-muted-foreground">Add a review and help shoppers make a confident choice.</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center justify-center border-b border-border pb-4 md:border-b-0 md:border-r md:pb-0 md:pr-6">
              <div className="text-5xl font-black text-primary">{avg.toFixed(1)}</div>
              <Stars value={Math.round(avg)} size={22} />
              <div className="mt-1 text-sm text-muted-foreground">Based on {total} review{total === 1 ? "" : "s"}</div>
            </div>
            <div className="md:col-span-2">
              <ul className="space-y-2">
                {dist.map((d) => {
                  const pct = total ? (d.count / total) * 100 : 0;
                  return (
                    <li key={d.star} className="flex items-center gap-3 text-sm">
                      <span className="w-8 shrink-0 text-muted-foreground">{d.star}★</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-8 shrink-0 text-right text-muted-foreground">{d.count}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </>
        )}
      </section>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        {/* Reviews list */}
        <section>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-bold text-primary">All reviews</h2>
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Sort:</label>
              <select value={sort} onChange={(e) => setSort(e.target.value as any)} className="rounded border border-border bg-background px-2 py-1.5 text-sm">
                <option value="newest">Most recent</option>
                <option value="highest">Highest rated</option>
                <option value="lowest">Lowest rated</option>
                <option value="helpful">Most helpful</option>
              </select>
            </div>
          </div>
          {list.length === 0 ? (
            <p className="text-sm text-muted-foreground">No reviews yet — be the first!</p>
          ) : (
            <ul className="space-y-4">
              {sortedList.map((r) => (
                <li key={r.id} className="rounded-xl border border-border bg-card p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-primary">{r.title}</h3>
                      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="font-semibold text-foreground">{r.name}</span>
                        {r.verified && <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">Verified</span>}
                        <span>·</span>
                        <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Stars value={r.rating} />
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{r.body}</p>
                  <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                    <button type="button" className="rounded-full border border-border px-2 py-1 hover:bg-muted">Helpful ({r.helpful ?? 0})</button>
                    <button type="button" className="rounded-full border border-border px-2 py-1 hover:bg-muted">Not helpful</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Form */}
        <aside>
          <div className="sticky top-24 rounded-xl border border-border bg-card p-5">
            <h2 className="text-xl font-bold text-primary">Write a review</h2>
            <p className="mt-1 text-sm text-muted-foreground">Share your experience with findhive.</p>
            <form onSubmit={onSubmit} noValidate className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-primary">Your rating</label>
                <div className="flex gap-1" role="radiogroup" aria-label="Rating">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      role="radio"
                      aria-checked={form.rating === n}
                      aria-label={`${n} star${n === 1 ? "" : "s"}`}
                      onClick={() => setForm((f) => ({ ...f, rating: n }))}
                      className="p-1"
                    >
                      <Star
                        size={26}
                        className={n <= form.rating ? "fill-accent text-accent" : "text-muted-foreground/40 hover:text-accent"}
                      />
                    </button>
                  ))}
                </div>
                {errors.rating && <p className="mt-1 text-xs text-destructive">{errors.rating}</p>}
              </div>
              <div>
                <label htmlFor="rv-name" className="mb-1 block text-xs font-bold uppercase tracking-wide text-primary">Name</label>
                <input
                  id="rv-name"
                  type="text"
                  maxLength={60}
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full rounded border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
                {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="rv-title" className="mb-1 block text-xs font-bold uppercase tracking-wide text-primary">Title</label>
                <input
                  id="rv-title"
                  type="text"
                  maxLength={80}
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full rounded border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
                {errors.title && <p className="mt-1 text-xs text-destructive">{errors.title}</p>}
              </div>
              <div>
                <label htmlFor="rv-body" className="mb-1 block text-xs font-bold uppercase tracking-wide text-primary">Review</label>
                <textarea
                  id="rv-body"
                  rows={5}
                  maxLength={1000}
                  value={form.body}
                  onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                  className="w-full rounded border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
                {errors.body && <p className="mt-1 text-xs text-destructive">{errors.body}</p>}
                <p className="mt-1 text-right text-xs text-muted-foreground">{form.body.length}/1000</p>
              </div>
              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-accent text-accent-foreground hover:brightness-95"
              >
                {submitting ? "Posting…" : "Post review"}
              </Button>
            </form>
          </div>
        </aside>
      </div>
    </div>
  );
}