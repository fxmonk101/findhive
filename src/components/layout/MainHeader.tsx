import { Link } from "@tanstack/react-router";
import { Heart, GitCompareArrows, ShoppingBag, User } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { SearchBar } from "./SearchBar";
import { useWishlist } from "@/lib/stores/wishlist";
import { useCompare } from "@/lib/stores/compare";
import { useCart } from "@/lib/stores/cart";
import { useHydrated } from "@/lib/use-hydrated";
import { formatPrice } from "@/lib/format";

function Badge({ count }: { count: number }) {
  if (!count) return null;
  return (
    <span className="absolute -right-1.5 -top-1.5 grid h-4 min-w-[16px] place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
      {count}
    </span>
  );
}

export function MainHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  const hydrated = useHydrated();
  const wishCount = useWishlist((s) => (hydrated ? s.ids.length : 0));
  const compCount = useCompare((s) => (hydrated ? s.ids.length : 0));
  const cartCount = useCart((s) => (hydrated ? s.items.reduce((n, i) => n + i.quantity, 0) : 0));
  const subtotal = useCart((s) => (hydrated ? s.items.reduce((n, i) => n + i.quantity * i.price, 0) : 0));

  return (
    <div className="bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 lg:gap-6">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open menu"
          className="grid h-10 w-10 place-items-center rounded hover:bg-white/10 lg:hidden"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <Link to="/" className="shrink-0"><Logo /></Link>
        <div className="hidden flex-1 md:block">
          <SearchBar />
        </div>
        <div className="ml-auto flex items-center gap-3 md:gap-5">
          <Link to="/account" className="hidden items-center gap-1.5 text-sm font-semibold uppercase tracking-wide hover:text-accent lg:flex">
            <User size={16} /> My Account
          </Link>
          <Link to="/wishlist" className="relative grid h-9 w-9 place-items-center hover:text-accent" aria-label="Wishlist">
            <Heart size={20} />
            <Badge count={wishCount} />
          </Link>
          <Link to="/compare" className="relative grid h-9 w-9 place-items-center hover:text-accent" aria-label="Compare">
            <GitCompareArrows size={20} />
            <Badge count={compCount} />
          </Link>
          <Link to="/cart" className="relative flex items-center gap-2 hover:text-accent" aria-label="Cart">
            <div className="relative grid h-9 w-9 place-items-center">
              <ShoppingBag size={20} />
              <Badge count={cartCount} />
            </div>
            <span className="hidden text-sm font-semibold md:inline">{formatPrice(subtotal)}</span>
          </Link>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 pb-3 md:hidden">
        <SearchBar />
      </div>
    </div>
  );
}