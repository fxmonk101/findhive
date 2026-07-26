import { Link } from "@tanstack/react-router";
import { Facebook, Twitter, Linkedin, Send, Instagram, CreditCard, Banknote, Wallet, Landmark } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { CATEGORIES } from "@/lib/categories";

function ShareLinks() {
  const shareUrl = typeof window !== "undefined" ? window.location.href : "https://findhive.lovable.app";
  const text = "Find. Compare. Shop Smart. — findhive";
  const enc = encodeURIComponent;
  const links = [
    { I: Facebook, label: "Share on Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${enc(shareUrl)}` },
    { I: Twitter, label: "Share on X", href: `https://twitter.com/intent/tweet?url=${enc(shareUrl)}&text=${enc(text)}` },
    { I: Linkedin, label: "Share on LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(shareUrl)}` },
    { I: Send, label: "Share on Telegram", href: `https://t.me/share/url?url=${enc(shareUrl)}&text=${enc(text)}` },
    { I: Instagram, label: "Share on Instagram", href: `https://www.instagram.com/` },
  ];
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {links.map(({ I, label, href }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          title={label}
          className="grid h-9 w-9 place-items-center rounded-full border border-white/20 transition hover:-translate-y-0.5 hover:border-accent hover:bg-accent hover:text-accent-foreground"
        >
          <I size={15} />
        </a>
      ))}
    </div>
  );
}

function PaymentBadge({ icon: Icon, label }: { icon: typeof CreditCard; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/5 px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wide text-primary-foreground/90">
      <Icon size={14} className="text-accent" />
      {label}
    </span>
  );
}

export function Footer() {
  return (
    <footer className="mt-16 bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-2 lg:grid-cols-5">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-primary-foreground/70">
            Find. Compare. Shop Smart. findhive curates deals across trusted retailers.
          </p>
          <ShareLinks />
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
        </div>
        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-accent">Legal</h4>
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
          <p className="mb-3 text-sm text-primary-foreground/80">Weekly deals in your inbox.</p>
          <form className="flex" onSubmit={(e) => e.preventDefault()}>
            <input type="email" required placeholder="Your email" className="min-w-0 flex-1 rounded-l bg-white/10 px-3 py-2 text-sm placeholder:text-primary-foreground/50 focus:outline-none focus:ring-1 focus:ring-accent" />
            <button className="rounded-r bg-accent px-4 text-sm font-bold text-accent-foreground hover:brightness-95">Join</button>
          </form>
          <h4 className="mb-3 mt-6 text-sm font-bold uppercase tracking-wide text-accent">We Accept</h4>
          <div className="flex flex-wrap gap-2">
            <PaymentBadge icon={CreditCard} label="Card" />
            <PaymentBadge icon={Wallet} label="Zelle" />
            <PaymentBadge icon={Banknote} label="Cash App" />
            <PaymentBadge icon={Landmark} label="Wire" />
          </div>
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