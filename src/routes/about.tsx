import { createFileRoute } from "@tanstack/react-router";
import { Search, Scale, CheckCircle2, ShoppingBag, ShieldCheck, TrendingDown, Sparkles, Users, Zap, HeartHandshake } from "lucide-react";
import aboutHero from "@/assets/about-hero.jpg";
import aboutStory from "@/assets/about-story.jpg";

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
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div className="absolute inset-0">
          <img src={aboutHero} alt="" className="h-full w-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/85 to-primary/40" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-20 md:py-28">
          <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">Our mission</span>
          <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight md:text-6xl">
            Find. Compare. <span className="text-accent">Shop Smart.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-primary-foreground/80">
            findhive brings together deals from trusted retailers so you never overpay again. We source, curate, and compare — you shop with confidence.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-accent">Our story</span>
            <h2 className="mt-2 text-3xl font-black text-primary md:text-4xl">Built by shoppers, for shoppers</h2>
            <p className="mt-4 text-muted-foreground">
              We started findhive because comparison shopping was broken — endless tabs, mismatched prices, and dead-end deals. Our team of collectors and everyday buyers set out to build one home for the categories we actually love: trading cards, watches, jewelry, bags, and outdoor gear.
            </p>
            <p className="mt-3 text-muted-foreground">
              Today, findhive curates offers from trusted retailers and surfaces the deal that's genuinely worth your click — no fluff, no fake discounts, just smart shopping.
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border">
            <img src={aboutStory} alt="Shopping and comparing deals" className="h-full w-full object-cover" loading="lazy" />
          </div>
        </div>
      </section>

      {/* Meet the Hive */}
      <section className="bg-muted/40 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-10 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-accent">Meet the hive</span>
            <h2 className="mt-2 text-3xl font-black text-primary md:text-4xl">How we work for you</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Search, title: "Find", desc: "Search across a curated hive of retailers." },
              { icon: Scale, title: "Compare", desc: "Side-by-side prices, ratings and specs." },
              { icon: CheckCircle2, title: "Choose", desc: "Pick the smartest deal, powered by data." },
              { icon: ShoppingBag, title: "Shop", desc: "Buy direct from the retailer you trust." },
            ].map((s) => (
              <div key={s.title} className="rounded-xl border border-border bg-card p-6">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent/15 text-accent">
                  <s.icon size={20} />
                </span>
                <h3 className="mt-4 text-base font-bold text-primary">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: ShieldCheck, title: "Trusted retailers", desc: "We source only from verified, reputable sellers." },
            { icon: TrendingDown, title: "Real price tracking", desc: "Original prices and honest, verified discounts." },
            { icon: Sparkles, title: "Curated hives", desc: "Focused categories, no endless noise or clutter." },
            { icon: Users, title: "Community-first", desc: "Real reviews from real shoppers — no bots." },
            { icon: Zap, title: "Lightning fast", desc: "Find the best deal in seconds, not hours." },
            { icon: HeartHandshake, title: "No hidden agenda", desc: "Transparent affiliate model, always disclosed." },
          ].map((v) => (
            <div key={v.title} className="rounded-xl border border-border bg-card p-6">
              <v.icon className="text-accent" size={22} />
              <h3 className="mt-3 font-bold text-primary">{v.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}