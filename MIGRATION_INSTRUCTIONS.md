# Database Migration Instructions

## Issue
The `public.products` table does not exist in your Supabase database, causing both SQL import errors and shop page failures.

## Solution: Run Migrations in Supabase

### Step 1: Create the Products Table
1. Go to https://supabase.com/dashboard
2. Select your project (ihxtghsmlzzbqrnxzmcb)
3. Go to SQL Editor
4. Copy and run the contents of: `supabase/migrations/20260724173130_4bb54ac3-25f3-4b98-9375-28a21b4d6e34.sql`
5. This creates the initial products table with sample data

### Step 2: Add Missing Columns (SEO, Inventory, Tags)
1. In the same SQL Editor
2. Copy and run the contents of: `supabase/migrations/20260814000000_add_product_columns.sql`
3. This adds columns needed for the optimized product import

### Step 3: Import Products
1. In the SQL Editor
2. Copy and run the contents of: `scripts/products-import-optimized.sql`
3. This adds 102 SEO-optimized products

### Step 4: Verify
Run this query to verify:
```sql
SELECT COUNT(*) as total_products FROM public.products WHERE status = 'published';
```

Expected result: 107 products (5 from initial migration + 102 from optimized import)

## After Migration
- Shop page should load at https://findhive.vercel.app/shop
- Products will be displayed with proper SEO metadata
- Admin panel can manage products after setting up admin users (see ADMIN_SETUP.md)

## Troubleshooting
If you see "relation does not exist" errors:
- Ensure you're running the migrations in order (Step 1, then Step 2, then Step 3)
- Check that you're in the correct Supabase project (ihxtghsmlzzbqrnxzmcb)
- Verify you have sufficient permissions to create tables
