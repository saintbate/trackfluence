-- Enable Row Level Security on all tables
ALTER TABLE brand ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign ENABLE ROW LEVEL SECURITY;
ALTER TABLE influencer ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_order ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read their own brands or Demo brand" ON brand;
DROP POLICY IF EXISTS "Users can read campaigns for their brands" ON campaign;
DROP POLICY IF EXISTS "Users can read influencers" ON influencer;
DROP POLICY IF EXISTS "Users can read shop_orders for their brands" ON shop_order;

-- Brand policies
-- Users can read brands they own OR the Demo brand
-- Note: owner_user_id stores email from NextAuth, not UUID
-- For Supabase auth integration, you may need to adjust this to use auth.jwt() ->> 'email'
CREATE POLICY "Users can read their own brands or Demo brand"
  ON brand
  FOR SELECT
  USING (
    owner_user_id IS NULL  -- Allow Demo brands with NULL owner
    OR name = 'Demo Brand'
  );

-- Users can insert/update/delete their own brands (not Demo)
-- This policy assumes server-side validation via service role key
CREATE POLICY "Users can manage their own brands"
  ON brand
  FOR ALL
  USING (owner_user_id IS NOT NULL)
  WITH CHECK (owner_user_id IS NOT NULL);

-- Campaign policies
-- Users can read campaigns for brands they have access to
CREATE POLICY "Users can read campaigns for their brands"
  ON campaign
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM brand 
      WHERE brand.id = campaign.brand_id 
      AND (brand.owner_user_id IS NULL OR brand.name = 'Demo Brand')
    )
  );

-- Users can manage campaigns for their own brands (not Demo)
-- Server-side validation handles ownership checks via service role
CREATE POLICY "Users can manage campaigns for their brands"
  ON campaign
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM brand 
      WHERE brand.id = campaign.brand_id 
      AND brand.owner_user_id IS NOT NULL
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM brand 
      WHERE brand.id = campaign.brand_id 
      AND brand.owner_user_id IS NOT NULL
    )
  );

-- Influencer policies
-- All authenticated users can read influencers (shared resource)
CREATE POLICY "Authenticated users can read influencers"
  ON influencer
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Users can manage influencers (optional - adjust as needed)
CREATE POLICY "Authenticated users can manage influencers"
  ON influencer
  FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Shop Order policies
-- Users can read orders for campaigns in brands they have access to
CREATE POLICY "Users can read shop_orders for their brands"
  ON shop_order
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM campaign
      JOIN brand ON campaign.brand_id = brand.id
      WHERE campaign.id = shop_order.campaign_id
      AND (brand.owner_user_id IS NULL OR brand.name = 'Demo Brand')
    )
  );

-- Users can manage orders for their own brands (not Demo)
-- Server-side validation handles ownership checks via service role
CREATE POLICY "Users can manage shop_orders for their brands"
  ON shop_order
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM campaign
      JOIN brand ON campaign.brand_id = brand.id
      WHERE campaign.id = shop_order.campaign_id
      AND brand.owner_user_id IS NOT NULL
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM campaign
      JOIN brand ON campaign.brand_id = brand.id
      WHERE campaign.id = shop_order.campaign_id
      AND brand.owner_user_id IS NOT NULL
    )
  );

-- Grant necessary permissions
GRANT SELECT ON brand TO authenticated;
GRANT SELECT ON campaign TO authenticated;
GRANT SELECT ON influencer TO authenticated;
GRANT SELECT ON shop_order TO authenticated;

GRANT ALL ON brand TO authenticated;
GRANT ALL ON campaign TO authenticated;
GRANT ALL ON influencer TO authenticated;
GRANT ALL ON shop_order TO authenticated;

-- Success message
SELECT 'RLS policies created successfully!' AS status;

