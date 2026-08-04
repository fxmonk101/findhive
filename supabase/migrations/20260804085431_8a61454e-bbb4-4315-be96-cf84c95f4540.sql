-- 1. Remove duplicate products (keep oldest per title)
DELETE FROM public.products p
USING public.products q
WHERE lower(p.title) = lower(q.title)
  AND (p.created_at, p.id) > (q.created_at, q.id);

-- 2. Fix mis-categorised jewelry items
UPDATE public.products SET subcategory = 'necklaces'
WHERE category='jewelry' AND (title ILIKE '%necklace%' OR title ILIKE '%pendant%' OR title ILIKE '%chain%');
UPDATE public.products SET subcategory = 'earrings'
WHERE category='jewelry' AND (title ILIKE '%earring%' OR title ILIKE '%stud%' OR title ILIKE '%hoop%');
UPDATE public.products SET subcategory = 'rings'
WHERE category='jewelry' AND (title ILIKE '% ring%' OR title ILIKE 'ring %');

-- 3. Card accessories out of pokemon/nba/nfl buckets
UPDATE public.products SET subcategory = 'card-accessories'
WHERE category='trading-cards' AND (title ILIKE '%toploader%' OR title ILIKE '%sleeve%' OR title ILIKE '%binder%'
  OR title ILIKE '%storage box%' OR title ILIKE '%card case%' OR title ILIKE '%organizer%' OR title ILIKE '%holder%');

-- 4. Watch accessories
UPDATE public.products SET subcategory = 'watch-accessories'
WHERE category='watches' AND (title ILIKE '%watch band%' OR title ILIKE '%watch strap%' OR title ILIKE '%watch box%' OR title ILIKE '%winder%');

-- 5. Product reviews table
CREATE TABLE IF NOT EXISTS public.product_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title text NOT NULL,
  body text NOT NULL,
  verified_purchase boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS product_reviews_product_id_idx ON public.product_reviews(product_id);

GRANT SELECT, INSERT ON public.product_reviews TO anon;
GRANT SELECT, INSERT ON public.product_reviews TO authenticated;
GRANT ALL ON public.product_reviews TO service_role;

ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are publicly readable" ON public.product_reviews FOR SELECT USING (true);
CREATE POLICY "Anyone can submit a review" ON public.product_reviews FOR INSERT WITH CHECK (
  length(btrim(author_name)) BETWEEN 2 AND 60
  AND length(btrim(title)) BETWEEN 3 AND 100
  AND length(btrim(body)) BETWEEN 10 AND 2000
);