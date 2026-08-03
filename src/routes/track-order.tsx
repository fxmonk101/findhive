import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Truck, PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { breadcrumbLd, ldScript, abs } from "@/lib/seo";

export const Route = createFileRoute("/track-order")({
  head: () => ({
    meta: [
      { title: "Track Your Order | findhive" },
      { name: "description", content: "Enter your findhive order number and email to see the latest tracking status for your shipment." },
      { property: "og:title", content: "Track Your Order | findhive" },
      { property: "og:description", content: "Check the status of your findhive shipment." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: abs("/track-order") },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: abs("/track-order") }],
    scripts: [ldScript(breadcrumbLd([{ name: "Home", path: "/" }, { name: "Track Order", path: "/track-order" }]))],
  }),
  component: TrackOrder,
});

function TrackOrder() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="mx-auto max-w-2xl px-4 py-14">
      <span className="eyebrow text-accent">Order status</span>
      <h1 className="mt-2 text-3xl font-black md:text-4xl">Track your order</h1>
      <p className="mt-3 text-muted-foreground">
        Enter the order number from your confirmation email along with the email address used at checkout.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
        className="mt-8 space-y-4 rounded-2xl border border-border bg-card p-6 shadow-card"
      >
        <div className="space-y-1.5">
          <label htmlFor="order" className="text-sm font-semibold">Order number</label>
          <Input id="order" required placeholder="FH-000000" />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-semibold">Email address</label>
          <Input id="email" type="email" required placeholder="you@example.com" />
        </div>
        <Button type="submit" className="w-full rounded-xl bg-accent font-bold text-accent-foreground hover:brightness-95">
          <PackageSearch size={17} className="mr-2" /> Find my order
        </Button>
      </form>

      {submitted && (
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-border bg-surface p-5">
          <Truck size={20} className="mt-0.5 shrink-0 text-accent" />
          <p className="text-sm text-muted-foreground">
            We could not match that order yet. Tracking appears here within 24 hours of dispatch — if your order is
            older than that, email <span className="font-semibold text-foreground">support@findhive.shop</span> and we
            will locate it manually.
          </p>
        </div>
      )}
    </div>
  );
}
