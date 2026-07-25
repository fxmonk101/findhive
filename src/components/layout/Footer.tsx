import { Link } from "@tanstack/react-router";
import { Facebook, Twitter, Linkedin, Send, Instagram } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { CATEGORIES } from "@/lib/categories";

export function Footer() {
  return (
    <footer className="mt-16 bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-4">
        <div className="md:col-span-1">
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-primary-foreground/70">
            Find. Compare. Shop Smart. findhive helps you discover the best deals across the web from trusted retailers.
          </p>
          <div className="mt-4 flex gap-3">
            {[Facebook, Twitter, Instagram, Linkedin, Send].map((I, i) => (
              <a key={i} href="#" aria-label="Social" className="grid h-8 w-8 place-items-center rounded-full border border-white/20 transition hover:border-accent hover:text-accent">
                <I size={14} />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-accent">Shop</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link to="/category/$category" params={{ category: c.slug }} className="hover:text-accent">{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-accent">Company</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li><Link to="/about" className="hover:text-accent">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-accent">Contact Us</Link></li>
            <li><Link to="/faqs" className="hover:text-accent">FAQs</Link></li>
            <li><Link to="/reviews" className="hover:text-accent">Reviews</Link></li>
            <li><Link to="/shop" className="hover:text-accent">Special Offers</Link></li>
          </ul>
          <h4 className="mb-4 mt-6 text-sm font-bold uppercase tracking-wide text-accent">Legal</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li><Link to="/privacy" className="hover:text-accent">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-accent">Terms of Service</Link></li>
            <li><Link to="/cookies" className="hover:text-accent">Cookie Policy</Link></li>
            <li><Link to="/affiliate-disclosure" className="hover:text-accent">Affiliate Disclosure</Link></li>
            <li><Link to="/shipping-returns" className="hover:text-accent">Shipping &amp; Returns</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-accent">Newsletter</h4>
          <p className="mb-3 text-sm text-primary-foreground/80">Get deals delivered weekly.</p>
          <form className="flex" onSubmit={(e) => e.preventDefault()}>
            <input type="email" required placeholder="Your email" className="min-w-0 flex-1 rounded-l bg-white/10 px-3 py-2 text-sm placeholder:text-primary-foreground/50 focus:outline-none focus:ring-1 focus:ring-accent" />
            <button className="rounded-r bg-accent px-4 text-sm font-bold text-accent-foreground hover:brightness-95">Join</button>
          </form>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 text-xs text-primary-foreground/60 sm:flex-row">
          <span>© {new Date().getFullYear()} findhive. All rights reserved.</span>
          <span>Affiliate disclosure: We may earn a commission from qualifying purchases via retailer links.</span>
        </div>
      </div>
    </footer>
  );
}