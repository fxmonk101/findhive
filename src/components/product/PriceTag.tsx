import { percentOff } from "@/lib/format";
import { useCurrency } from "@/lib/use-currency";

export function PriceTag({ price, original, size = "md" }: { price: number; original?: number | null; size?: "sm" | "md" | "lg" }) {
  const off = percentOff(price, original);
  const format = useCurrency();
  const priceCls = size === "lg" ? "text-2xl font-bold" : size === "sm" ? "text-sm font-semibold" : "text-lg font-bold";
  return (
    <div className="flex flex-wrap items-baseline gap-2">
      <span className={`${priceCls} text-primary`}>{format(price)}</span>
      {original && original > price && (
        <span className="text-xs text-muted-foreground line-through">{format(original)}</span>
      )}
      {off && (
        <span className="rounded bg-accent px-1.5 py-0.5 text-[10px] font-bold text-accent-foreground">
          -{off}%
        </span>
      )}
    </div>
  );
}