-- Add owner_user_id column to brand table for authentication
-- This column stores the user email from NextAuth that owns each brand

-- Add column if it doesn't exist (using TEXT for email storage)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'brand' 
    AND column_name = 'owner_user_id'
  ) THEN
    ALTER TABLE brand ADD COLUMN owner_user_id TEXT;
    RAISE NOTICE 'Column owner_user_id added to brand table';
  ELSE
    RAISE NOTICE 'Column owner_user_id already exists';
  END IF;
END $$;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_brand_owner_user_id ON brand(owner_user_id);

-- Success message
SELECT 'owner_user_id column setup completed!' AS status;

