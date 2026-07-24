import { Link } from "@tanstack/react-router";
import { Search, Scale, CheckCircle2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  { icon: Search, title: "Find", desc: "Search across trusted retailers" },
  { icon: Scale, title: "Compare", desc: "Side-by-side prices & specs" },
  { icon: CheckCircle2, title: "Choose", desc: "Pick the best value deal" },
  { icon: ShoppingBag, title: "Shop", desc: "Buy direct from the retailer" },
];

export function Hero() {
  return (
    <section className="hex-pattern relative overflow-hidden text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-16 md:py-24">
        <div className="max-w-2xl">
          <span className="inline-block rounded-full bg-accent/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">
            Smart Shopping Comparison
          </span>
          <h1 className="mt-4 text-4xl font-black leading-tight md:text-6xl">
            <span className="text-primary-foreground">find</span>
            <span className="text-accent">hive</span>
          </h1>
          <p className="mt-4 text-lg font-semibold uppercase tracking-wide text-accent">
            Find. Compare. Shop Smart.
          </p>
          <p className="mt-4 max-w-lg text-primary-foreground/80">
            Discover, compare and shop the best deals on trading cards, watches, jewelry, bags and outdoor gear — all in one place.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:brightness-95">
              <Link to="/shop">Start Shopping</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/30 bg-transparent text-primary-foreground hover:bg-white/10 hover:text-primary-foreground">
              <Link to="/about">How it works</Link>
            </Button>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.title} className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-accent text-accent-foreground text-xs font-bold">
                  {i + 1}
                </span>
                <s.icon size={20} className="text-accent" />
              </div>
              <h3 className="mt-3 text-lg font-bold">{s.title}</h3>
              <p className="text-sm text-primary-foreground/70">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}