import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Search, ChevronDown, Check } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import { autocomplete, type Product } from "@/lib/products";
import { formatPrice } from "@/lib/format";

export function SearchBar() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const [catOpen, setCatOpen] = useState(false);
  const wrapRef = useRef<HTMLFormElement>(null);
  const catRef = useRef<HTMLDivElement>(null);

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
      if (catRef.current && !catRef.current.contains(e.target as Node)) setCatOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const selectedCat = CATEGORIES.find((c) => c.slug === category);

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
      <div ref={catRef} className="relative hidden items-center border-l border-border sm:flex">
        <button
          type="button"
          onClick={() => setCatOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={catOpen}
          className="flex h-full items-center gap-1.5 px-3 text-xs font-bold uppercase tracking-wide text-primary transition hover:text-accent"
        >
          <span className="max-w-[8rem] truncate">{selectedCat ? selectedCat.name : "All Categories"}</span>
          <ChevronDown size={14} className={`transition-transform ${catOpen ? "rotate-180" : ""}`} />
        </button>
        {catOpen && (
          <div
            role="listbox"
            className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-popover shadow-xl ring-1 ring-black/5"
          >
            <button
              type="button"
              onClick={() => { setCategory(""); setCatOpen(false); }}
              className={`flex w-full items-center justify-between px-3 py-2.5 text-sm transition hover:bg-muted ${!category ? "font-semibold text-accent" : "text-foreground"}`}
            >
              All Categories
              {!category && <Check size={14} />}
            </button>
            <div className="h-px bg-border" />
            <ul className="max-h-72 overflow-auto py-1">
              {CATEGORIES.map((c) => {
                const active = category === c.slug;
                return (
                  <li key={c.slug}>
                    <button
                      type="button"
                      onClick={() => { setCategory(c.slug); setCatOpen(false); }}
                      className={`flex w-full items-center gap-2 px-3 py-2 text-sm transition hover:bg-muted ${active ? "font-semibold text-accent" : "text-foreground"}`}
                    >
                      <c.icon size={15} className={active ? "text-accent" : "text-muted-foreground"} />
                      <span className="flex-1 text-left">{c.name}</span>
                      {active && <Check size={14} />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
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