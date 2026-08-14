-- Run this in Supabase SQL Editor to add products
-- This bypasses RLS since it runs as the database owner

-- First, let's check current products
SELECT COUNT(*) as current_product_count FROM products;

-- Sample product insert (modify as needed)
INSERT INTO products (
  id,
  title,
  category,
  subcategory,
  price,
  original_price,
  image_url,
  rating,
  review_count,
  source_retailer,
  source_url,
  description,
  created_at,
  meta_title,
  meta_description,
  short_description,
  long_description,
  sold_count,
  stock_count,
  viewer_count,
  images,
  attributes,
  status,
  slug,
  tags,
  low_stock_threshold,
  updated_at
) VALUES (
  gen_random_uuid(),
  'Pokemon TCG: Detective Pikachu Mewtwo-Gx Case File',
  'trading-cards',
  'pokemon-tcg',
  89.99,
  NULL,
  'https://m.media-amazon.com/images/I/71+Id3NVcyL._AC_UL960_FMwebp_QL65_.jpg',
  4.7,
  1100,
  'Amazon',
  'https://www.amazon.com',
  'Pokemon TCG: Detective Pikachu Mewtwo-Gx Case File + 6 Booster Pack + A Foil Promo Gx Card',
  NOW(),
  'Pokemon TCG: Detective Pikachu Mewtwo-Gx Case File',
  'Buy Pokemon TCG: Detective Pikachu Mewtwo-Gx Case File at FindHive',
  'Pokemon TCG: Detective Pikachu Mewtwo-Gx Case File + 6 Booster Pack',
  'Pokemon TCG: Detective Pikachu Mewtwo-Gx Case File + 6 Booster Pack + A Foil Promo Gx Card + A Oversize Gx Foil Card',
  0,
  25,
  500,
  '["https://m.media-amazon.com/images/I/71+Id3NVcyL._AC_UL960_FMwebp_QL65_.jpg"]',
  '{}',
  'published',
  'pokemon-tcg-detective-pikachu-mewtwo-gx-case-file',
  ARRAY['pokemon', 'trading-cards', 'tcg', 'mewtwo'],
  5,
  NOW()
);

-- Add more products following the same pattern
-- You can generate these programmatically or use the Excel data

-- After adding products, verify count
SELECT COUNT(*) as new_product_count FROM products;
