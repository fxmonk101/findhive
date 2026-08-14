/*
# Add missing columns to orders and order_items tables

## Purpose
The existing orders and order_items tables are missing columns needed for
a complete e-commerce order flow: customer contact info, shipping/tracking
status, invoice numbers, and product image snapshots on order items.

## Changes to `orders` table
Adds the following columns (all nullable or with safe defaults so existing
rows are unaffected):
- `customer_email` (text, not null) — email of the customer who placed the order
- `customer_name` (text, nullable) — full name of the customer
- `customer_phone` (text, nullable) — phone number
- `shipping_status` (text, default 'unfulfilled') — fulfilment state
- `tracking_number` (text, nullable) — shipping tracking number
- `transaction_reference` (text, nullable) — payment transaction reference
- `invoice_number` (text, nullable) — generated invoice number for PDF invoices

## Changes to `order_items` table
Adds:
- `image_url` (text, nullable) — snapshot of the product image at time of order

## Security
No RLS policy changes in this migration. Existing policies remain in effect.

## Notes
- All ALTER TABLE statements use IF NOT EXISTS for idempotency.
- Existing data is not modified or lost.
- The `orders` table already has `tax`, `shipping`, `discount`, `total` columns;
  this migration does NOT rename or remove them.
*/

-- Add missing columns to orders table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'customer_email') THEN
    ALTER TABLE orders ADD COLUMN customer_email text NOT NULL DEFAULT '';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'customer_name') THEN
    ALTER TABLE orders ADD COLUMN customer_name text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'customer_phone') THEN
    ALTER TABLE orders ADD COLUMN customer_phone text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'shipping_status') THEN
    ALTER TABLE orders ADD COLUMN shipping_status text NOT NULL DEFAULT 'unfulfilled';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'tracking_number') THEN
    ALTER TABLE orders ADD COLUMN tracking_number text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'transaction_reference') THEN
    ALTER TABLE orders ADD COLUMN transaction_reference text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'invoice_number') THEN
    ALTER TABLE orders ADD COLUMN invoice_number text;
  END IF;
END $$;

-- Add missing image_url column to order_items table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'order_items' AND column_name = 'image_url') THEN
    ALTER TABLE order_items ADD COLUMN image_url text;
  END IF;
END $$;

-- Add index on orders.order_number for faster lookups
CREATE INDEX IF NOT EXISTS orders_order_number_idx ON orders (order_number);
CREATE INDEX IF NOT EXISTS orders_customer_email_idx ON orders (customer_email);
CREATE INDEX IF NOT EXISTS order_items_order_id_idx ON order_items (order_id);
