import { SiVisa, SiMastercard, SiAmericanexpress, SiDiscover, SiCashapp } from "react-icons/si";
import { Landmark } from "lucide-react";

const items = [
  { I: SiVisa, label: "Visa", color: "#1A1F71" },
  { I: SiMastercard, label: "Mastercard", color: "#EB001B" },
  { I: SiAmericanexpress, label: "American Express", color: "#2E77BB" },
  { I: SiDiscover, label: "Discover", color: "#FF6000" },
  { I: SiCashapp, label: "Cash App", color: "#00D632" },
];

export function PaymentIcons({ className = "", tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  const chip =
    tone === "dark"
      ? "border-border bg-white"
      : "border-white/15 bg-white";
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {items.map(({ I, label, color }) => (
        <span
          key={label}
          aria-label={label}
          title={label}
          className={`inline-flex h-8 w-12 items-center justify-center rounded-md border ${chip} shadow-sm`}
        >
          <I size={22} color={color} aria-hidden />
        </span>
      ))}
      <span
        aria-label="Bank Transfer"
        title="Bank Transfer / Wire"
        className={`inline-flex h-8 items-center gap-1 rounded-md border px-2 ${chip} text-[10px] font-bold text-primary shadow-sm`}
      >
        <Landmark size={14} className="text-primary" />
        Wire
      </span>
    </div>
  );
}