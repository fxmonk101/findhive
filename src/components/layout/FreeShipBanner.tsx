import { Truck } from "lucide-react";
import { STORE_CONFIG } from "@/lib/store-config";

export function FreeShipBanner() {
  return (
    <div className="bg-primary/95 text-primary-foreground">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-1.5 text-center text-xs font-medium">
        <Truck size={14} className="text-accent" />
        <span>
          Free shipping on orders over ${STORE_CONFIG.freeShippingThreshold} · Ships from {STORE_CONFIG.warehouseLocation} · Authentic products guaranteed
        </span>
      </div>
    </div>
  );
}