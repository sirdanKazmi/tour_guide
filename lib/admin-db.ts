import { getDatabase } from './db';

// ============================================
// BOOKING FUNCTIONS
// ============================================

export interface Booking {
  id?: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_cnic?: string;
  tour_name: string;
  tour_id?: number;
  travel_date: string;
  people_count: number;
  price_per_person: number;
  total_price: number;
  payment_status: 'unpaid' | 'partial' | 'paid';
  booking_status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  special_requests?: string;
  admin_notes?: string;
  created_at?: string;
  updated_at?: string;
}

export function getAllBookings(filters?: {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}): Booking[] {
  const db = getDatabase();
  let query = 'SELECT * FROM bookings WHERE 1=1';
  const params: any[] = [];

  if (filters?.status) {
    query += ' AND booking_status = ?';
    params.push(filters.status);
  }

  if (filters?.dateFrom) {
    query += ' AND travel_date >= ?';
    params.push(filters.dateFrom);
  }

  if (filters?.dateTo) {
    query += ' AND travel_date <= ?';
    params.push(filters.dateTo);
  }

  if (filters?.search) {
    query += ' AND (customer_name LIKE ? OR id LIKE ?)';
    params.push(`%${filters.search}%`, `%${filters.search}%`);
  }

  query += ' ORDER BY created_at DESC';
  const stmt = db.prepare(query);
  return stmt.all(...params) as Booking[];
}

export function getBookingById(id: number): Booking | undefined {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM bookings WHERE id = ?');
  return stmt.get(id) as Booking | undefined;
}

export function createBooking(booking: Omit<Booking, 'id' | 'created_at' | 'updated_at'>): number {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT INTO bookings (customer_name, customer_email, customer_phone, customer_cnic, 
      tour_name, tour_id, travel_date, people_count, price_per_person, total_price, 
      payment_status, booking_status, special_requests, admin_notes)
    VALUES (@customer_name, @customer_email, @customer_phone, @customer_cnic, 
      @tour_name, @tour_id, @travel_date, @people_count, @price_per_person, @total_price, 
      @payment_status, @booking_status, @special_requests, @admin_notes)
  `);
  const result = stmt.run(booking);
  return result.lastInsertRowid as number;
}

export function updateBooking(id: number, booking: Partial<Booking>): void {
  const db = getDatabase();
  const fields = Object.keys(booking).filter(k => k !== 'id');
  const setClause = fields.map(f => `${f} = @${f}`).join(', ');
  
  const stmt = db.prepare(`
    UPDATE bookings 
    SET ${setClause}, updated_at = CURRENT_TIMESTAMP
    WHERE id = @id
  `);
  stmt.run({ ...booking, id });
}

export function deleteBooking(id: number): void {
  const db = getDatabase();
  const stmt = db.prepare('DELETE FROM bookings WHERE id = ?');
  stmt.run(id);
}

export function getRecentBookings(limit: number = 5): Booking[] {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM bookings ORDER BY created_at DESC LIMIT ?');
  return stmt.all(limit) as Booking[];
}

export function getPendingBookings(): Booking[] {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM bookings WHERE booking_status = ? ORDER BY created_at DESC');
  return stmt.all('pending') as Booking[];
}

// ============================================
// TOUR FUNCTIONS
// ============================================

export interface Tour {
  id?: number;
  tour_name: string;
  destination: string;
  category: 'adventure' | 'family' | 'honeymoon' | 'group' | 'religious';
  description?: string;
  duration: string;
  price_per_person: number;
  max_seats: number;
  available_seats: number;
  departure_city: string;
  inclusions?: string;
  exclusions?: string;
  itinerary?: string;
  cover_image?: string;
  status: 'active' | 'inactive' | 'coming_soon';
  created_at?: string;
  updated_at?: string;
}

export function getAllTours(filters?: {
  status?: string;
  category?: string;
  destination?: string;
}): Tour[] {
  const db = getDatabase();
  let query = 'SELECT * FROM tours WHERE 1=1';
  const params: any[] = [];

  if (filters?.status) {
    query += ' AND status = ?';
    params.push(filters.status);
  }

  if (filters?.category) {
    query += ' AND category = ?';
    params.push(filters.category);
  }

  if (filters?.destination) {
    query += ' AND destination = ?';
    params.push(filters.destination);
  }

  query += ' ORDER BY created_at DESC';
  const stmt = db.prepare(query);
  return stmt.all(...params) as Tour[];
}

export function getTourById(id: number): Tour | undefined {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM tours WHERE id = ?');
  return stmt.get(id) as Tour | undefined;
}

export function createTour(tour: Omit<Tour, 'id' | 'created_at' | 'updated_at'>): number {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT INTO tours (tour_name, destination, category, description, duration, 
      price_per_person, max_seats, available_seats, departure_city, inclusions, 
      exclusions, itinerary, cover_image, status)
    VALUES (@tour_name, @destination, @category, @description, @duration, 
      @price_per_person, @max_seats, @available_seats, @departure_city, @inclusions, 
      @exclusions, @itinerary, @cover_image, @status)
  `);
  const result = stmt.run(tour);
  return result.lastInsertRowid as number;
}

