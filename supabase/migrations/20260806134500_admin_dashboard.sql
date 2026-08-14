-- Add admin backend tables, admin role checks, and non-destructive product metadata.

CREATE TYPE IF NOT EXISTS public.product_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE IF NOT EXISTS public.stock_status AS ENUM ('in_stock', 'low_stock', 'out_of_stock');
CREATE TYPE IF NOT EXISTS public.order_status AS ENUM ('pending', 'processing', 'packing', 'shipped', 'completed', 'cancelled', 'refunded');
CREATE TYPE IF NOT EXISTS public.payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded', 'authorized');
CREATE TYPE IF NOT EXISTS public.notification_type AS ENUM ('new_order', 'low_stock', 'out_of_stock', 'new_customer', 'new_review', 'payment_issue');

CREATE TABLE IF NOT EXISTS public.admin_profiles (
  user_id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'admin',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.categories (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  image_url text,
  seo_title text,
  meta_description text,
  canonical_url text,
  subcategories jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.tags (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.product_tags (
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, tag_id)
);

CREATE TABLE IF NOT EXISTS public.product_images (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  url text NOT NULL,
  alt_text text,
  title text,
  caption text,
  is_main boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.customers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  email text NOT NULL,
  first_name text,
  last_name text,
  phone text,
  billing_address jsonb,
  shipping_address jsonb,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.orders (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number text NOT NULL UNIQUE,
  customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL,
  products jsonb NOT NULL DEFAULT '[]'::jsonb,
  subtotal numeric(12,2) NOT NULL DEFAULT 0,
  shipping numeric(12,2) NOT NULL DEFAULT 0,
  taxes numeric(12,2) NOT NULL DEFAULT 0,
  discounts numeric(12,2) NOT NULL DEFAULT 0,
  total numeric(12,2) NOT NULL DEFAULT 0,
  payment_method text,
  payment_status public.payment_status NOT NULL DEFAULT 'pending',
  transaction_reference text,
  shipping_method text,
  tracking_number text,
  order_status public.order_status NOT NULL DEFAULT 'pending',
  shipping_status text,
  internal_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.order_status_history (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  previous_status public.order_status NOT NULL,
  next_status public.order_status NOT NULL,
  changed_by uuid REFERENCES auth.users(id),
  note text,
  changed_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.payments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  method text,
  status public.payment_status NOT NULL DEFAULT 'pending',
  amount numeric(12,2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  provider_reference text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title text,
  body text,
  status text NOT NULL DEFAULT 'pending',
  is_featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.promotions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  type text NOT NULL,
  discount_amount numeric(12,2),
  discount_percent numeric(5,2),
  applies_to_products jsonb NOT NULL DEFAULT '[]'::jsonb,
  applies_to_categories jsonb NOT NULL DEFAULT '[]'::jsonb,
  start_date timestamptz,
  end_date timestamptz,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.coupons (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code text NOT NULL UNIQUE,
  description text,
  discount_amount numeric(12,2),
  discount_percent numeric(5,2),
  usage_limit integer,
  used_count integer NOT NULL DEFAULT 0,
  starts_at timestamptz,
  expires_at timestamptz,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text,
  body text,
  author text,
  category text,
  tags text[] DEFAULT ARRAY[]::text[],
  featured_image text,
  seo_title text,
  meta_description text,
  focus_keyword text,
  is_published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.seo_metadata (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_type text NOT NULL,
  entity_id uuid,
  title text,
  description text,
  focus_keyword text,
  related_keywords text[] DEFAULT ARRAY[]::text[],
  canonical_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.media_library (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bucket text NOT NULL,
  path text NOT NULL,
  url text NOT NULL,
  alt_text text,
  title text,
  caption text,
  uploaded_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type public.notification_type NOT NULL,
  title text NOT NULL,
  body text,
  is_read boolean NOT NULL DEFAULT false,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user uuid REFERENCES auth.users(id),
  action text NOT NULL,
  object_type text NOT NULL,
  object_id uuid,
  previous_value jsonb,
  new_value jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.store_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_name text NOT NULL DEFAULT 'findhive',
  logo_url text,
  contact_email text,
  contact_phone text,
  currency text NOT NULL DEFAULT 'USD',
  timezone text NOT NULL DEFAULT 'America/New_York',
  homepage_title text,
  homepage_meta_description text,
  robots_text text,
  sitemap_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Augment products with admin-friendly metadata and SEO fields.
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS sku text,
  ADD COLUMN IF NOT EXISTS brand text,
  ADD COLUMN IF NOT EXISTS tags text[] DEFAULT ARRAY[]::text[],
  ADD COLUMN IF NOT EXISTS status public.product_status NOT NULL DEFAULT 'published',
  ADD COLUMN IF NOT EXISTS is_archived boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS published_at timestamptz,
  ADD COLUMN IF NOT EXISTS cost_price numeric(10,2),
  ADD COLUMN IF NOT EXISTS currency text NOT NULL DEFAULT 'USD',
  ADD COLUMN IF NOT EXISTS seo_slug text,
  ADD COLUMN IF NOT EXISTS focus_keyword text,
  ADD COLUMN IF NOT EXISTS related_keywords text[] DEFAULT ARRAY[]::text[],
  ADD COLUMN IF NOT EXISTS canonical_url text,
  ADD COLUMN IF NOT EXISTS image_alt text,
  ADD COLUMN IF NOT EXISTS low_stock_threshold integer NOT NULL DEFAULT 10,
  ADD COLUMN IF NOT EXISTS stock_status public.stock_status NOT NULL DEFAULT 'in_stock',
  ADD COLUMN IF NOT EXISTS pokemon_data jsonb NOT NULL DEFAULT '{}'::jsonb;

UPDATE public.products
SET stock_status = CASE
  WHEN stock_count <= 0 THEN 'out_of_stock'
  WHEN stock_count < low_stock_threshold THEN 'low_stock'
  ELSE 'in_stock'
END;

-- Admin access helper.
CREATE OR REPLACE FUNCTION public.is_admin() RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_profiles
    WHERE user_id = auth.uid() AND is_active = true
  );
$$ LANGUAGE sql STABLE;

-- Enable RLS and protect admin tables.
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin profiles select own profile" ON public.admin_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admin profiles manage profiles" ON public.admin_profiles FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admin profiles update own profile" ON public.admin_profiles FOR UPDATE USING (auth.uid() = user_id OR is_admin()) WITH CHECK (auth.uid() = user_id OR is_admin());
CREATE POLICY "Admin profiles delete" ON public.admin_profiles FOR DELETE USING (is_admin());

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage categories" ON public.categories FOR ALL USING (is_admin()) WITH CHECK (is_admin());

ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage tags" ON public.tags FOR ALL USING (is_admin()) WITH CHECK (is_admin());

ALTER TABLE public.product_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage product tags" ON public.product_tags FOR ALL USING (is_admin()) WITH CHECK (is_admin());

ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage product images" ON public.product_images FOR ALL USING (is_admin()) WITH CHECK (is_admin());

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage customers" ON public.customers FOR ALL USING (is_admin()) WITH CHECK (is_admin());

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage orders" ON public.orders FOR ALL USING (is_admin()) WITH CHECK (is_admin());

ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage order history" ON public.order_status_history FOR ALL USING (is_admin()) WITH CHECK (is_admin());

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage payments" ON public.payments FOR ALL USING (is_admin()) WITH CHECK (is_admin());

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage reviews" ON public.reviews FOR ALL USING (is_admin()) WITH CHECK (is_admin());

ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage promotions" ON public.promotions FOR ALL USING (is_admin()) WITH CHECK (is_admin());

ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage coupons" ON public.coupons FOR ALL USING (is_admin()) WITH CHECK (is_admin());

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage blog posts" ON public.blog_posts FOR ALL USING (is_admin()) WITH CHECK (is_admin());

ALTER TABLE public.seo_metadata ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage SEO metadata" ON public.seo_metadata FOR ALL USING (is_admin()) WITH CHECK (is_admin());

ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage media" ON public.media_library FOR ALL USING (is_admin()) WITH CHECK (is_admin());

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage notifications" ON public.notifications FOR ALL USING (is_admin()) WITH CHECK (is_admin());

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage audit logs" ON public.audit_logs FOR ALL USING (is_admin()) WITH CHECK (is_admin());

ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage store settings" ON public.store_settings FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Product administration policies.
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can insert products" ON public.products FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can update products" ON public.products FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins can delete products" ON public.products FOR DELETE USING (is_admin());

-- Category seed data for FindHive without Bags.
INSERT INTO public.categories (slug, name, description, seo_title, meta_description, subcategories, is_active, sort_order)
VALUES
  ('trading-cards', 'Trading Cards', 'Trading cards and accessories from Pokémon, NBA, NFL, and more.', 'Trading Cards | FindHive', 'Find trading cards, hobby boxes, and card accessories from our curated collection.',
    '[{"slug":"pokemon-tcg","name":"Pokémon TCG"},{"slug":"nba-cards","name":"NBA Trading Cards"},{"slug":"nfl-cards","name":"NFL Trading Cards"},{"slug":"card-accessories","name":"Card Accessories"}]', true, 10),
  ('watches', 'Watches', 'Curated watches and accessories from top brands.', 'Watches | FindHive', 'Explore men and women’s watches, accessories, and premium timepieces.',
    '[{"slug":"mens-watches","name":"Men\'s Watches"},{"slug":"womens-watches","name":"Women\'s Watches"},{"slug":"watch-accessories","name":"Watch Accessories"}]', true, 20),
  ('jewelry', 'Jewelry & Bangles', 'Jewelry, necklaces, bracelets, and rings curated for collectors.', 'Jewelry | FindHive', 'Discover on-trend jewelry, rings, earrings and bracelets from FindHive.',
    '[{"slug":"bangles-bracelets","name":"Bangles & Bracelets"},{"slug":"necklaces","name":"Necklaces & Pendants"},{"slug":"rings","name":"Rings"},{"slug":"earrings","name":"Earrings"}]', true, 30),
  ('outdoor-fitness', 'Outdoor & Fitness', 'Outdoor gear, fitness machines, camping, and cycling equipment.', 'Outdoor & Fitness | FindHive', 'Shop outdoor adventure and fitness products from our warehouse collection.',
    '[{"slug":"camping-hiking","name":"Camping & Hiking"},{"slug":"fitness-equipment","name":"Fitness Equipment"},{"slug":"vibration-plates","name":"Vibration Plate Machines"},{"slug":"cycling","name":"Cycling Gear"},{"slug":"sports-recreation","name":"Sports & Recreation"}]', true, 40)
ON CONFLICT (slug) DO NOTHING;
