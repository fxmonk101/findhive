-- ============ ROLES ============
CREATE TYPE public.app_role AS ENUM ('super_admin','admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id)
$$;

CREATE POLICY "Users can read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Super admins manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'super_admin'))
  WITH CHECK (public.has_role(auth.uid(),'super_admin'));

-- ============ SHARED TIMESTAMP TRIGGER ============
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- ============ PRODUCTS ============
ALTER TABLE public.products
  ADD COLUMN status text NOT NULL DEFAULT 'published',
  ADD COLUMN sku text,
  ADD COLUMN brand text,
  ADD COLUMN slug text,
  ADD COLUMN tags text[] NOT NULL DEFAULT '{}',
  ADD COLUMN cost_price numeric,
  ADD COLUMN low_stock_threshold integer NOT NULL DEFAULT 5,
  ADD COLUMN focus_keyword text,
  ADD COLUMN related_keywords text[] NOT NULL DEFAULT '{}',
  ADD COLUMN canonical_url text,
  ADD COLUMN image_alt text,
  ADD COLUMN pokemon jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();

ALTER TABLE public.products
  ADD CONSTRAINT products_status_check CHECK (status IN ('draft','published','archived'));

CREATE UNIQUE INDEX products_slug_key ON public.products (slug) WHERE slug IS NOT NULL;
CREATE INDEX products_status_idx ON public.products (status);
CREATE INDEX IF NOT EXISTS products_cat_sub_idx ON public.products (category, subcategory);

CREATE TRIGGER products_set_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

GRANT INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;

DROP POLICY IF EXISTS "Products are publicly readable" ON public.products;
CREATE POLICY "Published products are publicly readable" ON public.products
  FOR SELECT USING (status = 'published' OR public.is_admin(auth.uid()));
CREATE POLICY "Admins manage products" ON public.products
  FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- ============ PRODUCT IMAGES ============
CREATE TABLE public.product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  url text NOT NULL,
  alt_text text,
  title text,
  caption text,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX product_images_product_idx ON public.product_images (product_id, position);
GRANT SELECT ON public.product_images TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_images TO authenticated;
GRANT ALL ON public.product_images TO service_role;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Product images are publicly readable" ON public.product_images FOR SELECT USING (true);
CREATE POLICY "Admins manage product images" ON public.product_images
  FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE TRIGGER product_images_set_updated_at BEFORE UPDATE ON public.product_images
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- keep products.images (jsonb array of urls) in sync for the storefront gallery
CREATE OR REPLACE FUNCTION public.sync_product_images()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE pid uuid;
BEGIN
  pid := COALESCE(NEW.product_id, OLD.product_id);
  UPDATE public.products p
     SET images = COALESCE((
       SELECT jsonb_agg(pi.url ORDER BY pi.position, pi.created_at)
       FROM public.product_images pi WHERE pi.product_id = pid
     ), '[]'::jsonb)
   WHERE p.id = pid;
  RETURN NULL;
END; $$;
CREATE TRIGGER product_images_sync AFTER INSERT OR UPDATE OR DELETE ON public.product_images
  FOR EACH ROW EXECUTE FUNCTION public.sync_product_images();

-- ============ CATEGORIES ============
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid REFERENCES public.categories(id) ON DELETE CASCADE,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  image_url text,
  meta_title text,
  meta_description text,
  position integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are publicly readable" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins manage categories" ON public.categories
  FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE TRIGGER categories_set_updated_at BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.categories (slug, name, position) VALUES
  ('trading-cards','Trading Cards',1),
  ('watches','Watches',2),
  ('jewelry','Jewelry & Bangles',3),
  ('outdoor-fitness','Outdoor & Fitness',4);

INSERT INTO public.categories (parent_id, slug, name, position)
SELECT c.id, v.slug, v.name, v.position FROM public.categories c
JOIN (VALUES
  ('trading-cards','pokemon-tcg','Pokémon TCG',1),
  ('trading-cards','nba-cards','NBA Trading Cards',2),
  ('trading-cards','nfl-cards','NFL Trading Cards',3),
  ('watches','mens-watches','Men''s Watches',1),
  ('watches','womens-watches','Women''s Watches',2),
  ('jewelry','bangles-bracelets','Bangles & Bracelets',1),
  ('jewelry','necklaces','Necklaces & Pendants',2),
  ('jewelry','rings','Rings',3),
  ('jewelry','earrings','Earrings',4),
  ('outdoor-fitness','camping-hiking','Camping & Hiking',1),
  ('outdoor-fitness','fitness-equipment','Fitness Equipment',2)
) AS v(parent, slug, name, position) ON v.parent = c.slug;

-- ============ REVIEWS ============
ALTER TABLE public.product_reviews
  ADD COLUMN status text NOT NULL DEFAULT 'pending',
  ADD COLUMN featured boolean NOT NULL DEFAULT false,
  ADD COLUMN review_type text NOT NULL DEFAULT 'product';
ALTER TABLE public.product_reviews
  ADD CONSTRAINT product_reviews_status_check CHECK (status IN ('pending','approved','rejected'));
UPDATE public.product_reviews SET status = 'approved';
CREATE INDEX product_reviews_status_idx ON public.product_reviews (status);

GRANT UPDATE, DELETE ON public.product_reviews TO authenticated;
GRANT ALL ON public.product_reviews TO service_role;
DROP POLICY IF EXISTS "Reviews are publicly readable" ON public.product_reviews;
CREATE POLICY "Approved reviews are publicly readable" ON public.product_reviews
  FOR SELECT USING (status = 'approved' OR public.is_admin(auth.uid()));
CREATE POLICY "Admins manage reviews" ON public.product_reviews
  FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- ============ CUSTOMERS ============
CREATE TABLE public.customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  email text NOT NULL UNIQUE,
  full_name text,
  phone text,
  billing_address jsonb NOT NULL DEFAULT '{}'::jsonb,
  shipping_address jsonb NOT NULL DEFAULT '{}'::jsonb,
  notes text,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.customers TO authenticated;
GRANT ALL ON public.customers TO service_role;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage customers" ON public.customers
  FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE TRIGGER customers_set_updated_at BEFORE UPDATE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ ORDERS ============
CREATE SEQUENCE public.order_number_seq START 1001;

CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text NOT NULL UNIQUE DEFAULT ('FH-' || nextval('public.order_number_seq')),
  customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL,
  customer_email text NOT NULL,
  customer_name text,
  customer_phone text,
  billing_address jsonb NOT NULL DEFAULT '{}'::jsonb,
  shipping_address jsonb NOT NULL DEFAULT '{}'::jsonb,
  subtotal numeric NOT NULL DEFAULT 0,
  discount_total numeric NOT NULL DEFAULT 0,
  shipping_total numeric NOT NULL DEFAULT 0,
  tax_total numeric NOT NULL DEFAULT 0,
  total numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  status text NOT NULL DEFAULT 'pending',
  payment_status text NOT NULL DEFAULT 'unpaid',
  payment_method text,
  transaction_reference text,
  shipping_method text,
  shipping_status text NOT NULL DEFAULT 'unfulfilled',
  tracking_number text,
  internal_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.orders ADD CONSTRAINT orders_status_check
  CHECK (status IN ('pending','processing','packing','shipped','completed','cancelled','refunded'));
ALTER TABLE public.orders ADD CONSTRAINT orders_payment_status_check
  CHECK (payment_status IN ('unpaid','awaiting','paid','failed','refunded','partially_refunded'));
CREATE INDEX orders_status_idx ON public.orders (status);
CREATE INDEX orders_created_idx ON public.orders (created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage orders" ON public.orders
  FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE TRIGGER orders_set_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  title text NOT NULL,
  sku text,
  image_url text,
  unit_price numeric NOT NULL DEFAULT 0,
  quantity integer NOT NULL DEFAULT 1,
  discount numeric NOT NULL DEFAULT 0,
  line_total numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX order_items_order_idx ON public.order_items (order_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.order_items TO authenticated;
GRANT ALL ON public.order_items TO service_role;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage order items" ON public.order_items
  FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

CREATE TABLE public.order_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  previous_status text,
  new_status text NOT NULL,
  changed_by uuid,
  changed_by_email text,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX order_status_history_order_idx ON public.order_status_history (order_id, created_at DESC);
GRANT SELECT, INSERT ON public.order_status_history TO authenticated;
GRANT ALL ON public.order_status_history TO service_role;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read order history" ON public.order_status_history
  FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins write order history" ON public.order_status_history
  FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));

-- ============ INVENTORY LOG ============
CREATE TABLE public.inventory_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  previous_stock integer,
  new_stock integer NOT NULL,
  change integer NOT NULL DEFAULT 0,
  reason text,
  changed_by uuid,
  changed_by_email text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX inventory_logs_product_idx ON public.inventory_logs (product_id, created_at DESC);
GRANT SELECT, INSERT ON public.inventory_logs TO authenticated;
GRANT ALL ON public.inventory_logs TO service_role;
ALTER TABLE public.inventory_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read inventory logs" ON public.inventory_logs
  FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins write inventory logs" ON public.inventory_logs
  FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));

