import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Heart, ShoppingBag, User, Menu, Truck } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { SearchBar } from "./SearchBar";
import { MegaMenu } from "./MegaMenu";
import { MobileMenu } from "./MobileMenu";
import { AnnouncementBar } from "./AnnouncementBar";
import { useWishlist } from "@/lib/stores/wishlist";
import { useCart } from "@/lib/stores/cart";
import { useHydrated } from "@/lib/use-hydrated";
import { useCurrency } from "@/lib/use-currency";

function Count({ n }: { n: number }) {
  if (!n) return null;
  return (
    <span className="absolute -right-1 -top-1 grid h-[17px] min-w-[17px] place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground ring-2 ring-navy">
      {n > 99 ? "99+" : n}
    </span>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [condensed, setCondensed] = useState(false);
  const hydrated = useHydrated();
  const money = useCurrency();
  const wishCount = useWishlist((s) => (hydrated ? s.ids.length : 0));
  const cartCount = useCart((s) => (hydrated ? s.items.reduce((n, i) => n + i.quantity, 0) : 0));
  const subtotal = useCart((s) => (hydrated ? s.items.reduce((n, i) => n + i.quantity * i.price, 0) : 0));

  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 90);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="h-1 w-full bg-gradient-to-r from-accent via-gold-soft to-accent" />
      <header className="sticky top-0 z-40 bg-navy text-navy-foreground shadow-lift">
        <div className={condensed ? "hidden" : "block"}>
          <AnnouncementBar />
        </div>

        <div
          className={`mx-auto grid max-w-[1400px] grid-cols-[auto_1fr_auto] items-center gap-3 px-4 transition-all duration-300 lg:gap-6 ${
            condensed ? "py-2" : "py-3.5"
          }`}
        >
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl transition hover:bg-white/10 lg:hidden"
            >
              <Menu size={21} />
            </button>
            <Link to="/" aria-label="findhive home" className="shrink-0">
              <Logo className={condensed ? "h-8 md:h-9" : "h-9 md:h-11"} />
            </Link>
          </div>

          <div className="hidden md:block">
            <SearchBar variant="dark" />
          </div>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <Link
              to="/track-order"
              className="hidden items-center gap-1.5 rounded-xl px-3 py-2 text-[13px] font-semibold transition hover:bg-white/10 xl:flex"
            >
              <Truck size={17} /> Track Order
            </Link>
            <Link
              to="/account"
              className="hidden items-center gap-1.5 rounded-xl px-3 py-2 text-[13px] font-semibold transition hover:bg-white/10 lg:flex"
            >
              <User size={17} /> Account
            </Link>
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="relative grid h-10 w-10 place-items-center rounded-xl transition hover:bg-white/10"
            >
              <Heart size={20} />
              <Count n={wishCount} />
            </Link>
            <Link
              to="/cart"
              aria-label="Cart"
              className="flex items-center gap-2 rounded-xl px-1.5 py-1.5 transition hover:bg-white/10 sm:pr-3"
            >
              <span className="relative grid h-9 w-9 place-items-center">
                <ShoppingBag size={20} />
                <Count n={cartCount} />
              </span>
              <span className="hidden text-left leading-tight sm:block">
                <span className="block text-[10px] uppercase tracking-wider opacity-60">Cart</span>
                <span className="block text-[13px] font-bold">{money(subtotal)}</span>
              </span>
            </Link>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4">
            <MegaMenu />
            <div className="hidden items-center gap-4 py-2 text-[12px] font-medium text-navy-foreground/70 lg:flex">
              <Link to="/reviews" className="hover:text-accent">Reviews</Link>
              <Link to="/shipping-returns" className="hover:text-accent">Shipping</Link>
              <Link to="/contact" className="hover:text-accent">Contact</Link>
            </div>
          </div>
          <div className="px-4 pb-3 md:hidden">
            <SearchBar variant="dark" />
          </div>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
