-- ============================================================
-- COMBINED MIGRATION — run once in Supabase SQL Editor.
-- Order: fleet -> tours -> packages -> tags. Idempotent (safe to re-run).
-- ============================================================

-- ===== 1/4: supabase-migration-fleet.sql =====
-- =====================================================
-- MIGRATION: Car Rental (Vehicles) + By-Air Packages + unified Bookings
-- Additive & idempotent. Safe to run on an existing database.
-- Run this in your Supabase SQL Editor AFTER supabase-schema.sql.
-- =====================================================

-- Shared updated_at trigger function (re-declared so this file is standalone)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- -----------------------------------------------------
-- 1. Vehicles (Car Rental fleet)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS vehicles (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL DEFAULT 'SUV' CHECK (type IN ('SUV', 'Van', 'Bus', 'Sedan', 'Jeep', 'Coaster', 'Hiace', 'Prado', 'Land Cruiser')),
  seats INTEGER NOT NULL DEFAULT 4,
  has_ac BOOLEAN DEFAULT TRUE,
  fuel TEXT DEFAULT 'Petrol' CHECK (fuel IN ('Petrol', 'Diesel', 'Hybrid', 'Electric')),
  with_driver BOOLEAN DEFAULT TRUE,
  price_per_day NUMERIC DEFAULT 0,
  description TEXT,
  cover_image TEXT,
  gallery TEXT,             -- JSON array of image URLs
  specs TEXT,               -- JSON object of extra specs
  urgency_badge TEXT,       -- e.g. "Only 2 left this week"
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  sort_order INTEGER DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- -----------------------------------------------------
-- 2. By-Air Packages
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS by_air_packages (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  destination TEXT NOT NULL,
  airline TEXT,
  flight_duration TEXT,     -- e.g. "50 min"
  road_duration TEXT,       -- e.g. "18 hrs" (for the "not 18 hrs" framing)
  duration_days INTEGER DEFAULT 1,
  duration_nights INTEGER DEFAULT 0,
  price_per_person NUMERIC DEFAULT 0,
  description TEXT,
  highlights TEXT,          -- JSON array
  inclusions TEXT,
  exclusions TEXT,
  itinerary TEXT,           -- JSON array of {day,title,description} OR plain text
  cover_image TEXT,
  gallery TEXT,             -- JSON array of image URLs
  urgency_badge TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'coming_soon')),
  sort_order INTEGER DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- -----------------------------------------------------
-- 3. Extend bookings to support all booking types + Track Booking
-- -----------------------------------------------------
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS reference TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS booking_type TEXT DEFAULT 'tour';
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS vehicle_id INTEGER;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS by_air_id INTEGER;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS rooms INTEGER DEFAULT 1;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS duration_days INTEGER;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS selected_tier TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS add_vehicle TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'web';

-- Unique reference for public "Track Booking" lookup
CREATE UNIQUE INDEX IF NOT EXISTS idx_bookings_reference ON bookings(reference) WHERE reference IS NOT NULL;

-- -----------------------------------------------------
-- 4. Triggers for auto-updating updated_at
-- -----------------------------------------------------
DROP TRIGGER IF EXISTS update_vehicles_updated_at ON vehicles;
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_by_air_packages_updated_at ON by_air_packages;
CREATE TRIGGER update_by_air_packages_updated_at BEFORE UPDATE ON by_air_packages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- -----------------------------------------------------
-- 5. Indexes
-- -----------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);
CREATE INDEX IF NOT EXISTS idx_vehicles_type ON vehicles(type);
CREATE INDEX IF NOT EXISTS idx_vehicles_slug ON vehicles(slug);
CREATE INDEX IF NOT EXISTS idx_by_air_status ON by_air_packages(status);
CREATE INDEX IF NOT EXISTS idx_by_air_slug ON by_air_packages(slug);
CREATE INDEX IF NOT EXISTS idx_bookings_type ON bookings(booking_type);

-- -----------------------------------------------------
-- 6. Row Level Security (matches existing project convention:
--    anon role via NEXT_PUBLIC_SUPABASE_ANON_KEY).
--    NOTE: the existing schema grants anon full access to all tables.
--    These policies keep the new tables consistent with that setup.
-- -----------------------------------------------------
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE by_air_packages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable all for anon on vehicles" ON vehicles;
CREATE POLICY "Enable all for anon on vehicles" ON vehicles FOR ALL TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all for anon on by_air_packages" ON by_air_packages;
CREATE POLICY "Enable all for anon on by_air_packages" ON by_air_packages FOR ALL TO anon USING (true) WITH CHECK (true);

