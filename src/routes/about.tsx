import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, ShoppingBag, Truck, ShieldCheck, PackageCheck, Users, Zap, HeartHandshake, Factory } from "lucide-react";
import aboutHero from "@/assets/about-hero.jpg";
import aboutStory from "@/assets/about-story.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About findhive — Trending products, shipped by us" },
      { name: "description", content: "findhive sources trending products directly from manufacturers, quality-checks them in our warehouse, and ships to your door." },
      { property: "og:title", content: "About findhive — Our story" },
      { property: "og:description", content: "Direct from manufacturers. Shipped from our own warehouse." },
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
          <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">Our store</span>
          <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight md:text-6xl">
            Trending products. <span className="text-accent">Shipped by us.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-primary-foreground/80">
            findhive is an online store, not a marketplace. We source trending products directly from manufacturers, quality-check every item in our warehouse, and ship to your door.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-accent">Our story</span>
            <h2 className="mt-2 text-3xl font-black text-primary md:text-4xl">One store, one warehouse, one team</h2>
            <p className="mt-4 text-muted-foreground">
              We started findhive because online shopping was full of confusion — dozens of resellers listing the same product, uncertain authenticity. So we built a store that owns its inventory end-to-end: trending trading cards, watches, and fitness gear from manufacturers we've vetted ourselves.
            </p>
            <p className="mt-3 text-muted-foreground">
              Every product is stocked in our warehouse, quality-checked by our team, and shipped directly. Honest pricing, real inventory, one place to hold accountable.
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border">
            <img src={aboutStory} alt="findhive team preparing orders" className="h-full w-full object-cover" loading="lazy" />
          </div>
        </div>
      </section>

      {/* Meet the Hive */}
      <section className="bg-muted/40 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-10 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-accent">How it works</span>
            <h2 className="mt-2 text-3xl font-black text-primary md:text-4xl">From factory to your door</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Factory, title: "Sourced Direct", desc: "We buy straight from manufacturers, no resellers." },
              { icon: PackageCheck, title: "Quality-Checked", desc: "Every unit inspected before we list it." },
              { icon: ShoppingBag, title: "Ordered by You", desc: "One clean checkout — card, Zelle, Cash App or wire." },
              { icon: Truck, title: "Shipped by Us", desc: "Packed and dispatched from our warehouse, fast." },
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
            { icon: ShieldCheck, title: "Authentic guaranteed", desc: "Every product verified by our team." },
            { icon: Sparkles, title: "Trending, restocked", desc: "We stock what people want, refreshed weekly." },
            { icon: Truck, title: "Fast shipping", desc: "Usually ships within 24 hours from our warehouse." },
            { icon: Users, title: "Real reviews", desc: "Honest feedback from real findhive customers." },
            { icon: Zap, title: "End-to-end", desc: "Same team from cart to delivery to support." },
            { icon: HeartHandshake, title: "Human support", desc: "Real people on email within one business day." },
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