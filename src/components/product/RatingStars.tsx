import { Star } from "lucide-react";

export function RatingStars({ rating, reviewCount, size = 14 }: { rating: number; reviewCount?: number; size?: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[0, 1, 2, 3, 4].map((i) => {
          const filled = i < full || (i === full && half);
          return (
            <Star
              key={i}
              size={size}
              className={filled ? "fill-accent text-accent" : "text-muted-foreground/40"}
              strokeWidth={1.5}
            />
          );
        })}
      </div>
      <span className="text-xs text-muted-foreground">
        {rating.toFixed(1)}
        {reviewCount != null && ` (${reviewCount.toLocaleString()})`}
      </span>
    </div>
  );
}