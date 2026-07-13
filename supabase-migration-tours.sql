-- =====================================================
-- MIGRATION: Tours commerce + SEO upgrade
-- Additive & idempotent. Safe to run on an existing database.
-- Run in Supabase SQL Editor AFTER supabase-schema.sql.
-- =====================================================

-- -----------------------------------------------------
-- 1. New columns on tours (all additive / nullable)
-- -----------------------------------------------------
ALTER TABLE tours ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE tours ADD COLUMN IF NOT EXISTS travel_mode TEXT DEFAULT 'By Road';
ALTER TABLE tours ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;
ALTER TABLE tours ADD COLUMN IF NOT EXISTS urgency_badge TEXT;
ALTER TABLE tours ADD COLUMN IF NOT EXISTS rating NUMERIC DEFAULT 4.7;
ALTER TABLE tours ADD COLUMN IF NOT EXISTS duration_days INTEGER;
ALTER TABLE tours ADD COLUMN IF NOT EXISTS duration_nights INTEGER;
ALTER TABLE tours ADD COLUMN IF NOT EXISTS group_size TEXT;
ALTER TABLE tours ADD COLUMN IF NOT EXISTS accommodation_summary TEXT;
ALTER TABLE tours ADD COLUMN IF NOT EXISTS meals_summary TEXT;
ALTER TABLE tours ADD COLUMN IF NOT EXISTS pricing_tiers TEXT;    -- JSON: [{name,blurb,price,is_popular}]
ALTER TABLE tours ADD COLUMN IF NOT EXISTS itinerary_json TEXT;   -- JSON: [{day_no,title,description}]
ALTER TABLE tours ADD COLUMN IF NOT EXISTS gallery TEXT;          -- JSON: [url, ...]
ALTER TABLE tours ADD COLUMN IF NOT EXISTS related_tour_ids TEXT; -- JSON: [id, ...]
ALTER TABLE tours ADD COLUMN IF NOT EXISTS meta_title TEXT;
ALTER TABLE tours ADD COLUMN IF NOT EXISTS meta_description TEXT;
ALTER TABLE tours ADD COLUMN IF NOT EXISTS meta_keywords TEXT;
ALTER TABLE tours ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- -----------------------------------------------------
-- 2. Relax the category CHECK so admins can use any category
--    (Luxury, Trekking, Corporate, Customized, By Air, ...)
-- -----------------------------------------------------
ALTER TABLE tours DROP CONSTRAINT IF EXISTS tours_category_check;

-- -----------------------------------------------------
-- 3. Backfill slugs for existing rows (slug = kebab(name)-id, guaranteed unique)
-- -----------------------------------------------------
UPDATE tours
SET slug = trim(both '-' from regexp_replace(lower(tour_name), '[^a-z0-9]+', '-', 'g')) || '-' || id
WHERE slug IS NULL OR slug = '';

CREATE UNIQUE INDEX IF NOT EXISTS idx_tours_slug ON tours(slug) WHERE slug IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tours_featured ON tours(is_featured);
CREATE INDEX IF NOT EXISTS idx_tours_travel_mode ON tours(travel_mode);

-- -----------------------------------------------------
-- 4. Optional seed data (safe to skip / delete). Two fully-populated demo tours.
-- -----------------------------------------------------
INSERT INTO tours (
  tour_name, slug, destination, category, travel_mode, description, duration, duration_days, duration_nights,
  price_per_person, max_seats, available_seats, departure_city, rating, is_featured, urgency_badge,
  accommodation_summary, meals_summary, group_size, status,
  inclusions, exclusions, pricing_tiers, itinerary_json, meta_title, meta_description
) VALUES
(
  'Skardu Luxury Escape', 'skardu-luxury-escape', 'Skardu', 'Luxury', 'By Road',
  'A handcrafted journey through Skardu''s lakes, forts and the gateway to the Karakoram — with premium hotels and a private mountain driver.',
  '5 Days / 4 Nights', 5, 4, 65000, 14, 14, 'Islamabad', 4.8, TRUE, 'Only 3 slots left this month',
  '3★ to 5★ hotels (by tier)', 'Daily breakfast + 2 dinners', '2–14 travellers', 'active',
  E'Private vehicle with driver\nHotel accommodation\nDaily breakfast\nAll sightseeing\nToll & fuel',
  E'Airfare\nLunch & personal expenses\nEntry tickets\nTips',
  '[{"name":"Standard (3★)","blurb":"Comfortable, well-located hotels","price":65000,"is_popular":false},{"name":"Executive (4★)","blurb":"Upgraded rooms and lakeside stays","price":89000,"is_popular":true},{"name":"Luxury (5★)","blurb":"Best resorts, premium everything","price":129000,"is_popular":false}]',
  '[{"day_no":1,"title":"Islamabad to Chilas","description":"Depart early along the Karakoram Highway with photo stops at Nanga Parbat viewpoint."},{"day_no":2,"title":"Chilas to Skardu","description":"Scenic drive along the Indus into Skardu; evening at leisure."},{"day_no":3,"title":"Shangrila & Upper Kachura Lake","description":"Full-day lakes tour and boating."},{"day_no":4,"title":"Shigar Valley & Fort","description":"Visit the restored Shigar Fort and cold desert."},{"day_no":5,"title":"Return","description":"Drive back to Islamabad or upgrade to a return flight."}]',
  'Skardu Luxury Escape — 5-Day Karakoram Tour', 'Premium 5-day Skardu tour with private driver, handpicked hotels and lakes. From PKR 65,000 per person.'
),
(
  'Hunza Valley Signature', 'hunza-valley-signature', 'Hunza', 'Family', 'By Road',
  'The classic Hunza experience — Attabad Lake, Passu Cones, Baltit and Altit forts and the road to Khunjerab Pass.',
  '6 Days / 5 Nights', 6, 5, 72000, 16, 16, 'Islamabad', 4.7, TRUE, 'Selling fast — book soon',
  '3★ to 5★ hotels (by tier)', 'Daily breakfast', '2–16 travellers', 'active',
  E'Private vehicle with driver\nHotel accommodation\nDaily breakfast\nAll sightseeing',
  E'Airfare\nLunch & dinner\nKhunjerab park fee\nTips',
  '[{"name":"Standard (3★)","blurb":"Cosy valley-view hotels","price":72000,"is_popular":false},{"name":"Executive (4★)","blurb":"Premium rooms in Karimabad","price":95000,"is_popular":true},{"name":"Luxury (5★)","blurb":"Serena-class stays","price":139000,"is_popular":false}]',
  '[{"day_no":1,"title":"Islamabad to Besham","description":"Begin the KKH journey with an overnight in Besham."},{"day_no":2,"title":"Besham to Hunza","description":"Drive to Karimabad via Rakaposhi viewpoint."},{"day_no":3,"title":"Attabad Lake & Passu","description":"Boating on Attabad and the Passu Cones."},{"day_no":4,"title":"Khunjerab Pass","description":"Day trip to the Pakistan–China border at 4,700m."},{"day_no":5,"title":"Forts & Karimabad","description":"Baltit and Altit forts, local bazaar."},{"day_no":6,"title":"Return","description":"Drive back towards Islamabad."}]',
  'Hunza Valley Signature — 6-Day Family Tour', '6-day Hunza tour: Attabad Lake, Khunjerab Pass, forts and Passu Cones. From PKR 72,000 per person.'
)
ON CONFLICT (slug) DO NOTHING;
