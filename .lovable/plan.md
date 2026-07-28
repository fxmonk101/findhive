Big scope, so grouping into 6 workstreams. I'll implement all of them in sequence unless you want to trim.

## 1. Brand messaging cleanup (comparison → owned store)
- Delete `src/components/home/Partners.tsx` and remove its usage on the homepage.
- Footer: replace affiliate disclosure line with "© findhive · Secure checkout · Authentic products guaranteed". Update tagline to "findhive — trending products, restocked and shipped by us". Drop the "Affiliate Disclosure" link (keep the route file but unlink, or remove entirely — I'll remove entirely).
- About page: rewrite copy to "sourced directly from manufacturers, quality-checked in our warehouse, shipped by us". Keep hero + story images.
- Hero brand slide steps: replace Find/Compare/Choose/Shop with Discover / Add to Cart / Checkout / Fast Shipping (new icons).
- Grep for stray "View Deal", "Go to Store", "retailer", "compare" strings and normalize to Add to Cart / Buy Now / findhive.

## 2. Remove compare + retailer surface (final pass)
- Delete `src/lib/stores/compare.ts` and any imports.
- Confirm `/compare` route gone (already removed per history) and verify no lingering links.
- Product card: remove any retailer badge, keep single Add to Cart primary CTA.
- Product page: remove retailer badge + any comparison table remnant.
- Header: confirm no compare icon (already done) — audit once.

## 3. Product schema extension + seed refresh
DB migration adds columns to `public.products`:
- `meta_title text`, `meta_description text`
- `short_description text`
- `long_description text` (backfilled from existing `description`)
- `sold_count int default 0`
- `stock_count int default 0`
- `viewer_count int default 0`
- `images jsonb default '[]'::jsonb` (array of URLs; primary still in `image_url` for back-compat)
- `attributes jsonb default '{}'::jsonb` (spec key/value for Additional Information tab)

Then a data update pass:
- Populate `meta_title` = `{title} | findhive` (trim ≤60), `meta_description` from short_description (≤160).
- Randomize plausible `sold_count` (30–400), `stock_count` (3–40), `viewer_count` (5–35) with higher ranges for trading cards + watches.
- Seed `images` with `[image_url]` for now (single-image → gallery shows clean single image). A handful of hero products get 2–3 duplicated variants to demonstrate the multi-image branch. Real manufacturer imagery replaces later.
- Fill `attributes` per category (watches: movement, case size, band material, water resistance; TCG: set, language, condition; fitness: weight, material).

Frontend `Product` type in `src/lib/products.ts` extended accordingly; select list updated.

## 4. Redesigned product card + 2-col shop grid
- `ProductCard`: larger image aspect (4/5), bigger padding, softer radius (`rounded-2xl`), hover elevation (`shadow-md → shadow-xl`), % off badge on sale, "🔥 {viewer_count} viewing" pill, "{sold_count} sold this month" muted line, single gold Add to Cart CTA.
- `ProductGrid`: switch to `grid-cols-1 lg:grid-cols-2` with generous gap. Category / shop / search results routes inherit automatically.

## 5. Product page rebuild (`src/routes/product.$id.tsx`)
- Two-column layout: left = image gallery (conditional: single large image w/ hover-zoom if `images.length <= 1`, else main + thumb strip + prev/next arrows); right = title, rating→#reviews anchor, price + % off, stock line ("In Stock — {stock_count} left"), viewer pill, qty selector, Add to Cart + Buy Now (Buy Now = add + navigate to /checkout), trust badges row (Secure Checkout, Authentic Guaranteed, Fast Shipping).
- Tabs (shadcn `Tabs`): Description (`long_description`, preserved whitespace) · Additional Information (attributes table) · Reviews (per-product star breakdown + filtered list from reviews store + inline write-a-review form scoped by `product_id`).
- "You may also like" carousel using existing `getRelated`.
- Mobile sticky Add to Cart bar (fixed bottom, appears after scroll).
- Head meta: title = `meta_title`, description = `meta_description`, og:title/og:description, og:image = primary product image (absolute-safe: image URLs already absolute per assets).

Reviews store gains `product_id?: string`; existing seed reviews stay global (shown on `/reviews`), product reviews filter by id.

## 6. Design system + trust polish
- `src/styles.css`: bump `--radius` slightly (e.g. 0.5rem → 0.75rem), soften card shadow tokens, add `--surface` = #F7F8FA and use it as `body` background. Confirm gold CTA has consistent padding + subtle hover (already close).
- Free shipping banner: thin bar above header ("Free shipping on orders over $75 · Ships from our US warehouse") — value hard-coded but centralised in `src/lib/store-config.ts` for easy edit.
- Trust badges component reused on product page + checkout.
- Footer keeps 5-column layout; refresh copy + payment badges retained.

## Out of scope (call out)
- Real product photography — placeholder single image per product for now, schema is ready.
- Real payment processor — mock checkout stays.
- Server-side SEO for product pages already works via TanStack `head()` on the route; no sitemap change this pass.

## Technical notes
- Migration is additive with defaults so existing rows keep working; then a `supabase--insert` UPDATE pass backfills content.
- All changes stay client/presentation except the one schema migration.
- No new dependencies expected (shadcn `Tabs` already available; if not, I'll add it via existing shadcn scaffolding).

Approve and I'll execute end-to-end; reply with trims if you want to stage it.