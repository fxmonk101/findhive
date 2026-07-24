import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute left-0 top-0 h-full w-80 max-w-[85vw] overflow-auto bg-background shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-4 py-4">
          <span className="text-lg font-bold text-primary">Menu</span>
          <button onClick={onClose} aria-label="Close" className="grid h-8 w-8 place-items-center">
            <X size={20} />
          </button>
        </div>
        <nav className="flex flex-col p-4 text-sm font-semibold">
          <Link to="/" onClick={onClose} className="border-b border-border py-3 text-primary hover:text-accent">Home</Link>
          <Link to="/shop" onClick={onClose} className="border-b border-border py-3 text-primary hover:text-accent">Shop</Link>
          <Link to="/about" onClick={onClose} className="border-b border-border py-3 text-primary hover:text-accent">About Us</Link>
          <Link to="/contact" onClick={onClose} className="border-b border-border py-3 text-primary hover:text-accent">Contact Us</Link>
          <Link to="/faqs" onClick={onClose} className="border-b border-border py-3 text-primary hover:text-accent">FAQs</Link>
          <Link to="/account" onClick={onClose} className="border-b border-border py-3 text-primary hover:text-accent">My Account</Link>
        </nav>
        <div className="px-4 pb-8">
          <h3 className="mb-3 mt-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">Categories</h3>
          {CATEGORIES.map((c) => (
            <div key={c.slug} className="mb-4">
              <Link
                to="/category/$category"
                params={{ category: c.slug }}
                onClick={onClose}
                className="flex items-center gap-2 text-sm font-bold text-primary hover:text-accent"
              >
                <c.icon size={16} /> {c.name}
              </Link>
              <ul className="mt-1.5 space-y-1 pl-6">
                {c.subcategories.map((s) => (
                  <li key={s.slug}>
                    <Link
                      to="/category/$category/$sub"
                      params={{ category: c.slug, sub: s.slug }}
                      onClick={onClose}
                      className="text-xs text-muted-foreground hover:text-accent"
                    >
                      {s.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}