export function updateTour(id: number, tour: Partial<Tour>): void {
  const db = getDatabase();
  const fields = Object.keys(tour).filter(k => k !== 'id');
  const setClause = fields.map(f => `${f} = @${f}`).join(', ');
  
  const stmt = db.prepare(`
    UPDATE tours 
    SET ${setClause}, updated_at = CURRENT_TIMESTAMP
    WHERE id = @id
  `);
  stmt.run({ ...tour, id });
}

export function deleteTour(id: number): void {
  const db = getDatabase();
  const stmt = db.prepare('DELETE FROM tours WHERE id = ?');
  stmt.run(id);
}

export function getActiveTours(): Tour[] {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM tours WHERE status = ? ORDER BY tour_name');
  return stmt.all('active') as Tour[];
}

// ============================================
// CUSTOMER FUNCTIONS
// ============================================

export interface Customer {
  id?: number;
  name: string;
  email?: string;
  phone?: string;
  city?: string;
  cnic?: string;
  total_bookings: number;
  total_spent: number;
  registered_date?: string;
  admin_notes?: string;
  created_at?: string;
  updated_at?: string;
}

export function getAllCustomers(search?: string): Customer[] {
  const db = getDatabase();
  
  // Query to get unique customers from bookings table with aggregated stats
  let query = `
    SELECT 
      customer_name as name,
      customer_email as email,
      customer_phone as phone,
      COUNT(*) as total_bookings,
      COALESCE(SUM(total_price), 0) as total_spent,
      MIN(created_at) as created_at
    FROM bookings
    WHERE 1=1
  `;
  const params: any[] = [];

  if (search) {
    query += ' AND (customer_name LIKE ? OR customer_email LIKE ? OR customer_phone LIKE ?)';
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  query += `
    GROUP BY customer_email, customer_name, customer_phone
    ORDER BY created_at DESC
  `;
  
  const stmt = db.prepare(query);
  const results = stmt.all(...params) as any[];
  
  // Convert to Customer interface format
  return results.map((row, index) => ({
    id: index + 1, // Temporary ID for display
    name: row.name,
    email: row.email || '',
    phone: row.phone || '',
    total_bookings: row.total_bookings,
    total_spent: row.total_spent,
    created_at: row.created_at,
  })) as Customer[];
}

export function getCustomerById(id: number): Customer | undefined {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM customers WHERE id = ?');
  return stmt.get(id) as Customer | undefined;
}

export function createCustomer(customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>): number {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT INTO customers (name, email, phone, city, cnic, total_bookings, total_spent, admin_notes)
    VALUES (@name, @email, @phone, @city, @cnic, @total_bookings, @total_spent, @admin_notes)
  `);
  const result = stmt.run(customer);
  return result.lastInsertRowid as number;
}

export function updateCustomer(id: number, customer: Partial<Customer>): void {
  const db = getDatabase();
  const fields = Object.keys(customer).filter(k => k !== 'id');
  const setClause = fields.map(f => `${f} = @${f}`).join(', ');
  
  const stmt = db.prepare(`
    UPDATE customers 
    SET ${setClause}, updated_at = CURRENT_TIMESTAMP
    WHERE id = @id
  `);
  stmt.run({ ...customer, id });
}

// ============================================
// INQUIRY FUNCTIONS
// ============================================

export interface Inquiry {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  replied_at?: string;
  created_at?: string;
}

export function getAllInquiries(status?: string): Inquiry[] {
  const db = getDatabase();
  let query = 'SELECT * FROM inquiries WHERE 1=1';
  const params: any[] = [];

  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }

  query += ' ORDER BY created_at DESC';
  const stmt = db.prepare(query);
  return stmt.all(...params) as Inquiry[];
}

export function createInquiry(inquiry: Omit<Inquiry, 'id' | 'created_at'>): number {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT INTO inquiries (name, email, phone, message, status)
    VALUES (@name, @email, @phone, @message, @status)
  `);
  const result = stmt.run(inquiry);
  return result.lastInsertRowid as number;
}

