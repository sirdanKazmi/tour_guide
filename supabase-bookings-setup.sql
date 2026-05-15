-- =====================================================
-- SUPABASE BOOKINGS TABLE SETUP
-- Run this SQL in your Supabase SQL Editor
-- =====================================================

-- Step 1: Drop existing table (WARNING: This deletes all data!)
DROP TABLE IF EXISTS bookings;

-- Step 2: Create bookings table with all required columns
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_cnic TEXT,
  tour_name TEXT NOT NULL,
  tour_id INTEGER,
  travel_date DATE,
  people_count INTEGER DEFAULT 1,
  price_per_person NUMERIC DEFAULT 0,
  total_price NUMERIC DEFAULT 0,
  payment_status TEXT DEFAULT 'unpaid',
  booking_status TEXT DEFAULT 'pending',
  special_requests TEXT,
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Enable Row Level Security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Step 4: Create policies for public access
-- Allow anyone to INSERT (for public booking form)
CREATE POLICY "Enable insert for all users"
  ON bookings
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anyone to SELECT (for viewing bookings)
CREATE POLICY "Enable select for all users"
  ON bookings
  FOR SELECT
  TO anon
  USING (true);

-- Allow anyone to UPDATE (for admin panel)
CREATE POLICY "Enable update for all users"
  ON bookings
  FOR UPDATE
  TO anon
  USING (true);

-- Allow anyone to DELETE (for admin panel)
CREATE POLICY "Enable delete for all users"
  ON bookings
  FOR DELETE
  TO anon
  USING (true);

-- Step 5: Create index for better performance
CREATE INDEX idx_bookings_email ON bookings(customer_email);
CREATE INDEX idx_bookings_status ON bookings(booking_status);
CREATE INDEX idx_bookings_date ON bookings(travel_date);

-- =====================================================
-- VERIFICATION
-- Run this to verify the table was created correctly:
-- SELECT column_name, data_type FROM information_schema.columns 
-- WHERE table_name = 'bookings' ORDER BY ordinal_position;
-- =====================================================
