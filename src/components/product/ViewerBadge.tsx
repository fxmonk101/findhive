import { Flame } from "lucide-react";

export function ViewerBadge({ count, size = "sm" }: { count: number; size?: "sm" | "md" }) {
  if (!count || count < 3) return null;
  const cls = size === "md" ? "text-xs px-2.5 py-1" : "text-[11px] px-2 py-0.5";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-accent/10 font-semibold text-accent ${cls}`}
      aria-label={`${count} people viewing this product`}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
      </span>
      <Flame size={size === "md" ? 13 : 11} className="opacity-80" />
      {count} people viewing
    </span>
  );
}