export function updateInquiryStatus(id: number, status: 'new' | 'read' | 'replied'): void {
  const db = getDatabase();
  const stmt = db.prepare(`
    UPDATE inquiries 
    SET status = ?, replied_at = CASE WHEN ? = 'replied' THEN CURRENT_TIMESTAMP ELSE replied_at END
    WHERE id = ?
  `);
  stmt.run(status, status, id);
}

export function deleteInquiry(id: number): void {
  const db = getDatabase();
  const stmt = db.prepare('DELETE FROM inquiries WHERE id = ?');
  stmt.run(id);
}

export function getUnreadInquiries(): Inquiry[] {
  const db = getDatabase();
  const stmt = db.prepare("SELECT * FROM inquiries WHERE status = 'new' ORDER BY created_at DESC");
  return stmt.all() as Inquiry[];
}

// ============================================
// PAYMENT FUNCTIONS
// ============================================

export interface Payment {
  id?: number;
  booking_id: number;
  customer_name: string;
  amount: number;
  payment_method: 'cash' | 'bank_transfer' | 'easypaisa' | 'jazzcash' | 'online';
  payment_date?: string;
  status: 'pending' | 'received' | 'refunded';
  transaction_id?: string;
  notes?: string;
  created_at?: string;
}

export function getAllPayments(filters?: {
  method?: string;
  status?: string;
}): Payment[] {
  const db = getDatabase();
  let query = 'SELECT * FROM payments WHERE 1=1';
  const params: any[] = [];

  if (filters?.method) {
    query += ' AND payment_method = ?';
    params.push(filters.method);
  }

  if (filters?.status) {
    query += ' AND status = ?';
    params.push(filters.status);
  }

  query += ' ORDER BY created_at DESC';
  const stmt = db.prepare(query);
  return stmt.all(...params) as Payment[];
}

