import logoOnNavy from "@/assets/findhive-logo.png.asset.json";
import logoOnLight from "@/assets/findhive-logo-navy.png.asset.json";

type Props = {
  variant?: "on-navy" | "on-light";
  className?: string;
  /** Kept for API compatibility — the brand mark itself contains the wordmark. */
  showWordmark?: boolean;
};

export function Logo({ variant = "on-navy", className = "" }: Props) {
  const src = variant === "on-navy" ? logoOnNavy.url : logoOnLight.url;
  return (
    <img
      src={src}
      alt="findhive"
      width={790}
      height={316}
      className={`h-10 w-auto shrink-0 md:h-11 ${className}`}
    />
  );
}