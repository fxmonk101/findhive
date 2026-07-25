import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search, Scale, CheckCircle2, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import slideTcg from "@/assets/slide-tcg.jpg";
import slideWatch from "@/assets/slide-watch.jpg";

const steps = [
  { icon: Search, title: "Find", desc: "Search across trusted retailers" },
  { icon: Scale, title: "Compare", desc: "Side-by-side prices & specs" },
  { icon: CheckCircle2, title: "Choose", desc: "Pick the best value deal" },
  { icon: ShoppingBag, title: "Shop", desc: "Buy direct from the retailer" },
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
        Chase the <span className="text-accent">rare pulls</span>.
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
        Every second, <span className="text-accent">on sale</span>.
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
        <span>find</span><span className="text-accent">hive</span>
      </>
    ),
    subtitle: "Find. Compare. Shop Smart.",
    cta: { label: "Start Shopping", to: "/shop" },
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
      className="hex-pattern relative overflow-hidden text-primary-foreground"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      {s.image && (
        <div className="absolute inset-0">
          <img src={s.image} alt="" className="h-full w-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/85 to-primary/40" />
        </div>
      )}

      <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-24">
        <div key={idx} className="max-w-2xl animate-fade-in">
          <span className="inline-block rounded-full bg-accent/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">
            {s.kicker}
          </span>
          <h1 className="mt-4 text-4xl font-black leading-tight md:text-6xl">{s.title}</h1>
          <p className="mt-4 text-lg font-semibold uppercase tracking-wide text-accent">
            {s.subtitle}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:brightness-95">
              <Link to={s.cta.to} params={s.cta.params as never}>{s.cta.label}</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/30 bg-transparent text-primary-foreground hover:bg-white/10 hover:text-primary-foreground">
              <Link to="/about">How it works</Link>
            </Button>
          </div>
        </div>

        {s.brand && (
          <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4 animate-fade-in">
            {steps.map((step, i) => (
              <div key={step.title} className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-accent text-accent-foreground text-xs font-bold">
                    {i + 1}
                  </span>
                  <step.icon size={20} className="text-accent" />
                </div>
                <h3 className="mt-3 text-lg font-bold">{step.title}</h3>
                <p className="text-sm text-primary-foreground/70">{step.desc}</p>
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