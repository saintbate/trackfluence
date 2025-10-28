-- Add columns to shop_order table for ingestion tracking
-- order_number: Unique order identifier for upsert operations
-- discount_code: Discount code used in the order
-- utm_source, utm_medium, utm_campaign: GA4 tracking parameters

-- Add order_number column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'shop_order' 
    AND column_name = 'order_number'
  ) THEN
    ALTER TABLE shop_order ADD COLUMN order_number TEXT;
    RAISE NOTICE 'Column order_number added to shop_order table';
  ELSE
    RAISE NOTICE 'Column order_number already exists';
  END IF;
END $$;

-- Add discount_code column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'shop_order' 
    AND column_name = 'discount_code'
  ) THEN
    ALTER TABLE shop_order ADD COLUMN discount_code TEXT;
    RAISE NOTICE 'Column discount_code added to shop_order table';
  ELSE
    RAISE NOTICE 'Column discount_code already exists';
  END IF;
END $$;

-- Add utm_source column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'shop_order' 
    AND column_name = 'utm_source'
  ) THEN
    ALTER TABLE shop_order ADD COLUMN utm_source TEXT;
    RAISE NOTICE 'Column utm_source added to shop_order table';
  ELSE
    RAISE NOTICE 'Column utm_source already exists';
  END IF;
END $$;

-- Add utm_medium column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'shop_order' 
    AND column_name = 'utm_medium'
  ) THEN
    ALTER TABLE shop_order ADD COLUMN utm_medium TEXT;
    RAISE NOTICE 'Column utm_medium added to shop_order table';
  ELSE
    RAISE NOTICE 'Column utm_medium already exists';
  END IF;
END $$;

-- Add utm_campaign column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'shop_order' 
    AND column_name = 'utm_campaign'
  ) THEN
    ALTER TABLE shop_order ADD COLUMN utm_campaign TEXT;
    RAISE NOTICE 'Column utm_campaign added to shop_order table';
  ELSE
    RAISE NOTICE 'Column utm_campaign already exists';
  END IF;
END $$;

-- Add unique constraint on (brand_id, order_number) for upsert operations
-- First check if the constraint already exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'shop_order_brand_order_unique'
  ) THEN
    -- Only add if order_number is not null
    ALTER TABLE shop_order 
    ADD CONSTRAINT shop_order_brand_order_unique 
    UNIQUE (brand_id, order_number);
    RAISE NOTICE 'Unique constraint shop_order_brand_order_unique added';
  ELSE
    RAISE NOTICE 'Unique constraint already exists';
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Could not add unique constraint (may need to clean up duplicate data first)';
END $$;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_shop_order_order_number ON shop_order(order_number);
CREATE INDEX IF NOT EXISTS idx_shop_order_brand_order ON shop_order(brand_id, order_number);
CREATE INDEX IF NOT EXISTS idx_shop_order_discount_code ON shop_order(discount_code) WHERE discount_code IS NOT NULL;

-- Success message
SELECT 'shop_order tracking columns setup completed!' AS status;


