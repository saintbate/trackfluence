-- Add additional columns to brand table for enhanced brand management
-- shop_domain: Store Shopify or custom domain
-- timezone: Store brand's timezone for date handling

-- Add shop_domain column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'brand' 
    AND column_name = 'shop_domain'
  ) THEN
    ALTER TABLE brand ADD COLUMN shop_domain TEXT;
    RAISE NOTICE 'Column shop_domain added to brand table';
  ELSE
    RAISE NOTICE 'Column shop_domain already exists';
  END IF;
END $$;

-- Add timezone column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'brand' 
    AND column_name = 'timezone'
  ) THEN
    ALTER TABLE brand ADD COLUMN timezone TEXT DEFAULT 'UTC';
    RAISE NOTICE 'Column timezone added to brand table';
  ELSE
    RAISE NOTICE 'Column timezone already exists';
  END IF;
END $$;

-- Success message
SELECT 'Brand columns (shop_domain, timezone) setup completed!' AS status;