-- ============ PROMOTIONS ============
CREATE TABLE public.promotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  description text,
  discount_type text NOT NULL DEFAULT 'percentage',
  discount_value numeric NOT NULL DEFAULT 0,
  applies_to text NOT NULL DEFAULT 'order',
  target_category text,
  target_product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  min_order_total numeric,
  usage_limit integer,
  usage_count integer NOT NULL DEFAULT 0,
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.promotions ADD CONSTRAINT promotions_type_check
  CHECK (discount_type IN ('percentage','fixed'));
GRANT SELECT ON public.promotions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.promotions TO authenticated;
GRANT ALL ON public.promotions TO service_role;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active promotions are publicly readable" ON public.promotions
  FOR SELECT USING (is_active = true OR public.is_admin(auth.uid()));
CREATE POLICY "Admins manage promotions" ON public.promotions
  FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE TRIGGER promotions_set_updated_at BEFORE UPDATE ON public.promotions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ BLOG ============
CREATE TABLE public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  excerpt text,
  content text,
  featured_image text,
  author text,
  category text,
  tags text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'draft',
  meta_title text,
  meta_description text,
  focus_keyword text,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.blog_posts ADD CONSTRAINT blog_posts_status_check
  CHECK (status IN ('draft','scheduled','published','archived'));
