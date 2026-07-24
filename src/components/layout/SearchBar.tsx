import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import { autocomplete, type Product } from "@/lib/products";
import { formatPrice } from "@/lib/format";

export function SearchBar() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const wrapRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!q.trim()) { setResults([]); return; }
    const t = setTimeout(() => {
      autocomplete(q).then(setResults).catch(() => setResults([]));
    }, 150);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <form
      ref={wrapRef}
      onSubmit={(e) => {
        e.preventDefault();
        setOpen(false);
        navigate({ to: "/search", search: { q, category: category || undefined } });
      }}
      className="relative flex w-full items-stretch overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-black/5"
      role="search"
    >
      <input
        type="search"
        placeholder="Search for products"
        value={q}
        onChange={(e) => { setQ(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm text-primary outline-none placeholder:text-muted-foreground"
      />
      <div className="hidden items-center border-l border-border pl-3 pr-2 sm:flex">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-transparent text-xs font-semibold uppercase text-primary outline-none"
        >
          <option value="">Select Category</option>
          {CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        aria-label="Search"
        className="grid w-12 shrink-0 place-items-center bg-accent text-accent-foreground transition hover:brightness-95"
      >
        <Search size={18} strokeWidth={2.5} />
      </button>
      {open && results.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-border bg-popover shadow-xl">
          <ul className="max-h-96 overflow-auto">
            {results.map((p) => (
              <li key={p.id}>
                <Link
                  to="/product/$id"
                  params={{ id: p.id }}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-muted"
                >
                  <img src={p.image_url} alt="" className="h-10 w-10 shrink-0 rounded object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm text-foreground">{p.title}</div>
                    <div className="text-xs text-muted-foreground">{p.source_retailer}</div>
                  </div>
                  <span className="text-sm font-semibold text-primary">{formatPrice(p.price)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
}