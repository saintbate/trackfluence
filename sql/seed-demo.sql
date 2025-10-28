-- Seed demo data for trackfluence
-- Run with: psql <connection-string> -f sql/seed-demo.sql

-- Clean up existing demo data
DELETE FROM shop_order WHERE campaign_id IN (
  SELECT id FROM campaign WHERE brand_id IN (
    SELECT id FROM brand WHERE name IN ('Demo Brand', 'Acme Co', 'Sample Shop')
  )
);

DELETE FROM campaign WHERE brand_id IN (
  SELECT id FROM brand WHERE name IN ('Demo Brand', 'Acme Co', 'Sample Shop')
);

DELETE FROM influencer WHERE handle IN (
  '@fashionista', '@techreview', '@lifestyle_emma', '@fitness_mike', '@foodie_sarah'
);

DELETE FROM brand WHERE name IN ('Demo Brand', 'Acme Co', 'Sample Shop');

-- Insert brands
-- Note: Demo Brand has NULL owner_user_id to be accessible by everyone
-- Other brands also have NULL for demo purposes - in production, set to actual user IDs
INSERT INTO brand (id, name, owner_user_id) VALUES
('demo-brand-001', 'Demo Brand', NULL),
('demo-brand-002', 'Acme Co', NULL),
('demo-brand-003', 'Sample Shop', NULL);

-- Insert influencers
INSERT INTO influencer (id, handle, name, platform, followers) VALUES
('inf-001', '@fashionista', 'Fashion Influencer', 'instagram', 125000),
('inf-002', '@techreview', 'Tech Reviewer', 'youtube', 250000),
('inf-003', '@lifestyle_emma', 'Emma Lifestyle', 'instagram', 85000),
('inf-004', '@fitness_mike', 'Mike Fitness', 'tiktok', 180000),
('inf-005', '@foodie_sarah', 'Sarah Foodie', 'instagram', 95000);

-- Insert campaigns for Demo Brand
INSERT INTO campaign (id, brand_id, name, start_date, end_date) VALUES
('camp-001', 'demo-brand-001', 'Spring Collection 2025', '2025-03-01', '2025-03-31'),
('camp-002', 'demo-brand-001', 'Summer Sale', '2025-06-01', '2025-08-31'),
('camp-003', 'demo-brand-002', 'Product Launch', '2025-02-15', '2025-03-15'),
('camp-004', 'demo-brand-003', 'Holiday Special', '2025-10-01', '2025-10-31');

-- Insert shop orders for Demo Brand campaigns
INSERT INTO shop_order (id, campaign_id, influencer_id, brand_id, order_number, order_date, revenue, influencer_spend, discount_code) VALUES
-- Spring Collection (camp-001)
('ord-001', 'camp-001', 'inf-001', 'demo-brand-001', 'SHOP-1001', '2025-03-05', 450.00, 50.00, 'FASHIONISTA10'),
('ord-002', 'camp-001', 'inf-001', 'demo-brand-001', 'SHOP-1002', '2025-03-08', 325.00, 50.00, 'FASHIONISTA10'),
('ord-003', 'camp-001', 'inf-002', 'demo-brand-001', 'SHOP-1003', '2025-03-10', 680.00, 75.00, 'TECHREVIEW'),
('ord-004', 'camp-001', 'inf-003', 'demo-brand-001', 'SHOP-1004', '2025-03-12', 290.00, 40.00, 'EMMA15'),
('ord-005', 'camp-001', 'inf-001', 'demo-brand-001', 'SHOP-1005', '2025-03-15', 520.00, 50.00, 'FASHIONISTA10'),
('ord-006', 'camp-001', 'inf-004', 'demo-brand-001', 'SHOP-1006', '2025-03-18', 410.00, 60.00, 'MIKEFIT'),
('ord-007', 'camp-001', 'inf-002', 'demo-brand-001', 'SHOP-1007', '2025-03-20', 750.00, 75.00, 'TECHREVIEW'),
('ord-008', 'camp-001', 'inf-005', 'demo-brand-001', 'SHOP-1008', '2025-03-22', 380.00, 45.00, 'SARAHFOOD'),
('ord-009', 'camp-001', 'inf-001', 'demo-brand-001', 'SHOP-1009', '2025-03-25', 495.00, 50.00, 'FASHIONISTA10'),
('ord-010', 'camp-001', 'inf-003', 'demo-brand-001', 'SHOP-1010', '2025-03-28', 340.00, 40.00, 'EMMA15'),

-- Summer Sale (camp-002)
('ord-011', 'camp-002', 'inf-002', 'demo-brand-001', 'SHOP-1011', '2025-06-05', 890.00, 80.00, 'TECHREVIEW'),
('ord-012', 'camp-002', 'inf-004', 'demo-brand-001', 'SHOP-1012', '2025-06-08', 670.00, 65.00, 'MIKEFIT'),
('ord-013', 'camp-002', 'inf-001', 'demo-brand-001', 'SHOP-1013', '2025-06-12', 540.00, 55.00, 'FASHIONISTA10'),
('ord-014', 'camp-002', 'inf-005', 'demo-brand-001', 'SHOP-1014', '2025-06-15', 425.00, 50.00, 'SARAHFOOD'),
('ord-015', 'camp-002', 'inf-002', 'demo-brand-001', 'SHOP-1015', '2025-06-18', 920.00, 80.00, 'TECHREVIEW'),

-- Product Launch (camp-003) - different brand
('ord-016', 'camp-003', 'inf-002', 'demo-brand-002', 'SHOP-2001', '2025-02-20', 1200.00, 100.00, 'TECHREVIEW'),
('ord-017', 'camp-003', 'inf-004', 'demo-brand-002', 'SHOP-2002', '2025-02-25', 850.00, 80.00, 'MIKEFIT'),
('ord-018', 'camp-003', 'inf-001', 'demo-brand-002', 'SHOP-2003', '2025-03-01', 650.00, 60.00, 'FASHIONISTA10'),

-- Holiday Special (camp-004) - different brand
('ord-019', 'camp-004', 'inf-003', 'demo-brand-003', 'SHOP-3001', '2025-10-05', 720.00, 70.00, 'EMMA15'),
('ord-020', 'camp-004', 'inf-005', 'demo-brand-003', 'SHOP-3002', '2025-10-10', 580.00, 55.00, 'SARAHFOOD');

-- Success message
SELECT 'Demo data seeded successfully!' AS status,
       (SELECT COUNT(*) FROM brand WHERE name LIKE 'Demo%' OR name IN ('Acme Co', 'Sample Shop')) AS brands_count,
       (SELECT COUNT(*) FROM influencer WHERE handle LIKE '@%') AS influencers_count,
       (SELECT COUNT(*) FROM campaign WHERE brand_id IN (SELECT id FROM brand WHERE name IN ('Demo Brand', 'Acme Co', 'Sample Shop'))) AS campaigns_count,
       (SELECT COUNT(*) FROM shop_order WHERE campaign_id IN (SELECT id FROM campaign WHERE brand_id IN (SELECT id FROM brand WHERE name IN ('Demo Brand', 'Acme Co', 'Sample Shop')))) AS orders_count;

