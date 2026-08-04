import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Sparkles, ShoppingBag, CreditCard, Truck, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import slideTcg from "@/assets/hero-slider-1.jpg";
import slideWatch from "@/assets/hero-slider-2.jpg";
import slideBrand from "@/assets/hero-slider-3.jpg";

const steps = [
  { icon: Sparkles, title: "Discover", desc: "Trending products, restocked weekly" },
  { icon: ShoppingBag, title: "Add to Cart", desc: "Authentic goods, one clean checkout" },
  { icon: CreditCard, title: "Checkout", desc: "Card, Zelle, Cash App or Wire" },
  { icon: Truck, title: "Fast Shipping", desc: "Ships from our own warehouse" },
];

type Slide = {
  kicker: string;
  title: React.ReactNode;
  subtitle: string;
  cta: { label: string; to: string; params?: Record<string, string> };
  image?: string;
  brand?: boolean;
};

const slides: Slide[] = [
  {
    kicker: "Trending in Trading Cards",
    title: (
      <>
        Chase the <span className="underline decoration-accent decoration-4 underline-offset-8">rare pulls</span>.
      </>
    ),
    subtitle: "Booster boxes, graded slabs & sealed product — priced right.",
    cta: { label: "Shop Trading Cards", to: "/category/$category", params: { category: "trading-cards" } },
    image: slideTcg,
  },
  {
    kicker: "Timeless Deals on Watches",
    title: (
      <>
        Every second, <span className="underline decoration-accent decoration-4 underline-offset-8">on sale</span>.
      </>
    ),
    subtitle: "Luxury automatics, dive watches & everyday classics.",
    cta: { label: "Shop Watches", to: "/category/$category", params: { category: "watches" } },
    image: slideWatch,
  },
  {
    kicker: "Smart Shopping Comparison",
    title: (
      <>
        <span>findhive</span>
      </>
    ),
    subtitle: "Trending products. Restocked & shipped by us.",
    cta: { label: "Start Shopping", to: "/shop" },
    image: slideBrand,
    brand: true,
  },
];

export function Hero() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [paused]);

  const go = (d: number) => setIdx((i) => (i + d + slides.length) % slides.length);
  const s = slides[idx];

  return (
    <section
      className="hex-pattern relative overflow-hidden text-primary-foreground min-h-[420px] sm:min-h-[520px] md:min-h-[640px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      {slides.map((sl, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ease-out ${i === idx ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          aria-hidden={i !== idx}
        >
          {sl.image && (
            <img
              src={sl.image}
              alt=""
              className={`h-full w-full object-cover ${i === idx ? "animate-hero-ken-burns" : ""}`}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/70 to-primary/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
        </div>
      ))}

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:py-16 md:py-24">
        <div key={idx} className="max-w-2xl">
          <span className="animate-hero-kicker inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground">
            {s.kicker}
          </span>
          <h1 className="animate-hero-word mt-4 text-3xl font-black leading-tight text-primary-foreground sm:text-4xl md:text-6xl">
            {s.title}
            <span className="mt-3 block h-1 w-24 origin-left rounded-full bg-accent animate-hero-underline" />
          </h1>
          <p className="animate-hero-rise mt-5 text-base font-semibold uppercase tracking-wide text-primary-foreground md:text-lg" style={{ animationDelay: "250ms" }}>
            {s.subtitle}
          </p>
          <div className="animate-hero-rise mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap" style={{ animationDelay: "450ms" }}>
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:brightness-95">
              <Link to={s.cta.to} params={s.cta.params as never}>{s.cta.label}</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/30 bg-transparent text-primary-foreground hover:bg-white/10 hover:text-primary-foreground">
              <Link to="/about">How it works</Link>
            </Button>
          </div>
        </div>

        {s.brand && (
          <div className="animate-hero-rise mt-10 grid grid-cols-2 gap-3 md:mt-14 md:grid-cols-4 md:gap-4" style={{ animationDelay: "650ms" }}>
            {steps.map((step, i) => (
              <div key={step.title} className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-accent text-accent-foreground text-xs font-bold">
                    {i + 1}
                  </span>
                  <step.icon size={20} className="text-primary-foreground" />
                </div>
                <h3 className="mt-3 text-lg font-bold text-primary-foreground">{step.title}</h3>
                <p className="text-sm text-primary-foreground/80">{step.desc}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 flex items-center gap-3">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous slide"
            className="grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-white/5 backdrop-blur hover:border-accent hover:text-accent"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === idx}
                onClick={() => setIdx(i)}
                className={`h-2 rounded-full transition-all ${i === idx ? "w-8 bg-accent" : "w-2 bg-white/30 hover:bg-white/60"}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next slide"
            className="grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-white/5 backdrop-blur hover:border-accent hover:text-accent"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}