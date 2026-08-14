-- Add missing columns to products table for SEO and inventory management
-- This migration adds columns needed for the optimized product import

ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS meta_title TEXT,
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS short_description TEXT,
ADD COLUMN IF NOT EXISTS long_description TEXT,
ADD COLUMN IF NOT EXISTS sold_count INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS stock_count INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS viewer_count INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS attributes JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'published',
ADD COLUMN IF NOT EXISTS slug TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS low_stock_threshold INTEGER NOT NULL DEFAULT 5,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
ADD COLUMN IF NOT EXISTS brand TEXT,
ADD COLUMN IF NOT EXISTS sku TEXT,
ADD COLUMN IF NOT EXISTS image_alt TEXT,
ADD COLUMN IF NOT EXISTS canonical_url TEXT,
ADD COLUMN IF NOT EXISTS focus_keyword TEXT,
ADD COLUMN IF NOT EXISTS pokemon JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS related_keywords TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS cost_price NUMERIC(10,2);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS products_status_idx ON public.products (status);
CREATE INDEX IF NOT EXISTS products_slug_idx ON public.products (slug);
CREATE INDEX IF NOT EXISTS products_stock_count_idx ON public.products (stock_count);

-- Add comment
COMMENT ON COLUMN public.products.status IS 'Product status: published, draft, archived';
COMMENT ON COLUMN public.products.slug IS 'URL-friendly identifier for SEO';
COMMENT ON COLUMN public.products.tags IS 'Searchable tags for product discovery';
COMMENT ON COLUMN public.products.low_stock_threshold IS 'Stock level that triggers low stock alert';
