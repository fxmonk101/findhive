import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, Menu, Tag } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import { useT } from "@/lib/i18n";

export function CategoryNav() {
  const t = useT();
  const [megaOpen, setMegaOpen] = useState(false);

  return (
    <div className="relative hidden border-b border-border bg-background lg:block">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-4">
        <button
          type="button"
          onClick={() => setMegaOpen((o) => !o)}
          onMouseEnter={() => setMegaOpen(true)}
          className="flex items-center gap-2 border-r border-border py-3 pr-4 text-sm font-bold uppercase text-primary hover:text-accent"
        >
          <Menu size={18} /> {t("nav.allCategories")} <ChevronDown size={14} />
        </button>
        <nav className="flex items-center gap-6 text-sm font-semibold uppercase tracking-wide" onMouseEnter={() => setMegaOpen(false)}>
          <Link to="/" activeOptions={{ exact: true }} className="py-3 text-primary hover:text-accent [&.active]:text-accent" activeProps={{ className: "active" }}>Home</Link>
          <Link to="/shop" className="py-3 text-primary hover:text-accent [&.active]:text-accent" activeProps={{ className: "active" }}>{t("nav.shop")}</Link>
          <Link to="/reviews" className="py-3 text-primary hover:text-accent [&.active]:text-accent" activeProps={{ className: "active" }}>{t("nav.reviews")}</Link>
          <Link to="/about" className="py-3 text-primary hover:text-accent [&.active]:text-accent" activeProps={{ className: "active" }}>{t("nav.about")}</Link>
          <Link to="/contact" className="py-3 text-primary hover:text-accent [&.active]:text-accent" activeProps={{ className: "active" }}>{t("nav.contact")}</Link>
          <Link to="/faqs" className="py-3 text-primary hover:text-accent [&.active]:text-accent" activeProps={{ className: "active" }}>{t("nav.faqs")}</Link>
        </nav>
        <Link to="/shop" className="ml-auto flex items-center gap-1 py-3 text-sm font-bold uppercase text-accent hover:brightness-90">
          <Tag size={14} /> Special Offer
        </Link>
      </div>
      {megaOpen && (
        <div
          className="absolute left-0 right-0 top-full z-40 border-b border-border bg-background shadow-xl"
          onMouseLeave={() => setMegaOpen(false)}
        >
          <div className="mx-auto grid max-w-7xl grid-cols-5 gap-6 px-4 py-6">
            {CATEGORIES.map((cat) => (
              <div key={cat.slug}>
                <Link
                  to="/category/$category"
                  params={{ category: cat.slug }}
                  onClick={() => setMegaOpen(false)}
                  className="mb-3 flex items-center gap-2 text-sm font-bold uppercase text-primary hover:text-accent"
                >
                  <cat.icon size={16} /> {cat.name}
                </Link>
                <ul className="space-y-2">
                  {cat.subcategories.map((s) => (
                    <li key={s.slug}>
                      <Link
                        to="/category/$category/$sub"
                        params={{ category: cat.slug, sub: s.slug }}
                        onClick={() => setMegaOpen(false)}
                        className="text-sm text-muted-foreground hover:text-accent"
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
      )}
    </div>
  );
}