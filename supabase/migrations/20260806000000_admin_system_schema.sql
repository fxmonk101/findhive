-- FindHive Admin System Database Schema
-- This migration creates the complete database structure for the admin dashboard

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- USER ROLES AND PERMISSIONS
-- ============================================

-- Create user_roles enum
CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'warehouse_staff', 'content_manager');

-- Create admin_users table (extends auth.users)
CREATE TABLE public.admin_users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  role user_role NOT NULL DEFAULT 'admin',
  avatar_url TEXT,
  phone TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create permissions table
CREATE TABLE public.permissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  resource TEXT NOT NULL,
  action TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create role_permissions junction table
CREATE TABLE public.role_permissions (
  role user_role NOT NULL,
  permission_id UUID REFERENCES public.permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (role, permission_id)
);

-- ============================================
-- CATEGORIES (Excluding Bags)
-- ============================================

-- Update products table with additional fields
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS sku TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS barcode TEXT,
ADD COLUMN IF NOT EXISTS brand TEXT,
ADD COLUMN IF NOT EXISTS product_type TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT[],
ADD COLUMN IF NOT EXISTS cost_price NUMERIC(10,2),
ADD COLUMN IF NOT EXISTS discount_price NUMERIC(10,2),
ADD COLUMN IF NOT EXISTS tax_rate NUMERIC(5,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS weight NUMERIC(10,2),
ADD COLUMN IF NOT EXISTS dimensions TEXT,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS short_description TEXT,
ADD COLUMN IF NOT EXISTS specifications JSONB,
ADD COLUMN IF NOT EXISTS features TEXT[],
ADD COLUMN IF NOT EXISTS seo_title TEXT,
ADD COLUMN IF NOT EXISTS seo_description TEXT,
ADD COLUMN IF NOT EXISTS seo_keywords TEXT[],
ADD COLUMN IF NOT EXISTS url_slug TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  banner_url TEXT,
  parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create product_categories junction table
CREATE TABLE public.product_categories (
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (product_id, category_id)
);

-- ============================================
-- POKÉMON TCG SPECIFIC FIELDS
-- ============================================

-- Create pokemon_tcg_fields table
CREATE TABLE public.pokemon_tcg_fields (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE UNIQUE,
  set_name TEXT,
  card_number TEXT,
  language TEXT,
  rarity TEXT,
  condition TEXT,
  psa_grade TEXT,
  cgc_grade TEXT,
  bgs_grade TEXT,
  card_type TEXT,
  release_date DATE,
  expansion_name TEXT,
  collector_number TEXT,
  hp INTEGER,
  artist TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- PRODUCT IMAGES AND MEDIA
-- ============================================

-- Create product_images table
CREATE TABLE public.product_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create media_library table
CREATE TABLE public.media_library (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  alt_text TEXT,
  folder_path TEXT,
  metadata JSONB,
  uploaded_by UUID REFERENCES public.admin_users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- INVENTORY MANAGEMENT
-- ============================================

-- Create inventory table
CREATE TABLE public.inventory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE UNIQUE,
  quantity INTEGER NOT NULL DEFAULT 0,
  warehouse_location TEXT,
  minimum_stock_alert INTEGER NOT NULL DEFAULT 10,
  inventory_status TEXT NOT NULL DEFAULT 'in_stock', -- in_stock, low_stock, out_of_stock
  last_counted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create inventory_history table
CREATE TABLE public.inventory_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  inventory_id UUID REFERENCES public.inventory(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  quantity_change INTEGER NOT NULL,
  previous_quantity INTEGER NOT NULL,
  new_quantity INTEGER NOT NULL,
  adjustment_type TEXT NOT NULL, -- sale, restock, return, adjustment, damage
  reason TEXT,
  performed_by UUID REFERENCES public.admin_users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- WAREHOUSE MANAGEMENT
-- ============================================

-- Create warehouses table
CREATE TABLE public.warehouses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  address TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT NOT NULL DEFAULT 'USA',
  phone TEXT,
  email TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- CUSTOMERS
-- ============================================

-- Create customers table
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  date_of_birth DATE,
  avatar_url TEXT,
  customer_tags TEXT[],
  notes TEXT,
  lifetime_spending NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_orders INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(email)
);

-- Create customer_addresses table
CREATE TABLE public.customer_addresses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  address_type TEXT NOT NULL, -- billing, shipping
  first_name TEXT,
  last_name TEXT,
  company TEXT,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'USA',
  phone TEXT,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- ORDERS
-- ============================================

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, paid, processing, packing, shipped, delivered, cancelled, refunded
  payment_status TEXT NOT NULL DEFAULT 'pending', -- pending, paid, failed, refunded
  subtotal NUMERIC(10,2) NOT NULL,
  tax NUMERIC(10,2) NOT NULL DEFAULT 0,
  shipping NUMERIC(10,2) NOT NULL DEFAULT 0,
  discount NUMERIC(10,2) NOT NULL DEFAULT 0,
  total NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  payment_method TEXT,
  coupon_code TEXT,
  notes TEXT,
  internal_notes TEXT,
  shipping_address JSONB,
  billing_address JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create order_items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_sku TEXT,
  quantity INTEGER NOT NULL,
  unit_price NUMERIC(10,2) NOT NULL,
  total_price NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create order_status_history table
CREATE TABLE public.order_status_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  previous_status TEXT,
  notes TEXT,
  performed_by UUID REFERENCES public.admin_users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- SHIPPING
-- ============================================

-- Create shipments table
CREATE TABLE public.shipments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  tracking_number TEXT,
  carrier TEXT,
  shipping_method TEXT,
  shipping_cost NUMERIC(10,2) NOT NULL DEFAULT 0,
  estimated_delivery_date DATE,
  actual_delivery_date DATE,
  warehouse_id UUID REFERENCES public.warehouses(id),
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create shipping_zones table
CREATE TABLE public.shipping_zones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  countries TEXT[],
  states TEXT[],
  postal_codes TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create shipping_rates table
CREATE TABLE public.shipping_rates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  zone_id UUID REFERENCES public.shipping_zones(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  base_rate NUMERIC(10,2) NOT NULL,
  rate_per_weight NUMERIC(10,2) NOT NULL DEFAULT 0,
  free_shipping_threshold NUMERIC(10,2),
  estimated_days INTEGER,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- PAYMENTS
-- ============================================

-- Create payments table
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  payment_method TEXT NOT NULL, -- stripe, paypal, bank_transfer, etc.
  payment_status TEXT NOT NULL DEFAULT 'pending',
  transaction_id TEXT,
  payment_gateway_response JSONB,
  refunded_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  refund_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- REVIEWS
-- ============================================

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  is_verified_purchase BOOLEAN NOT NULL DEFAULT false,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  helpful_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- PROMOTIONS AND COUPONS
-- ============================================

-- Create coupons table
CREATE TABLE public.coupons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  discount_type TEXT NOT NULL, -- percentage, fixed_amount, free_shipping
  discount_value NUMERIC(10,2) NOT NULL,
  minimum_purchase NUMERIC(10,2),
  maximum_discount NUMERIC(10,2),
  usage_limit INTEGER,
  usage_count INTEGER NOT NULL DEFAULT 0,
  user_usage_limit INTEGER,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  applicable_products UUID[],
  applicable_categories UUID[],
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create promotions table
CREATE TABLE public.promotions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  promotion_type TEXT NOT NULL, -- flash_sale, bundle, featured, seasonal
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  discount_type TEXT NOT NULL,
  discount_value NUMERIC(10,2) NOT NULL,
  banner_image_url TEXT,
  banner_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create promotion_products junction table
CREATE TABLE public.promotion_products (
  promotion_id UUID REFERENCES public.promotions(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  discount_value NUMERIC(10,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (promotion_id, product_id)
);

-- ============================================
-- BLOG AND CONTENT
-- ============================================

-- Create blog_posts table
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT,
  excerpt TEXT,
  featured_image_url TEXT,
  author_id UUID REFERENCES public.admin_users(id),
  category TEXT,
  tags TEXT[],
  status TEXT NOT NULL DEFAULT 'draft', -- draft, published, scheduled
  published_at TIMESTAMPTZ,
  scheduled_at TIMESTAMPTZ,
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT[],
  is_featured BOOLEAN NOT NULL DEFAULT false,
  view_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create content_sections table
CREATE TABLE public.content_sections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_type TEXT NOT NULL, -- banner, promotion, featured, etc.
  title TEXT,
  content JSONB,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create faqs table
CREATE TABLE public.faqs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- SEO MANAGEMENT
-- ============================================

-- Create seo_metadata table
CREATE TABLE public.seo_metadata (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_path TEXT NOT NULL UNIQUE,
  title TEXT,
  description TEXT,
  keywords TEXT[],
  og_title TEXT,
  og_description TEXT,
  og_image_url TEXT,
  twitter_card_type TEXT,
  canonical_url TEXT,
  robots TEXT,
  structured_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create redirects table
CREATE TABLE public.redirects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  from_path TEXT NOT NULL UNIQUE,
  to_path TEXT NOT NULL,
  status_code INTEGER NOT NULL DEFAULT 301,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- SETTINGS
-- ============================================

-- Create settings table
CREATE TABLE public.settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB,
  description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- NOTIFICATIONS
-- ============================================

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.admin_users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- low_stock, new_order, payment_received, etc.
  title TEXT NOT NULL,
  message TEXT,
  data JSONB,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- ACTIVITY LOGS (AUDIT)
-- ============================================

-- Create activity_logs table
CREATE TABLE public.activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  previous_value JSONB,
  new_value JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- WISHLIST
-- ============================================

-- Create wishlist table
CREATE TABLE public.wishlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(customer_id, product_id)
);

-- ============================================
-- INDEXES
-- ============================================

-- Users and roles
CREATE INDEX admin_users_email_idx ON public.admin_users(email);
CREATE INDEX admin_users_role_idx ON public.admin_users(role);

-- Products
CREATE INDEX products_sku_idx ON public.products(sku);
CREATE INDEX products_brand_idx ON public.products(brand);
CREATE INDEX products_is_active_idx ON public.products(is_active);
CREATE INDEX products_is_featured_idx ON public.products(is_featured);
CREATE INDEX products_url_slug_idx ON public.products(url_slug);
CREATE INDEX products_created_at_idx ON public.products(created_at);

-- Categories
CREATE INDEX categories_slug_idx ON public.categories(slug);
CREATE INDEX categories_parent_id_idx ON public.categories(parent_id);
CREATE INDEX categories_is_active_idx ON public.categories(is_active);

-- Product categories
CREATE INDEX product_categories_product_id_idx ON public.product_categories(product_id);
CREATE INDEX product_categories_category_id_idx ON public.product_categories(category_id);

-- Pokemon TCG fields
CREATE INDEX pokemon_tcg_fields_product_id_idx ON public.pokemon_tcg_fields(product_id);
CREATE INDEX pokemon_tcg_fields_set_name_idx ON public.pokemon_tcg_fields(set_name);

-- Product images
CREATE INDEX product_images_product_id_idx ON public.product_images(product_id);

-- Media library
CREATE INDEX media_library_folder_path_idx ON public.media_library(folder_path);
CREATE INDEX media_library_file_type_idx ON public.media_library(file_type);

-- Inventory
CREATE INDEX inventory_product_id_idx ON public.inventory(product_id);
CREATE INDEX inventory_warehouse_location_idx ON public.inventory(warehouse_location);
CREATE INDEX inventory_history_product_id_idx ON public.inventory_history(product_id);
CREATE INDEX inventory_history_created_at_idx ON public.inventory_history(created_at);

-- Customers
CREATE INDEX customers_email_idx ON public.customers(email);
CREATE INDEX customers_user_id_idx ON public.customers(user_id);
CREATE INDEX customer_addresses_customer_id_idx ON public.customer_addresses(customer_id);

-- Orders
CREATE INDEX orders_customer_id_idx ON public.orders(customer_id);
CREATE INDEX orders_status_idx ON public.orders(status);
CREATE INDEX orders_payment_status_idx ON public.orders(payment_status);
CREATE INDEX orders_created_at_idx ON public.orders(created_at);
CREATE INDEX orders_order_number_idx ON public.orders(order_number);
CREATE INDEX order_items_order_id_idx ON public.order_items(order_id);
CREATE INDEX order_items_product_id_idx ON public.order_items(product_id);
CREATE INDEX order_status_history_order_id_idx ON public.order_status_history(order_id);

-- Shipments
CREATE INDEX shipments_order_id_idx ON public.shipments(order_id);
CREATE INDEX shipments_tracking_number_idx ON public.shipments(tracking_number);
CREATE INDEX shipments_warehouse_id_idx ON public.shipments(warehouse_id);

-- Payments
CREATE INDEX payments_order_id_idx ON public.payments(order_id);
CREATE INDEX payments_transaction_id_idx ON public.payments(transaction_id);

-- Reviews
CREATE INDEX reviews_product_id_idx ON public.reviews(product_id);
CREATE INDEX reviews_customer_id_idx ON public.reviews(customer_id);
CREATE INDEX reviews_is_approved_idx ON public.reviews(is_approved);
CREATE INDEX reviews_rating_idx ON public.reviews(rating);

-- Coupons and promotions
CREATE INDEX coupons_code_idx ON public.coupons(code);
CREATE INDEX coupons_is_active_idx ON public.coupons(is_active);
CREATE INDEX promotions_is_active_idx ON public.promotions(is_active);

-- Blog
CREATE INDEX blog_posts_slug_idx ON public.blog_posts(slug);
CREATE INDEX blog_posts_status_idx ON public.blog_posts(status);
CREATE INDEX blog_posts_author_id_idx ON public.blog_posts(author_id);

-- Content
CREATE INDEX content_sections_section_type_idx ON public.content_sections(section_type);
CREATE INDEX content_sections_is_active_idx ON public.content_sections(is_active);

-- SEO
CREATE INDEX seo_metadata_page_path_idx ON public.seo_metadata(page_path);

-- Notifications
CREATE INDEX notifications_user_id_idx ON public.notifications(user_id);
CREATE INDEX notifications_is_read_idx ON public.notifications(is_read);
CREATE INDEX notifications_created_at_idx ON public.notifications(created_at);

-- Activity logs
CREATE INDEX activity_logs_user_id_idx ON public.activity_logs(user_id);
CREATE INDEX activity_logs_resource_type_idx ON public.activity_logs(resource_type);
CREATE INDEX activity_logs_resource_id_idx ON public.activity_logs(resource_id);
CREATE INDEX activity_logs_created_at_idx ON public.activity_logs(created_at);

-- Wishlist
CREATE INDEX wishlist_customer_id_idx ON public.wishlist(customer_id);
CREATE INDEX wishlist_product_id_idx ON public.wishlist(product_id);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pokemon_tcg_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotion_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.redirects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;

-- Basic policies (these will be refined with proper role-based access)
CREATE POLICY "Admin users can read all data" ON public.admin_users FOR SELECT USING (true);
CREATE POLICY "Authenticated users can read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Authenticated users can read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Authenticated users can read product images" ON public.product_images FOR SELECT USING (true);
CREATE POLICY "Authenticated users can read reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated users can read blog posts" ON public.blog_posts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can read FAQs" ON public.faqs FOR SELECT USING (true);
CREATE POLICY "Authenticated users can read content sections" ON public.content_sections FOR SELECT USING (true);
CREATE POLICY "Authenticated users can read SEO metadata" ON public.seo_metadata FOR SELECT USING (true);

-- ============================================
-- INITIAL DATA
-- ============================================

-- Insert default permissions
INSERT INTO public.permissions (name, description, resource, action) VALUES
('manage_products', 'Can create, edit, and delete products', 'products', 'manage'),
('view_products', 'Can view products', 'products', 'view'),
('manage_categories', 'Can create, edit, and delete categories', 'categories', 'manage'),
('view_categories', 'Can view categories', 'categories', 'view'),
('manage_orders', 'Can create, edit, and delete orders', 'orders', 'manage'),
('view_orders', 'Can view orders', 'orders', 'view'),
('manage_customers', 'Can create, edit, and delete customers', 'customers', 'manage'),
('view_customers', 'Can view customers', 'customers', 'view'),
('manage_inventory', 'Can manage inventory', 'inventory', 'manage'),
('view_inventory', 'Can view inventory', 'inventory', 'view'),
('manage_content', 'Can manage content', 'content', 'manage'),
('view_content', 'Can view content', 'content', 'view'),
('manage_blog', 'Can manage blog posts', 'blog', 'manage'),
('view_blog', 'Can view blog posts', 'blog', 'view'),
('manage_promotions', 'Can manage promotions', 'promotions', 'manage'),
('view_promotions', 'Can view promotions', 'promotions', 'view'),
('manage_seo', 'Can manage SEO settings', 'seo', 'manage'),
('view_seo', 'Can view SEO settings', 'seo', 'view'),
('manage_reviews', 'Can manage reviews', 'reviews', 'manage'),
('view_reviews', 'Can view reviews', 'reviews', 'view'),
('manage_shipping', 'Can manage shipping', 'shipping', 'manage'),
('view_shipping', 'Can view shipping', 'shipping', 'view'),
('manage_admins', 'Can manage admin users', 'admins', 'manage'),
('view_analytics', 'Can view analytics', 'analytics', 'view'),
('manage_settings', 'Can manage settings', 'settings', 'manage');

-- Assign all permissions to super_admin
INSERT INTO public.role_permissions (role, permission_id)
SELECT 'super_admin', id FROM public.permissions;

-- Assign admin permissions to admin role
INSERT INTO public.role_permissions (role, permission_id)
SELECT 'admin', id FROM public.permissions 
WHERE name IN (
  'manage_products', 'view_products',
  'manage_categories', 'view_categories',
  'manage_orders', 'view_orders',
  'manage_customers', 'view_customers',
  'manage_inventory', 'view_inventory',
  'manage_content', 'view_content',
  'manage_blog', 'view_blog',
  'manage_promotions', 'view_promotions',
  'manage_seo', 'view_seo',
  'manage_reviews', 'view_reviews',
  'manage_shipping', 'view_shipping',
  'view_analytics'
);

-- Assign warehouse staff permissions
INSERT INTO public.role_permissions (role, permission_id)
SELECT 'warehouse_staff', id FROM public.permissions 
WHERE name IN (
  'view_products',
  'manage_inventory', 'view_inventory',
  'view_orders',
  'manage_shipping', 'view_shipping'
);

-- Assign content manager permissions
INSERT INTO public.role_permissions (role, permission_id)
SELECT 'content_manager', id FROM public.permissions 
WHERE name IN (
  'view_products',
  'manage_categories', 'view_categories',
  'manage_content', 'view_content',
  'manage_blog', 'view_blog',
  'manage_promotions', 'view_promotions',
  'manage_seo', 'view_seo',
  'view_analytics'
);

-- Insert default settings
INSERT INTO public.settings (key, value, description) VALUES
('store_name', '"FindHive"', 'Store name'),
('store_email', '"info@findhive.com"', 'Store contact email'),
('store_phone', '""', 'Store contact phone'),
('currency', '"USD"', 'Default currency'),
('tax_rate', '0', 'Default tax rate'),
('free_shipping_threshold', '100', 'Free shipping threshold'),
('low_stock_threshold', '10', 'Default low stock threshold');

-- Insert default warehouse
INSERT INTO public.warehouses (name, code, address, city, state, postal_code, country, phone, email) VALUES
('Main Warehouse', 'WH-001', '123 Warehouse Lane', 'Los Angeles', 'CA', '90001', 'USA', '+1-555-0100', 'warehouse@findhive.com');

-- Insert default categories (excluding Bags)
INSERT INTO public.categories (name, slug, description, sort_order) VALUES
('Trading Cards', 'trading-cards', 'Pokémon TCG, NBA cards, NFL cards and more', 1),
('Watches', 'watches', 'Premium watches for men and women', 2),
('Jewelry', 'jewelry', 'Fine jewelry including rings, necklaces, and earrings', 3),
('Outdoor & Fitness', 'outdoor-fitness', 'Camping, hiking, fitness equipment and sports gear', 4);

-- Insert default FAQs
INSERT INTO public.faqs (question, answer, category, sort_order) VALUES
('What payment methods do you accept?', 'We accept all major credit cards, PayPal, and bank transfers.', 'Payment', 1),
('How long does shipping take?', 'Standard shipping takes 3-5 business days. Express shipping is available.', 'Shipping', 2),
('What is your return policy?', 'We accept returns within 30 days of purchase for items in original condition.', 'Returns', 3),
('Do you ship internationally?', 'Yes, we ship to most countries worldwide.', 'Shipping', 4);

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON public.admin_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pokemon_tcg_fields_updated_at BEFORE UPDATE ON public.pokemon_tcg_fields
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON public.inventory
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON public.customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customer_addresses_updated_at BEFORE UPDATE ON public.customer_addresses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shipments_updated_at BEFORE UPDATE ON public.shipments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coupons_updated_at BEFORE UPDATE ON public.coupons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_promotions_updated_at BEFORE UPDATE ON public.promotions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_sections_updated_at BEFORE UPDATE ON public.content_sections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON public.faqs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_seo_metadata_updated_at BEFORE UPDATE ON public.seo_metadata
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON public.settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_warehouses_updated_at BEFORE UPDATE ON public.warehouses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