GRANT SELECT ON public.blog_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
GRANT ALL ON public.blog_posts TO service_role;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published posts are publicly readable" ON public.blog_posts
  FOR SELECT USING ((status = 'published' AND (published_at IS NULL OR published_at <= now())) OR public.is_admin(auth.uid()));
CREATE POLICY "Admins manage posts" ON public.blog_posts
  FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE TRIGGER blog_posts_set_updated_at BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ MEDIA ============
CREATE TABLE public.media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket text NOT NULL DEFAULT 'product-images',
  path text NOT NULL,
  url text NOT NULL,
  file_name text,
  mime_type text,
  size_bytes bigint,
  width integer,
  height integer,
  alt_text text,
  folder text,
  uploaded_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX media_bucket_path_key ON public.media (bucket, path);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.media TO authenticated;
GRANT ALL ON public.media TO service_role;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage media" ON public.media
  FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE TRIGGER media_set_updated_at BEFORE UPDATE ON public.media
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ NOTIFICATIONS ============
CREATE TABLE public.admin_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  title text NOT NULL,
  body text,
  link text,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX admin_notifications_created_idx ON public.admin_notifications (created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_notifications TO authenticated;
GRANT ALL ON public.admin_notifications TO service_role;
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage notifications" ON public.admin_notifications
  FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- ============ AUDIT LOG ============
CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid,
  admin_email text,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text,
  previous_value jsonb,
  new_value jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX audit_logs_created_idx ON public.audit_logs (created_at DESC);
GRANT SELECT, INSERT ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read audit logs" ON public.audit_logs
  FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins write audit logs" ON public.audit_logs
  FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));

-- ============ SETTINGS ============
CREATE TABLE public.store_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.store_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.store_settings TO authenticated;
GRANT ALL ON public.store_settings TO service_role;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Settings are publicly readable" ON public.store_settings FOR SELECT USING (true);
CREATE POLICY "Admins manage settings" ON public.store_settings
  FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE TRIGGER store_settings_set_updated_at BEFORE UPDATE ON public.store_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.store_settings (key, value) VALUES
  ('store', '{"name":"findhive","email":"support@findhive.com","phone":"","currency":"USD","timezone":"UTC","free_shipping_threshold":150}'::jsonb),
  ('seo', '{"global_title":"findhive — trending products, restocked and shipped by us","global_description":"Shop trending trading cards, watches, jewelry and fitness gear shipped directly from our own warehouse.","robots":"index, follow","sitemap_enabled":true}'::jsonb),
  ('shipping', '{"methods":[{"name":"Standard","rate":9.99,"eta":"3-7 business days"},{"name":"Express","rate":24.99,"eta":"1-3 business days"}],"free_threshold":150}'::jsonb),
  ('payments', '{"methods":["secure_card_link","bank_transfer","cash_app","zelle"]}'::jsonb),
  ('email', '{"order_confirmation":true,"shipping_notification":true,"from_name":"findhive"}'::jsonb);