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
