import { Link } from "@tanstack/react-router";
import { Truck, ShieldCheck, PackageCheck } from "lucide-react";
import { STORE_CONFIG } from "@/lib/store-config";
import { LocaleSwitcher } from "./LocaleSwitcher";

const MESSAGES = [
  { icon: Truck, text: `Free US shipping on orders over $${STORE_CONFIG.freeShippingThreshold}` },
  { icon: ShieldCheck, text: "Authentic products guaranteed — inspected before dispatch" },
  { icon: PackageCheck, text: "Cards sleeved & rigid-loaded on every order" },
];

export function AnnouncementBar() {
  return (
    <div className="border-b border-white/10 bg-navy-deep text-navy-foreground">
      <div className="mx-auto flex h-9 max-w-[1400px] items-center justify-between gap-6 px-4">
        <div className="flex min-w-0 flex-1 items-center gap-6 overflow-hidden text-[11.5px] font-medium tracking-wide">
          {MESSAGES.map(({ icon: Icon, text }, i) => (
            <span
              key={text}
              className={`flex shrink-0 items-center gap-1.5 ${i === 0 ? "" : "hidden lg:flex"}`}
            >
              <Icon size={13} className="text-accent" />
              <span className="truncate">{text}</span>
            </span>
          ))}
        </div>
        <div className="hidden shrink-0 items-center gap-4 text-[11.5px] md:flex">
          <Link to="/track-order" className="font-semibold hover:text-accent">Track Order</Link>
          <span className="opacity-25">|</span>
          <LocaleSwitcher />
        </div>
      </div>
    </div>
  );
}
