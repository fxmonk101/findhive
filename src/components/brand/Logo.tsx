type Props = {
  variant?: "on-navy" | "on-light";
  className?: string;
  showWordmark?: boolean;
};

export function Logo({ variant = "on-navy", className = "", showWordmark = true }: Props) {
  const findColor = variant === "on-navy" ? "text-white" : "text-primary";
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 40 40" className="h-9 w-9 shrink-0" fill="none" aria-hidden="true">
        <path d="M20 2 L36 11 V29 L20 38 L4 29 V11 Z" className="stroke-accent" strokeWidth="2.5" strokeLinejoin="round" fill="none" />
        <circle cx="17" cy="18" r="6" className="stroke-accent" strokeWidth="2.5" fill="none" />
        <line x1="22" y1="23" x2="30" y2="31" className="stroke-accent" strokeWidth="2.8" strokeLinecap="round" />
        <rect x="14" y="15" width="6" height="6" className="stroke-accent" strokeWidth="1.4" fill="none" />
        <line x1="14" y1="18" x2="20" y2="18" className="stroke-accent" strokeWidth="1.4" />
        <line x1="17" y1="15" x2="17" y2="21" className="stroke-accent" strokeWidth="1.4" />
      </svg>
      {showWordmark && (
        <span className="text-2xl font-black tracking-tight leading-none">
          <span className={findColor}>find</span>
          <span className="text-accent">hive</span>
        </span>
      )}
    </div>
  );
}