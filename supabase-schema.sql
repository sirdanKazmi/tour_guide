-- =====================================================
-- SUPABASE DATABASE SETUP SCHEMA
-- Run this SQL in your Supabase SQL Editor
-- =====================================================

-- Drop existing tables (Warning: This deletes all data!)
DROP TABLE IF EXISTS newsletter_subscribers CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS inquiries CASCADE;
DROP TABLE IF EXISTS tour_images CASCADE;
DROP TABLE IF EXISTS tour_dates CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS tours CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;
DROP TABLE IF EXISTS settings CASCADE;
DROP TABLE IF EXISTS staff CASCADE;
DROP TABLE IF EXISTS videos CASCADE;
DROP TABLE IF EXISTS gallery_items CASCADE;

-- 1. Admin Users Table
CREATE TABLE admin_users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tours Table
CREATE TABLE tours (
  id SERIAL PRIMARY KEY,
  tour_name TEXT NOT NULL,
  destination TEXT NOT NULL,
  category TEXT NOT NULL CHECK(category IN ('adventure', 'family', 'honeymoon', 'group', 'religious')),
  description TEXT,
  duration TEXT NOT NULL,
  price_per_person NUMERIC DEFAULT 0,
  max_seats INTEGER NOT NULL,
  available_seats INTEGER NOT NULL,
  departure_city TEXT NOT NULL,
  inclusions TEXT,
  exclusions TEXT,
  itinerary TEXT,
  cover_image TEXT,
  status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive', 'coming_soon')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Bookings Table
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
  payment_status TEXT DEFAULT 'unpaid' CHECK(payment_status IN ('unpaid', 'partial', 'paid')),
  booking_status TEXT DEFAULT 'pending' CHECK(booking_status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  special_requests TEXT,
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tour Dates Table
CREATE TABLE tour_dates (
  id SERIAL PRIMARY KEY,
  tour_id INTEGER NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
  departure_date DATE NOT NULL,
  available_seats INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tour Images Table
CREATE TABLE tour_images (
  id SERIAL PRIMARY KEY,
  tour_id INTEGER NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Customers Table
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  city TEXT,
  cnic TEXT,
  total_bookings INTEGER DEFAULT 0,
  total_spent NUMERIC DEFAULT 0,
  registered_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Inquiries Table (contact form submissions)
CREATE TABLE inquiries (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  trip_dates TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK(status IN ('new', 'read', 'replied')),
  replied_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Payments Table
CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  amount NUMERIC DEFAULT 0,
  payment_method TEXT NOT NULL CHECK(payment_method IN ('cash', 'bank_transfer', 'easypaisa', 'jazzcash', 'online')),
  payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'received', 'refunded')),
  transaction_id TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Reviews Table
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  customer_name TEXT NOT NULL,
  tour_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
  review_text TEXT,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Notifications Table
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  type TEXT NOT NULL CHECK(type IN ('new_booking', 'new_inquiry', 'new_review', 'payment_received')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  reference_id INTEGER,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Settings Table
CREATE TABLE settings (
  id SERIAL PRIMARY KEY,
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. Staff Table
CREATE TABLE staff (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('manager', 'support', 'guide')),
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  password TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  assigned_bookings TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. Videos Table
CREATE TABLE videos (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. Gallery Items Table (supports both images and videos)
CREATE TABLE gallery_items (
  id SERIAL PRIMARY KEY,
  type TEXT NOT NULL CHECK(type IN ('image', 'video')),
  category TEXT NOT NULL,
  title TEXT,
  description TEXT,
  media_url TEXT NOT NULL,
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 15. Newsletter Subscribers Table
CREATE TABLE newsletter_subscribers (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Apply triggers for auto-updating updated_at
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tours_updated_at BEFORE UPDATE ON tours FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_staff_updated_at BEFORE UPDATE ON staff FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON videos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_gallery_items_updated_at BEFORE UPDATE ON gallery_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create daily revenue RPC function for admin panel
CREATE OR REPLACE FUNCTION get_daily_revenue(num_days integer)
RETURNS TABLE(date date, revenue numeric)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    travel_date::date as date,
    COALESCE(SUM(total_price), 0)::numeric as revenue
  FROM 
    bookings
  WHERE 
    booking_status = 'completed'
    AND travel_date >= (CURRENT_DATE - num_days)
  GROUP BY 
    travel_date::date
  ORDER BY 
    travel_date::date ASC;
END;
$$;

-- Create indexes for performance
CREATE INDEX idx_bookings_email ON bookings(customer_email);
CREATE INDEX idx_bookings_status ON bookings(booking_status);
CREATE INDEX idx_bookings_date ON bookings(travel_date);
CREATE INDEX idx_bookings_tour_id ON bookings(tour_id);
CREATE INDEX idx_tours_status ON tours(status);
CREATE INDEX idx_tours_category ON tours(category);
CREATE INDEX idx_tours_destination ON tours(destination);
CREATE INDEX idx_tour_dates_tour_id ON tour_dates(tour_id);
CREATE INDEX idx_tour_images_tour_id ON tour_images(tour_id);
CREATE INDEX idx_inquiries_status ON inquiries(status);
CREATE INDEX idx_payments_booking_id ON payments(booking_id);
CREATE INDEX idx_reviews_status ON reviews(status);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_staff_role ON staff(role);
CREATE INDEX idx_videos_category ON videos(category);
CREATE INDEX idx_gallery_category ON gallery_items(category);
CREATE INDEX idx_gallery_type ON gallery_items(type);

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE tour_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE tour_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow unrestricted operations for anonymous role (via NEXT_PUBLIC_SUPABASE_ANON_KEY)
CREATE POLICY "Enable all for anon on admin_users" ON admin_users FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for anon on bookings" ON bookings FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for anon on tours" ON tours FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for anon on tour_dates" ON tour_dates FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for anon on tour_images" ON tour_images FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for anon on customers" ON customers FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for anon on inquiries" ON inquiries FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for anon on payments" ON payments FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for anon on reviews" ON reviews FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for anon on notifications" ON notifications FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for anon on settings" ON settings FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for anon on staff" ON staff FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for anon on videos" ON videos FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for anon on gallery_items" ON gallery_items FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for anon on newsletter_subscribers" ON newsletter_subscribers FOR ALL TO anon USING (true) WITH CHECK (true);
