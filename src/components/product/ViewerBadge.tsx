import { Flame } from "lucide-react";

export function ViewerBadge({ count, size = "sm" }: { count: number; size?: "sm" | "md" }) {
  if (!count || count < 3) return null;
  const cls = size === "md" ? "text-xs px-3 py-1.5" : "text-[11px] px-2.5 py-1";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/95 font-bold text-accent-foreground shadow-sm backdrop-blur ${cls}`}
      aria-label={`${count} people viewing this product`}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-foreground opacity-70" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-foreground" />
      </span>
      <Flame size={size === "md" ? 13 : 11} />
      {count} people viewing
    </span>
  );
}