export function createPayment(payment: Omit<Payment, 'id' | 'created_at'>): number {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT INTO payments (booking_id, customer_name, amount, payment_method, status, transaction_id, notes)
    VALUES (@booking_id, @customer_name, @amount, @payment_method, @status, @transaction_id, @notes)
  `);
  const result = stmt.run(payment);
  return result.lastInsertRowid as number;
}

export function updatePayment(id: number, payment: Partial<Payment>): void {
  const db = getDatabase();
  const fields = Object.keys(payment).filter(k => k !== 'id');
  const setClause = fields.map(f => `${f} = @${f}`).join(', ');
  
  const stmt = db.prepare(`
    UPDATE payments 
    SET ${setClause}
    WHERE id = @id
  `);
  stmt.run({ ...payment, id });
}

export function getRevenueSummary(): {
  today: number;
  thisWeek: number;
  thisMonth: number;
  total: number;
} {
  const db = getDatabase();
  
  const today = db.prepare(
    "SELECT COALESCE(SUM(total_price), 0) as total FROM bookings WHERE booking_status = 'completed' AND date(created_at) = date('now')"
  ).get() as { total: number };

  const thisWeek = db.prepare(
    "SELECT COALESCE(SUM(total_price), 0) as total FROM bookings WHERE booking_status = 'completed' AND created_at >= date('now', '-7 days')"
  ).get() as { total: number };

  const thisMonth = db.prepare(
    "SELECT COALESCE(SUM(total_price), 0) as total FROM bookings WHERE booking_status = 'completed' AND created_at >= date('now', '-30 days')"
  ).get() as { total: number };

  const total = db.prepare(
    "SELECT COALESCE(SUM(total_price), 0) as total FROM bookings WHERE booking_status = 'completed'"
  ).get() as { total: number };

  return {
    today: today.total,
    thisWeek: thisWeek.total,
    thisMonth: thisMonth.total,
    total: total.total
  };
}

export function getDailyRevenue(days: number = 30): { date: string; revenue: number }[] {
  const db = getDatabase();
  
  const query = `
    SELECT 
      date(created_at) as date,
      COALESCE(SUM(total_price), 0) as revenue
    FROM bookings 
    WHERE booking_status = 'completed' 
      AND created_at >= date('now', '-' || ? || ' days')
    GROUP BY date(created_at)
    ORDER BY date ASC
  `;
  
  return db.prepare(query).all(days) as { date: string; revenue: number }[];
}

// ============================================
// REVIEW FUNCTIONS
// ============================================

export interface Review {
  id?: number;
  customer_name: string;
  tour_name: string;
  rating: number;
  review_text?: string;
  status: 'pending' | 'approved' | 'rejected';
  is_featured: boolean;
  created_at?: string;
  updated_at?: string;
}

export function getAllReviews(status?: string): Review[] {
  const db = getDatabase();
  let query = 'SELECT * FROM reviews WHERE 1=1';
  const params: any[] = [];

  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }

  query += ' ORDER BY created_at DESC';
  const stmt = db.prepare(query);
  return stmt.all(...params) as Review[];
}

export function createReview(review: Omit<Review, 'id' | 'created_at' | 'updated_at'>): number {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT INTO reviews (customer_name, tour_name, rating, review_text, status, is_featured)
    VALUES (@customer_name, @tour_name, @rating, @review_text, @status, @is_featured)
  `);
  const result = stmt.run(review);
  return result.lastInsertRowid as number;
}

export function updateReviewStatus(id: number, status: 'pending' | 'approved' | 'rejected'): void {
  const db = getDatabase();
  const stmt = db.prepare(`
    UPDATE reviews 
    SET status = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);
  stmt.run(status, id);
}

export function toggleFeaturedReview(id: number, is_featured: boolean): void {
  const db = getDatabase();
  const stmt = db.prepare(`
    UPDATE reviews 
    SET is_featured = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);
  stmt.run(is_featured ? 1 : 0, id);
}

export function deleteReview(id: number): void {
  const db = getDatabase();
  const stmt = db.prepare('DELETE FROM reviews WHERE id = ?');
  stmt.run(id);
}

export function getApprovedReviews(): Review[] {
  const db = getDatabase();
  const stmt = db.prepare("SELECT * FROM reviews WHERE status = 'approved' ORDER BY created_at DESC");
  return stmt.all() as Review[];
}

// ============================================
// NOTIFICATION FUNCTIONS
// ============================================

export interface Notification {
  id?: number;
  type: 'new_booking' | 'new_inquiry' | 'new_review' | 'payment_received';
  title: string;
  message: string;
  reference_id?: number;
  is_read: boolean;
  created_at?: string;
}