-- -----------------------------------------------------
-- 7. Optional seed data (safe to skip / delete)
-- -----------------------------------------------------
INSERT INTO vehicles (name, slug, type, seats, has_ac, fuel, with_driver, price_per_day, description, urgency_badge, status, sort_order)
VALUES
  ('Toyota Land Cruiser V8', 'toyota-land-cruiser-v8', 'Land Cruiser', 6, TRUE, 'Diesel', TRUE, 35000, 'Premium 4x4 for high-altitude terrain — ideal for Skardu, Khaplu and Deosai.', 'Selling fast — book soon', 'active', 1),
  ('Toyota Prado', 'toyota-prado', 'Prado', 6, TRUE, 'Diesel', TRUE, 28000, 'Comfortable and capable SUV for mountain roads with an experienced driver.', 'Only 2 left this month', 'active', 2),
  ('Toyota Hiace Grand Cabin', 'toyota-hiace-grand-cabin', 'Hiace', 13, TRUE, 'Diesel', TRUE, 22000, 'Spacious van for families and groups touring Gilgit-Baltistan.', '9 viewing now', 'active', 3),
  ('Toyota Corolla', 'toyota-corolla', 'Sedan', 4, TRUE, 'Petrol', TRUE, 12000, 'Economical sedan for city transfers and short trips.', NULL, 'active', 4)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO by_air_packages (title, slug, destination, flight_duration, road_duration, duration_days, duration_nights, price_per_person, description, is_featured, urgency_badge, status, sort_order)
VALUES
  ('Skardu by Air — 4 Days Express', 'skardu-by-air-4-days', 'Skardu', '50 min', '18 hrs', 4, 3, 89000, 'Fly to Skardu in 50 minutes instead of an 18-hour road journey and spend more time exploring Shangrila, Shigar and Khaplu.', TRUE, 'Booked 3 times this week', 'active', 1),
  ('Gilgit by Air — 5 Days Hunza Special', 'gilgit-by-air-5-days-hunza', 'Gilgit', '1 hr', '16 hrs', 5, 4, 99000, 'Direct flight to Gilgit, then straight to the Hunza valley — Attabad Lake, Passu Cones and Khunjerab Pass.', FALSE, 'Only 3 slots left this month', 'active', 2)
ON CONFLICT (slug) DO NOTHING;

-- ===== 2/4: supabase-migration-tours.sql =====
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

-- ===== 3/4: supabase-migration-packages.sql =====
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

-- ===== 4/4: supabase-migration-tags.sql =====
-- =====================================================
-- MIGRATION: Normalized tags (TourTag + tour_tags M2M)
-- Additive & idempotent. Run AFTER supabase-migration-packages.sql
-- (it backfills from the tours.tags JSON cache added there).
-- =====================================================

-- Tag definitions
CREATE TABLE IF NOT EXISTS tags (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tour <-> Tag many-to-many
CREATE TABLE IF NOT EXISTS tour_tags (
  tour_id INTEGER NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
  tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (tour_id, tag_id)
);

CREATE INDEX IF NOT EXISTS idx_tour_tags_tour ON tour_tags(tour_id);
CREATE INDEX IF NOT EXISTS idx_tour_tags_tag ON tour_tags(tag_id);

-- RLS (matches project convention)
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE tour_tags ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all for anon on tags" ON tags;
CREATE POLICY "Enable all for anon on tags" ON tags FOR ALL TO anon USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Enable all for anon on tour_tags" ON tour_tags;
CREATE POLICY "Enable all for anon on tour_tags" ON tour_tags FOR ALL TO anon USING (true) WITH CHECK (true);

-- Backfill from the tours.tags JSON cache (only array-shaped values).
INSERT INTO tags (name, slug)
SELECT DISTINCT trim(elem), lower(regexp_replace(trim(elem), '[^a-zA-Z0-9]+', '-', 'g'))
FROM tours t
CROSS JOIN LATERAL jsonb_array_elements_text(t.tags::jsonb) AS elem
WHERE t.tags IS NOT NULL AND t.tags LIKE '[%' AND trim(elem) <> ''
ON CONFLICT (name) DO NOTHING;

INSERT INTO tour_tags (tour_id, tag_id)
SELECT t.id, tg.id
FROM tours t
CROSS JOIN LATERAL jsonb_array_elements_text(t.tags::jsonb) AS elem
JOIN tags tg ON tg.name = trim(elem)
WHERE t.tags IS NOT NULL AND t.tags LIKE '[%'
ON CONFLICT (tour_id, tag_id) DO NOTHING;
