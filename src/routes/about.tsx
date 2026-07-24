import { createFileRoute } from "@tanstack/react-router";
import { Search, Scale, CheckCircle2, ShoppingBag, ShieldCheck, TrendingDown, Sparkles } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About findhive — Smart Shopping Comparison" },
      { name: "description", content: "findhive is a smart shopping comparison platform. We help you find, compare and shop the best deals across trusted retailers." },
      { property: "og:title", content: "About findhive — Smart Shopping Comparison" },
      { property: "og:description", content: "We help you find, compare and shop the best deals across trusted retailers." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">Our mission</span>
      <h1 className="mt-4 text-3xl font-black text-primary md:text-5xl">
        Find. Compare. <span className="text-accent">Shop Smart.</span>
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        findhive brings together deals from trusted retailers so you never overpay again. We source, curate and compare — you shop with confidence.
      </p>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Search, title: "Find", desc: "Search across a curated hive of retailers." },
          { icon: Scale, title: "Compare", desc: "Side-by-side prices, ratings and specs." },
          { icon: CheckCircle2, title: "Choose", desc: "Pick the smartest deal, powered by data." },
          { icon: ShoppingBag, title: "Shop", desc: "Buy direct from the retailer you trust." },
        ].map((s) => (
          <div key={s.title} className="rounded-xl border border-border bg-card p-5">
            <s.icon size={22} className="text-accent" />
            <h3 className="mt-3 text-base font-bold text-primary">{s.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-14 grid gap-6 rounded-2xl border border-border bg-muted/50 p-8 md:grid-cols-3">
        <div>
          <ShieldCheck className="text-accent" size={22} />
          <h3 className="mt-2 font-bold text-primary">Trusted retailers</h3>
          <p className="text-sm text-muted-foreground">We source only from verified sellers.</p>
        </div>
        <div>
          <TrendingDown className="text-accent" size={22} />
          <h3 className="mt-2 font-bold text-primary">Real price tracking</h3>
          <p className="text-sm text-muted-foreground">Original prices and honest discounts.</p>
        </div>
        <div>
          <Sparkles className="text-accent" size={22} />
          <h3 className="mt-2 font-bold text-primary">Curated hives</h3>
          <p className="text-sm text-muted-foreground">Focused categories, not endless noise.</p>
        </div>
      </div>
    </div>
  );
}