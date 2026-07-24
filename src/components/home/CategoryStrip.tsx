import { Link } from "@tanstack/react-router";
import { CATEGORIES } from "@/lib/categories";

export function CategoryStrip() {
  return (
    <section className="border-b border-border bg-muted/50">
      <div className="mx-auto max-w-7xl overflow-x-auto scrollbar-hide px-4">
        <ul className="flex items-stretch gap-2 py-3">
          {CATEGORIES.map((c) => (
            <li key={c.slug} className="shrink-0">
              <Link
                to="/category/$category"
                params={{ category: c.slug }}
                className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-primary transition hover:border-accent hover:text-accent"
              >
                <c.icon size={16} /> {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}