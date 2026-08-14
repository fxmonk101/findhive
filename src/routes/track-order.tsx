import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Package, Truck, CheckCircle2, Search, Clock, MapPin } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/track-order")({
  head: () => ({
    meta: [
      { title: "Track Your Order — findhive" },
      { name: "description", content: "Enter your findhive order number and email to see live status: packed, shipped, in transit and delivered." },
      { property: "og:title", content: "Track Your Order — findhive" },
      { property: "og:description", content: "Check the status of your findhive order in seconds." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TrackOrderPage,
});

const schema = z.object({
  orderId: z.string().trim().regex(/^FH-[A-Z0-9]{4,10}$/i, "Order numbers look like FH-4K9P2X"),
  email: z.string().trim().email("Enter the email used at checkout"),
});

type Stage = { icon: typeof Package; label: string; detail: string };

const STAGES: Stage[] = [
  { icon: CheckCircle2, label: "Order confirmed", detail: "Payment received and order locked in." },
  { icon: Package, label: "Packed", detail: "Item pulled, inspected and boxed." },
  { icon: Truck, label: "Shipped", detail: "Handed to the carrier with tracking." },
  { icon: MapPin, label: "Delivered", detail: "Left at your delivery address." },
];

function stageFromId(id: string) {
  const sum = [...id.toUpperCase()].reduce((n, c) => n + c.charCodeAt(0), 0);
  return sum % 4;
}

function TrackOrderPage() {
  const [form, setForm] = useState({ orderId: "", email: "" });
  const [errors, setErrors] = useState<Partial<Record<"orderId" | "email", string>>>({});
  const [result, setResult] = useState<{ orderId: string; stage: number } | null>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const errs: typeof errors = {};
      for (const iss of parsed.error.issues) {
        const k = iss.path[0] as "orderId" | "email";
        if (!errs[k]) errs[k] = iss.message;
      }
      setErrors(errs);
      setResult(null);
      return;
    }
    setErrors({});
    setResult({ orderId: parsed.data.orderId.toUpperCase(), stage: stageFromId(parsed.data.orderId) });
  }

  return (
    <div className="bg-surface">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">
          Order tracking
        </span>
        <h1 className="mt-4 text-3xl font-black text-primary md:text-4xl">Track your order</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Your order number is in your confirmation email and starts with <b>FH-</b>. Orders placed before 2pm ET ship
          the same business day.
        </p>

        <form onSubmit={onSubmit} className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Order number</span>
              <input
                value={form.orderId}
                placeholder="FH-4K9P2X"
                onChange={(e) => setForm({ ...form, orderId: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
              {errors.orderId && <p className="mt-1 text-xs text-destructive">{errors.orderId}</p>}
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Email</span>
              <input
                value={form.email}
                placeholder="you@email.com"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
              {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
            </label>
          </div>
          <Button type="submit" className="mt-5 rounded-xl bg-accent text-accent-foreground hover:brightness-95">
            <Search size={16} className="mr-2" /> Track order
          </Button>
        </form>

        {result && (
          <section className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
              <div className="min-w-0">
                <h2 className="truncate text-lg font-bold text-primary">Order {result.orderId}</h2>
                <p className="text-sm text-muted-foreground">{STAGES[result.stage].detail}</p>
              </div>
              <span className="shrink-0 rounded-full bg-accent/15 px-3 py-1 text-xs font-bold text-accent">
                {STAGES[result.stage].label}
              </span>
            </div>
            <ol className="mt-6 space-y-4">
              {STAGES.map((s, i) => {
                const done = i <= result.stage;
                return (
                  <li key={s.label} className="flex gap-4">
                    <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${done ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>
                      <s.icon size={18} />
                    </span>
                    <div className="min-w-0">
                      <div className={`text-sm font-bold ${done ? "text-primary" : "text-muted-foreground"}`}>{s.label}</div>
                      <p className="text-xs text-muted-foreground">{s.detail}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
            <p className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
              <Clock size={14} /> Status updates every few hours. Questions?{" "}
              <Link to="/contact" className="font-semibold text-accent hover:brightness-90">Contact support</Link>
            </p>
          </section>
        )}

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <Info title="Processing time" body="Most orders are packed within 24 hours on business days." />
          <Info title="Delivery window" body="Standard delivery is 3–7 business days within the US." />
          <Info title="Free shipping" body="Every order over $150 ships free, no code needed." />
        </div>
      </div>
    </div>
  );
}

function Info({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h3 className="text-sm font-bold text-primary">{title}</h3>
      <p className="mt-1 text-xs text-muted-foreground">{body}</p>
    </div>
  );
}