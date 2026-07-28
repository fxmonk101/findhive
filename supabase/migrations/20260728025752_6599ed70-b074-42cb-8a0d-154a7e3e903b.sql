
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS meta_title text,
  ADD COLUMN IF NOT EXISTS meta_description text,
  ADD COLUMN IF NOT EXISTS short_description text,
  ADD COLUMN IF NOT EXISTS long_description text,
  ADD COLUMN IF NOT EXISTS sold_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS stock_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS viewer_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS images jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS attributes jsonb NOT NULL DEFAULT '{}'::jsonb;

-- Backfill long_description from existing description where empty
UPDATE public.products
SET long_description = description
WHERE long_description IS NULL AND description IS NOT NULL;

-- Backfill images array with the primary image
UPDATE public.products
SET images = jsonb_build_array(image_url)
WHERE jsonb_array_length(images) = 0 AND image_url IS NOT NULL;

-- Populate meta_title / short_description with safe defaults
UPDATE public.products
SET meta_title = COALESCE(meta_title, LEFT(title || ' | findhive', 60)),
    short_description = COALESCE(
      short_description,
      LEFT(regexp_replace(COALESCE(description, title), E'\\s+', ' ', 'g'), 160)
    ),
    meta_description = COALESCE(
      meta_description,
      LEFT(regexp_replace(COALESCE(description, title), E'\\s+', ' ', 'g'), 160)
    );

-- Realistic randomized social-proof numbers (higher for cards and watches)
UPDATE public.products
SET sold_count = CASE
      WHEN category IN ('trading-cards','watches') THEN 60 + (floor(random() * 340))::int
      ELSE 20 + (floor(random() * 200))::int
    END,
    stock_count = 3 + (floor(random() * 38))::int,
    viewer_count = CASE
      WHEN category IN ('trading-cards','watches') THEN 8 + (floor(random() * 28))::int
      ELSE 4 + (floor(random() * 18))::int
    END
WHERE sold_count = 0 OR stock_count = 0 OR viewer_count = 0;
