-- =====================================================
-- MIGRATION: Flexible package model (Apricot-style)
-- Additive & idempotent. Safe to run on an existing database.
-- Run in Supabase SQL Editor AFTER supabase-migration-tours.sql.
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE 'plpgsql';

-- -----------------------------------------------------
-- 1. package_options — one purchasable configuration of a tour.
--    Empty party band  -> "tier" shape (Budget/Standard/Luxury).
--    Filled party band -> "price-grid row" (code, persons, rooms, price).
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS package_options (
  id SERIAL PRIMARY KEY,
  tour_id INTEGER NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
  code TEXT,                                  -- e.g. TRAVEL-157 (null for pure tiers)
  tier TEXT,                                  -- Budget | Standard | Luxury
  transport_mode TEXT,                        -- "By road"
  price_unit TEXT DEFAULT 'per_person' CHECK (price_unit IN ('per_person', 'per_group')),
  min_persons INTEGER,                        -- null -> tier shape
  max_persons INTEGER,
  rooms INTEGER,
  price NUMERIC DEFAULT 0,
  vehicle_text TEXT,
  vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE SET NULL,
  hotels TEXT,                                -- JSON [{area,nights,hotel,room_type}]
  included TEXT,                              -- JSON []
  not_included TEXT,                          -- JSON []
  extras TEXT,                                -- JSON []
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_package_options_tour ON package_options(tour_id);

DROP TRIGGER IF EXISTS update_package_options_updated_at ON package_options;
CREATE TRIGGER update_package_options_updated_at BEFORE UPDATE ON package_options
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE package_options ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all for anon on package_options" ON package_options;
CREATE POLICY "Enable all for anon on package_options" ON package_options FOR ALL TO anon USING (true) WITH CHECK (true);

-- -----------------------------------------------------
-- 2. Tour rich fields (added "as per need")
-- -----------------------------------------------------
ALTER TABLE tours ADD COLUMN IF NOT EXISTS itinerary_code TEXT;
ALTER TABLE tours ADD COLUMN IF NOT EXISTS transport_label TEXT;
ALTER TABLE tours ADD COLUMN IF NOT EXISTS availability TEXT;
ALTER TABLE tours ADD COLUMN IF NOT EXISTS highlights TEXT;      -- JSON []
ALTER TABLE tours ADD COLUMN IF NOT EXISTS videos TEXT;          -- JSON [{title,youtube_id}]
ALTER TABLE tours ADD COLUMN IF NOT EXISTS tags TEXT;            -- JSON [] of tag names
ALTER TABLE tours ADD COLUMN IF NOT EXISTS map_lat NUMERIC;
ALTER TABLE tours ADD COLUMN IF NOT EXISTS map_lng NUMERIC;
ALTER TABLE tours ADD COLUMN IF NOT EXISTS map_embed_url TEXT;

-- -----------------------------------------------------
-- 3. Multi-dimension review scores + context
-- -----------------------------------------------------
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS review_title TEXT;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS trip_type TEXT;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS score_accommodation NUMERIC;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS score_transport NUMERIC;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS score_meals NUMERIC;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS score_guide NUMERIC;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS score_value NUMERIC;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS score_accuracy NUMERIC;

-- -----------------------------------------------------
-- 4. Bookings: reference the chosen package option
-- -----------------------------------------------------
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS package_option_id INTEGER;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS option_code TEXT;

-- -----------------------------------------------------
-- 5. Seed: "Gilgit Baltistan Tour Package (10 Days)" — a working analogue of
--    the Apricot page. Tour + rich fields, then tier + grid package options,
--    then a multi-dimension review. Idempotent via slug + NOT EXISTS guards.
-- -----------------------------------------------------
INSERT INTO tours (
  tour_name, slug, destination, category, travel_mode, description, duration, duration_days, duration_nights,
  price_per_person, max_seats, available_seats, departure_city, rating, is_featured, status,
  itinerary_code, transport_label, availability, tags, highlights, videos, map_lat, map_lng, map_embed_url,
  accommodation_summary, meals_summary, itinerary_json, meta_title, meta_description
) VALUES (
  'Gilgit Baltistan Tour Package (10 Days)', 'gilgit-baltistan-10-days', 'Gilgit-Baltistan', 'Family', 'By Road',
  'A complete 10-day loop through Naran, Skardu, Hunza and Gilgit — configurable for honeymooners, private groups and families. Choose a hotel tier or a fixed price-grid package by group size.',
  '10 Days / 9 Nights', 10, 9, 165000, 20, 20, 'Islamabad', 4.9, TRUE, 'active',
  'AT 185', 'Land Travel', 'Available in Stock',
  '["Cultural","Family","Honeymoon","Road Trips"]',
  '["K2 View Point at Concordia trek base","Attabad Lake boating","Khunjerab Pass (China border)","Deosai National Park"]',
  '[{"title":"Gilgit Baltistan in 4K","youtube_id":"dQw4w9WgXcQ"}]',
  35.3200, 75.5500, 'https://www.google.com/maps?q=Skardu&output=embed',
  '3★ to 5★ hotels (by option)', 'Daily breakfast',
  '[{"day_no":1,"title":"Islamabad to Naran","activities":["Depart early via Hazara Motorway","Lunch at Balakot","Evening in Naran"]},{"day_no":2,"title":"Naran to Chilas","activities":["Babusar Top photo stop","Lulusar Lake","Overnight Chilas"]},{"day_no":3,"title":"Chilas to Skardu","activities":["Drive along the Indus","Check in at Skardu"]},{"day_no":4,"title":"Skardu Lakes","activities":["Shangrila & Upper Kachura","Boating"]},{"day_no":5,"title":"Shigar & Khaplu","activities":["Shigar Fort","Khaplu Palace"]},{"day_no":6,"title":"Skardu to Hunza","activities":["Drive to Karimabad","Rakaposhi view"]},{"day_no":7,"title":"Upper Hunza","activities":["Attabad Lake","Passu Cones","Khunjerab Pass"]},{"day_no":8,"title":"Hunza forts","activities":["Baltit Fort","Altit Fort","Eagle Nest sunset"]},{"day_no":9,"title":"Hunza to Gilgit","activities":["Local bazaar","Overnight Gilgit"]},{"day_no":10,"title":"Return","activities":["Fly or drive back to Islamabad"]}]',
  'Gilgit Baltistan Tour Package (10 Days) — Naran, Skardu, Hunza', '10-day Gilgit-Baltistan tour with honeymoon tiers and private/family price grid. From PKR 165,000.'
)
ON CONFLICT (slug) DO NOTHING;

-- Tier options (no party band) + price-grid rows (with party band). Idempotent guard.
INSERT INTO package_options (tour_id, code, tier, transport_mode, price_unit, min_persons, max_persons, rooms, price, vehicle_text, hotels, included, not_included, extras, sort_order)
SELECT t.id, v.code, v.tier, v.transport_mode, v.price_unit, v.min_persons, v.max_persons, v.rooms, v.price, v.vehicle_text, v.hotels, v.included, v.not_included, v.extras, v.sort_order
FROM tours t
CROSS JOIN (VALUES
  -- Honeymoon / solo tiers (per person, no party band)
  (NULL, 'Budget',   'By road', 'per_person', NULL, NULL, 1, 165000, 'Toyota Corolla with fuel & driver', '[{"area":"Naran","nights":2,"hotel":"Standard hotel"},{"area":"Skardu","nights":3,"hotel":"Snowland Hotel"},{"area":"Hunza","nights":3,"hotel":"Hunza View Hotel"},{"area":"Gilgit","nights":1,"hotel":"Gilgit City hotel"}]', '["Vehicle with driver","Hotels","Daily breakfast"]', '["Meals","Tickets"]', '[]', 1),
  (NULL, 'Standard', 'By road', 'per_person', NULL, NULL, 1, 235000, 'Toyota Prado with fuel & driver', '[{"area":"Naran","nights":2,"hotel":"Maisonette Hotel & Resort"},{"area":"Skardu","nights":3,"hotel":"Shangrila Resort"},{"area":"Hunza","nights":3,"hotel":"Hunza Serena Inn"},{"area":"Gilgit","nights":1,"hotel":"Gilgit Serena Hotel"}]', '["Prado with driver","4★ hotels","Daily breakfast"]', '["Meals","Tickets"]', '["Local music program"]', 2),
  (NULL, 'Luxury',   'By road', 'per_person', NULL, NULL, 1, 389500, 'Toyota Land Cruiser V8 with fuel & driver', '[{"area":"Naran","nights":2,"hotel":"Maisonette (premium)"},{"area":"Skardu","nights":3,"hotel":"Serena (Shigar & Khaplu)"},{"area":"Hunza","nights":3,"hotel":"Hunza Serena Inn"},{"area":"Gilgit","nights":1,"hotel":"Gilgit Serena Hotel"}]', '["Land Cruiser with driver","5★ hotels","Daily breakfast","Toll, parking, driver food & stay"]', '["Meals","Park & fort tickets"]', '["Local music program"]', 3),
  -- Private & Family price grid (per group, party bands) — full 9-row TRAVEL grid
  ('TRAVEL-151', 'Budget',   'By road', 'per_group', 2, 3,  1, 184500, 'Toyota Prado with fuel & driver',            '[{"area":"Skardu","nights":3,"hotel":"Snowland Hotel"},{"area":"Hunza","nights":3,"hotel":"Hunza View Hotel"}]', '["Vehicle with driver","Hotels","Daily breakfast"]', '["Meals","Tickets"]', '[]', 4),
  ('TRAVEL-152', 'Standard', 'By road', 'per_group', 2, 3,  1, 224500, 'Toyota Prado with fuel & driver',            '[{"area":"Skardu","nights":3,"hotel":"Shangrila Resort"},{"area":"Hunza","nights":3,"hotel":"Hunza Serena Inn"}]', '["Prado with driver","4★ hotels","Daily breakfast"]', '["Meals","Tickets"]', '[]', 5),
  ('TRAVEL-153', 'Luxury',   'By road', 'per_group', 2, 3,  1, 299500, 'Toyota Land Cruiser V8 with fuel & driver',  '[{"area":"Skardu","nights":3,"hotel":"Serena (Shigar & Khaplu)"},{"area":"Hunza","nights":3,"hotel":"Hunza Serena Inn"}]', '["Land Cruiser with driver","5★ hotels","Daily breakfast","Toll & parking"]', '["Meals","Park & fort tickets"]', '["Local music program"]', 6),
  ('TRAVEL-154', 'Standard', 'By road', 'per_group', 4, 6,  2, 284500, 'Toyota Grand Cabin + jeep with driver',      '[{"area":"Skardu","nights":3,"hotel":"Shangrila Resort"},{"area":"Hunza","nights":3,"hotel":"Hunza Serena Inn"}]', '["Van + jeep with driver","Hotels","Daily breakfast","Guide"]', '["Meals","Tickets"]', '["Local music program"]', 7),
  ('TRAVEL-155', 'Budget',   'By road', 'per_group', 4, 6,  2, 244500, 'Toyota Grand Cabin with driver',             '[{"area":"Skardu","nights":3,"hotel":"Snowland Hotel"},{"area":"Hunza","nights":3,"hotel":"Hunza View Hotel"}]', '["Van with driver","Hotels","Daily breakfast"]', '["Meals","Tickets"]', '[]', 8),
  ('TRAVEL-157', 'Luxury',   'By road', 'per_group', 4, 6,  2, 389500, 'Toyota Prado (2001-07) with fuel & local driver', '[{"area":"Naran","nights":2,"hotel":"Maisonette Hotel & Resort"},{"area":"Skardu","nights":3,"hotel":"Serena (Shigar & Khaplu)"},{"area":"Hunza","nights":3,"hotel":"Hunza Serena Inn"},{"area":"Gilgit","nights":1,"hotel":"Gilgit Serena Hotel"}]', '["Toll taxes, parking, driver food & stay"]', '["Meals","Park & fort tickets"]', '["Local music program"]', 9),
  ('TRAVEL-156', 'Budget',   'By road', 'per_group', 7, 12, 4, 434500, 'Coaster Saloon with driver',                 '[{"area":"Skardu","nights":3,"hotel":"Snowland Hotel"},{"area":"Hunza","nights":3,"hotel":"Hunza View Hotel"}]', '["Coaster with driver","Hotels","Daily breakfast","Guide"]', '["Meals","Tickets"]', '[]', 10),
  ('TRAVEL-158', 'Standard', 'By road', 'per_group', 7, 12, 4, 529500, 'Coaster Saloon + jeep with drivers',         '[{"area":"Skardu","nights":3,"hotel":"Shangrila Resort"},{"area":"Hunza","nights":3,"hotel":"Hunza Serena Inn"}]', '["Coaster + jeep","4★ hotels","Guide"]', '["Meals","Tickets"]', '["Local music program"]', 11),
  ('TRAVEL-159', 'Luxury',   'By road', 'per_group', 7, 12, 4, 620000, 'Coaster Saloon + Land Cruiser with drivers', '[{"area":"Skardu","nights":3,"hotel":"Serena (Shigar & Khaplu)"},{"area":"Hunza","nights":3,"hotel":"Hunza Serena Inn"}]', '["Coaster + Land Cruiser","5★ hotels","Guide","Toll, parking, driver food & stay"]', '["Meals","Park & fort tickets"]', '["Local music program"]', 12)
) AS v(code, tier, transport_mode, price_unit, min_persons, max_persons, rooms, price, vehicle_text, hotels, included, not_included, extras, sort_order)
WHERE t.slug = 'gilgit-baltistan-10-days'
  AND NOT EXISTS (SELECT 1 FROM package_options po WHERE po.tour_id = t.id);

-- Multi-dimension review
INSERT INTO reviews (customer_name, tour_name, rating, review_title, review_text, trip_type, country, city, status, is_featured, score_accommodation, score_transport, score_meals, score_guide, score_value, score_accuracy)
SELECT 'Ayesha & Bilal', 'Gilgit Baltistan Tour Package (10 Days)', 5, 'Perfect honeymoon', 'Flawless from start to finish — the driver knew every viewpoint and the Serena stays were superb.', 'Honeymoon', 'Pakistan', 'Lahore', 'approved', TRUE, 5, 4.5, 4, 5, 4.5, 5
WHERE NOT EXISTS (SELECT 1 FROM reviews r WHERE r.tour_name = 'Gilgit Baltistan Tour Package (10 Days)' AND r.customer_name = 'Ayesha & Bilal');