export function getAllNotifications(limit?: number): Notification[] {
  const db = getDatabase();
  let query = 'SELECT * FROM notifications ORDER BY created_at DESC';
  
  if (limit) {
    query += ` LIMIT ${limit}`;
  }
  
  const stmt = db.prepare(query);
  return stmt.all() as Notification[];
}

export function createNotification(notification: Omit<Notification, 'id' | 'created_at'>): number {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT INTO notifications (type, title, message, reference_id, is_read)
    VALUES (@type, @title, @message, @reference_id, @is_read)
  `);
  const result = stmt.run(notification);
  return result.lastInsertRowid as number;
}

export function markNotificationAsRead(id: number): void {
  const db = getDatabase();
  const stmt = db.prepare('UPDATE notifications SET is_read = 1 WHERE id = ?');
  stmt.run(id);
}

export function markAllNotificationsAsRead(): void {
  const db = getDatabase();
  const stmt = db.prepare('UPDATE notifications SET is_read = 1 WHERE is_read = 0');
  stmt.run();
}

export function getUnreadNotificationCount(): number {
  const db = getDatabase();
  const result = db.prepare('SELECT COUNT(*) as count FROM notifications WHERE is_read = 0').get() as { count: number };
  return result.count;
}

// ============================================
// SETTINGS FUNCTIONS
// ============================================

export interface Setting {
  id?: number;
  setting_key: string;
  setting_value: string;
  updated_at?: string;
}

export function getSetting(key: string): string | null {
  const db = getDatabase();
  const stmt = db.prepare('SELECT setting_value FROM settings WHERE setting_key = ?');
  const result = stmt.get(key) as Setting | undefined;
  return result?.setting_value || null;
}

export function setSetting(key: string, value: string): void {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT INTO settings (setting_key, setting_value) 
    VALUES (?, ?) 
    ON CONFLICT(setting_key) DO UPDATE SET setting_value = ?, updated_at = CURRENT_TIMESTAMP
  `);
  stmt.run(key, value, value);
}

export function getAllSettings(): Record<string, string> {
  const db = getDatabase();
  const stmt = db.prepare('SELECT setting_key, setting_value FROM settings');
  const rows = stmt.all() as Setting[];
  
  const settings: Record<string, string> = {};
  rows.forEach(row => {
    settings[row.setting_key] = row.setting_value;
  });
  
  return settings;
}

// ============================================
// STAFF FUNCTIONS
// ============================================

export interface Staff {
  id?: number;
  name: string;
  role: 'manager' | 'support' | 'guide';
  email: string;
  phone?: string;
  password: string;
  is_active: boolean;
  assigned_bookings?: string;
  created_at?: string;
  updated_at?: string;
}

export function getAllStaff(): Staff[] {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM staff ORDER BY name');
  return stmt.all() as Staff[];
}

export function getStaffById(id: number): Staff | undefined {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM staff WHERE id = ?');
  return stmt.get(id) as Staff | undefined;
}

export function createStaff(staff: Omit<Staff, 'id' | 'created_at' | 'updated_at'>): number {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT INTO staff (name, role, email, phone, password, is_active, assigned_bookings)
    VALUES (@name, @role, @email, @phone, @password, @is_active, @assigned_bookings)
  `);
  const result = stmt.run(staff);
  return result.lastInsertRowid as number;
}

export function updateStaff(id: number, staff: Partial<Staff>): void {
  const db = getDatabase();
  const fields = Object.keys(staff).filter(k => k !== 'id');
  const setClause = fields.map(f => `${f} = @${f}`).join(', ');
  
  const stmt = db.prepare(`
    UPDATE staff 
    SET ${setClause}, updated_at = CURRENT_TIMESTAMP
    WHERE id = @id
  `);
  stmt.run({ ...staff, id });
}

export function deleteStaff(id: number): void {
  const db = getDatabase();
  const stmt = db.prepare('DELETE FROM staff WHERE id = ?');
  stmt.run(id);
}
