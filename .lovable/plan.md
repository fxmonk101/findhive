
# findhive — Build Plan

A modern shopping-comparison app with a navy #0D1B3E + gold #F5A623 identity, 5 top categories, and full wishlist / compare / cart flows. Product data will be database-driven with realistic seeded mocks so the UI reviews fully populated.

## Scope & assumptions

- **Backend**: enable Lovable Cloud for a `products` table + seed data (the "database I will populate later" requirement). Wishlist / compare / cart / recently-viewed / newsletter stay client-side for now (localStorage) — call out if you'd rather have accounts.
- **No auth yet**. "MY ACCOUNT" link renders a placeholder page. Add later if you want real logins.
- **Cart** is a UI-only running subtotal that routes out to the retailer (as you described). No checkout.
- **Search autocomplete** queries the products table live.
- **Logo**: I'll render the hexagon + magnifier + package mark as an inline SVG component in navy/gold so it works on both backgrounds without an image round-trip.
- **Fonts**: Inter via `<link>` in the root head.

## Design system (src/styles.css)

Semantic tokens only — no hardcoded colors in components.

```text
--navy: #0D1B3E          → --primary / header bg
--gold: #F5A623          → --accent / CTA
--surface: #F7F8FA       → --muted
--card: #FFFFFF
--foreground: navy
```

Map to shadcn tokens via `@theme inline` so `bg-primary`, `text-accent`, `bg-muted`, etc. all follow the palette. Custom variants: `Button variant="gold"`, `Badge variant="gold"`.

## Data layer

Lovable Cloud table `products`:
```text
id, title, category, subcategory, price, original_price,
image_url, rating, review_count, source_retailer, source_url,
description, created_at
```
- Public read policy (anon SELECT), no writes from client.
- Migration seeds ~40–60 realistic rows spread across all 5 categories & their subcategories, with placeholder image URLs (Unsplash) so the UI is fully populated.
- Query helpers in `src/lib/products.ts` (list, byCategory, bySubcategory, byId, search, featured, trending).

## Global state (Zustand + localStorage)

- `useWishlist` — add/remove/has/count
- `useCompare` — max 4 items
- `useCart` — items + subtotal
- `useRecentlyViewed` — last 8
Header badges subscribe to these stores so counts update live.

## Route map (TanStack Router)

```text
/                        Home
/shop                    All products
/category/$category      Category listing
/category/$category/$sub Subcategory listing
/product/$id             Product detail
/search                  Search results (?q=, ?category=)
/wishlist                Wishlist
/compare                 Side-by-side compare table
/cart                    Cart
/about
/contact
/faqs
/account                 Placeholder
```

Each route gets its own `head()` with unique title + description + og.

## Component structure

```text
src/components/
  layout/
    Header.tsx           (3-tier sticky header)
    UtilityBar.tsx       (tier 1)
    MainHeader.tsx       (tier 2 — logo, search, icons)
    CategoryNav.tsx      (tier 3 — mega menu)
    Footer.tsx
    MobileMenu.tsx
  brand/
    Logo.tsx             (inline SVG hex+magnifier+package)
  product/
    ProductCard.tsx
    ProductGrid.tsx
    ProductCardSkeleton.tsx
    RatingStars.tsx
    PriceTag.tsx
  home/
    Hero.tsx             (4-step value prop, hex pattern bg)
    CategoryShowcase.tsx (horizontal scroll row per category)
    FeaturedGrid.tsx
    Newsletter.tsx
  filters/
    FilterSidebar.tsx
    SortDropdown.tsx
  compare/
    CompareTable.tsx
  ui/                    (shadcn as-is)
src/lib/
  products.ts            (data layer)
  categories.ts          (5-category tree + icons)
  stores/                (zustand: wishlist, compare, cart, recent)
```

## Header behavior

- Tier 1 collapses on scroll (sticky tiers 2+3 remain). Mobile: tier 1 hidden, hamburger opens a sheet with utility links + full category tree.
- Search bar: input + category dropdown + gold square search button. Autocomplete popover shows top 6 matches with thumbnail/title/price; Enter navigates to `/search?q=`.
- Wishlist/compare/cart icons show gold badges with live counts; cart shows running `$0.00` subtotal.
- "BROWSE CATEGORIES" opens a mega-menu panel (5 columns of subcategories).

## Product card

Locked-aspect image, top-corner wishlist heart + compare checkbox (matching header icons), 2-line title clamp, star rating + review count, price with strikethrough + % off badge, retailer badge, "Add to Compare" + "View Deal" (gold) buttons.

## Category / search pages

Left filter sidebar (price range slider, rating, subcategory checkboxes, retailer), top sort dropdown, responsive 4/2/1 grid, skeleton loaders while querying.

## Product detail

Gallery (main + thumbnails from image_url — duplicated for now since seed has one image), title, rating, price, retailer, gold "Go to Store" CTA linking to `source_url`, price-comparison table (mock: same product across 2–3 retailers derived from seed variants), description/specs, related-products carousel, appends to recently-viewed.

## Compare page

Sticky-header side-by-side table: image row, title, price, rating, retailer, key specs. Remove buttons per column. Empty state links back to shop.

## Deliverables in this build

1. Enable Lovable Cloud + `products` migration with seeded rows.
2. Design tokens in `src/styles.css` + Inter font.
3. Logo SVG + 3-tier header + footer + mobile menu.
4. All 13 routes with unique metadata.
5. All components listed above.
6. Zustand stores wired to header badges.
7. Sitemap.xml + robots.txt covering static routes.

I'll implement straight through after you approve. Reply with any tweaks (e.g., "skip cart", "use different fonts", "add auth") and I'll adjust before starting.
