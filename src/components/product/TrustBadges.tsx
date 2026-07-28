import { Lock, ShieldCheck, Truck, RotateCcw } from "lucide-react";

export function TrustBadges({ compact = false }: { compact?: boolean }) {
  const items = [
    { icon: Lock, label: "Secure checkout", sub: "SSL encrypted" },
    { icon: ShieldCheck, label: "Authentic guaranteed", sub: "Sourced from manufacturers" },
    { icon: Truck, label: "Fast shipping", sub: "Ships from our warehouse" },
    { icon: RotateCcw, label: "30-day returns", sub: "Easy & hassle-free" },
  ];
  return (
    <ul
      className={`grid gap-3 ${
        compact ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-2 md:grid-cols-4"
      }`}
    >
      {items.map((i) => (
        <li
          key={i.label}
          className="flex items-start gap-2 rounded-xl border border-border bg-card/60 p-3"
        >
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent/15 text-accent">
            <i.icon size={16} />
          </span>
          <div className="min-w-0">
            <div className="text-xs font-bold uppercase tracking-wide text-primary">
              {i.label}
            </div>
            <div className="truncate text-[11px] text-muted-foreground">{i.sub}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}