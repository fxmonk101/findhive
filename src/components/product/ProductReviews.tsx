import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Star, BadgeCheck } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { listProductReviews, submitProductReview } from "@/lib/reviews";

const schema = z.object({
  author_name: z.string().trim().min(2, "Please enter your name").max(60),
  title: z.string().trim().min(3, "Title is too short").max(100),
  body: z.string().trim().min(10, "Review should be at least 10 characters").max(2000),
  rating: z.number().int().min(1, "Please pick a rating").max(5),
});

function Stars({ value, size = 16 }: { value: number; size?: number }) {
  return (
    <div className="flex" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          className={n <= Math.round(value) ? "fill-accent text-accent" : "text-muted-foreground/40"}
        />
      ))}
    </div>
  );
}

export function ProductReviews({ productId }: { productId: string }) {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["product-reviews", productId],
    queryFn: () => listProductReviews(productId),
  });
  const list = data ?? [];
  const total = list.length;
  const avg = total ? list.reduce((n, r) => n + r.rating, 0) / total : 0;
  const dist = [5, 4, 3, 2, 1].map((s) => ({ star: s, count: list.filter((r) => r.rating === s).length }));

  const [form, setForm] = useState({ author_name: "", title: "", body: "", rating: 0 });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof schema>) => submitProductReview({ ...values, product_id: productId }),
    onSuccess: () => {
      setForm({ author_name: "", title: "", body: "", rating: 0 });
      qc.invalidateQueries({ queryKey: ["product-reviews", productId] });
      toast.success("Thanks — your review has been posted.");
    },
    onError: () => toast.error("Sorry, we couldn't post your review. Please try again."),
  });

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const errs: Partial<Record<keyof typeof form, string>> = {};
      for (const iss of parsed.error.issues) {
        const k = iss.path[0] as keyof typeof form;
        if (!errs[k]) errs[k] = iss.message;
      }
      setErrors(errs);
      return;
    }
    setErrors({});
    mutation.mutate(parsed.data);
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
      <div>
        <div className="mb-6 grid grid-cols-[auto_minmax(0,1fr)] items-start gap-6 rounded-xl bg-muted/40 p-5">
          <div className="text-center">
            <div className="text-4xl font-black text-primary">{avg.toFixed(1)}</div>
            <div className="mt-1 flex justify-center"><Stars value={avg} /></div>
            <div className="mt-1 text-xs text-muted-foreground">{total} review{total === 1 ? "" : "s"}</div>
          </div>
          <ul className="min-w-0 space-y-1.5">
            {dist.map((d) => {
              const pct = total ? (d.count / total) * 100 : 0;
              return (
                <li key={d.star} className="flex items-center gap-3 text-xs">
                  <span className="w-6 shrink-0 text-muted-foreground">{d.star}★</span>
                  <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-6 shrink-0 text-right text-muted-foreground">{d.count}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading reviews…</p>
        ) : total === 0 ? (
          <p className="text-sm text-muted-foreground">
            No reviews yet for this product — be the first to share your experience.
          </p>
        ) : (
          <ul className="space-y-4">
            {list.map((r) => (
              <li key={r.id} className="rounded-xl border border-border bg-card p-5">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-bold text-primary">{r.title}</h3>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">{r.author_name}</span>
                      {r.verified_purchase && (
                        <span className="inline-flex items-center gap-1 text-emerald-700">
                          <BadgeCheck size={13} /> Verified purchase
                        </span>
                      )}
                      <span>{new Date(r.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Stars value={r.rating} size={14} />
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{r.body}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <form onSubmit={onSubmit} className="h-fit rounded-xl border border-border bg-muted/30 p-5">
        <h3 className="text-base font-bold text-primary">Write a review</h3>
        <p className="mt-1 text-xs text-muted-foreground">Share how the product performed for you.</p>

        <div className="mt-4">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Your rating</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                aria-label={`${n} star${n > 1 ? "s" : ""}`}
                onClick={() => setForm((f) => ({ ...f, rating: n }))}
              >
                <Star size={22} className={n <= form.rating ? "fill-accent text-accent" : "text-muted-foreground/40"} />
              </button>
            ))}
          </div>
          {errors.rating && <p className="mt-1 text-xs text-destructive">{errors.rating}</p>}
        </div>

        <Input label="Name" value={form.author_name} onChange={(v) => setForm((f) => ({ ...f, author_name: v }))} error={errors.author_name} />
        <Input label="Review title" value={form.title} onChange={(v) => setForm((f) => ({ ...f, title: v }))} error={errors.title} />
        <label className="mt-3 block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Your review</span>
          <textarea
            rows={5}
            value={form.body}
            onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
          {errors.body && <p className="mt-1 text-xs text-destructive">{errors.body}</p>}
        </label>

        <Button
          type="submit"
          disabled={mutation.isPending}
          className="mt-4 w-full rounded-xl bg-accent text-accent-foreground hover:brightness-95"
        >
          {mutation.isPending ? "Posting…" : "Submit review"}
        </Button>
      </form>
    </div>
  );
}

function Input({ label, value, onChange, error }: { label: string; value: string; onChange: (v: string) => void; error?: string }) {
  return (
    <label className="mt-3 block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </label>
  );
}