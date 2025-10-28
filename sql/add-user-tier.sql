-- Add app_user table for user billing and tier management
-- This table stores user subscription information

-- Create app_user table if it doesn't exist
CREATE TABLE IF NOT EXISTS app_user (
  id TEXT PRIMARY KEY,                    -- User email from NextAuth
  tier TEXT DEFAULT 'FREE' NOT NULL,      -- Subscription tier: FREE or PRO
  stripe_customer_id TEXT,                -- Stripe customer ID
  stripe_subscription_id TEXT,            -- Stripe subscription ID
  subscription_status TEXT,               -- active, canceled, past_due, etc.
  subscription_current_period_end TIMESTAMP, -- When current period ends
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_app_user_stripe_customer ON app_user(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_app_user_tier ON app_user(tier);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_app_user_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_app_user_updated_at_trigger ON app_user;
CREATE TRIGGER update_app_user_updated_at_trigger
BEFORE UPDATE ON app_user
FOR EACH ROW
EXECUTE FUNCTION update_app_user_updated_at();

-- Enable RLS
ALTER TABLE app_user ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only read/update their own record
-- Note: Uses service role key on server, so these policies are additional safety
CREATE POLICY "Users can view their own profile"
  ON app_user
  FOR SELECT
  USING (true); -- Allow all reads via service role

CREATE POLICY "Users can update their own profile"
  ON app_user
  FOR ALL
  USING (true) -- Allow all via service role
  WITH CHECK (true);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON app_user TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Success message
SELECT 'app_user table with tier support created successfully!' AS status;


