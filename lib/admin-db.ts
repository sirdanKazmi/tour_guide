import { supabase } from './supabaseClient';
import bcrypt from 'bcryptjs';

// ============================================
// ADMIN AUTH FUNCTIONS
// ============================================

export interface AdminUser {
  id?: number;
  username: string;
  password?: string;
  created_at?: string;
}

export async function getAdminByUsername(username: string): Promise<AdminUser | undefined> {
  const { data, error } = await supabase
    .from('admin_users')
    .select('*')
    .eq('username', username)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data as AdminUser | undefined;
}

export async function createAdmin(username: string, password: string): Promise<number> {
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const { data, error } = await supabase
    .from('admin_users')
    .insert([{ username, password: hashedPassword }])
    .select('id')
    .single();

  if (error) throw error;
  return data?.id || 0;
}

export async function verifyAdminPassword(admin: AdminUser, password: string): Promise<boolean> {
  if (!admin.password) return false;
  return bcrypt.compare(password, admin.password);
}

// ============================================
// BOOKING FUNCTIONS
// ============================================

export interface Booking {
  id?: number;
  reference?: string;
  booking_type?: 'tour' | 'vehicle' | 'custom' | 'by_air';
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_cnic?: string;
  tour_name: string;
  tour_id?: number;
  vehicle_id?: number;
  by_air_id?: number;
  package_option_id?: number;
  option_code?: string;
  travel_date: string;
  duration_days?: number;
  people_count: number;
  rooms?: number;
  selected_tier?: string;
  add_vehicle?: string;
  price_per_person: number;
  total_price: number;
  payment_status: 'unpaid' | 'partial' | 'paid';
  booking_status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  special_requests?: string;
  admin_notes?: string;
  source?: 'web' | 'whatsapp';
  created_at?: string;
  updated_at?: string;
}

// Generate a human-friendly booking reference in the form "SFM-XXXXXXX"
export function generateBookingReference(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no ambiguous chars (0/O, 1/I)
  let code = '';
  for (let i = 0; i < 7; i += 1) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `SFM-${code}`;
}

export async function getBookingByReference(reference: string): Promise<Booking | undefined> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('reference', reference.trim().toUpperCase())
    .maybeSingle();

  if (error && error.code !== 'PGRST116') throw error;
  return (data || undefined) as Booking | undefined;
}

export async function getAllBookings(filters?: {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}): Promise<Booking[]> {
  let query = supabase.from('bookings').select('*');

  if (filters?.status) {
    query = query.eq('booking_status', filters.status);
  }

  if (filters?.dateFrom) {
    query = query.gte('travel_date', filters.dateFrom);
  }

  if (filters?.dateTo) {
    query = query.lte('travel_date', filters.dateTo);
  }

  if (filters?.search) {
    query = query.or(`customer_name.ilike.%${filters.search}%,id.ilike.%${filters.search}%`);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as Booking[];
}

export async function getBookingById(id: number): Promise<Booking | undefined> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data as Booking | undefined;
}

export async function createBooking(booking: Omit<Booking, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
  const { data, error } = await supabase
    .from('bookings')
    .insert([booking])
    .select('id')
    .single();

  if (error) throw error;
  return data?.id || 0;
}

export async function updateBooking(id: number, booking: Partial<Booking>): Promise<void> {
  const { error } = await supabase
    .from('bookings')
    .update(booking)
    .eq('id', id);

  if (error) throw error;
}

export async function deleteBooking(id: number): Promise<void> {
  const { error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getRecentBookings(limit: number = 5): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data || []) as Booking[];
}

export async function getPendingBookings(): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('booking_status', 'pending')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as Booking[];
}

// ============================================
// TOUR FUNCTIONS
// ============================================

export interface Tour {
  id?: number;
  tour_name: string;
  slug?: string;
  destination: string;
  category: string;
  travel_mode?: string;              // 'By Road' | 'By Air'
  description?: string;              // trip overview
  duration: string;
  duration_days?: number;
  duration_nights?: number;
  price_per_person: number;          // starting price
  max_seats: number;
  available_seats: number;
  departure_city: string;
  rating?: number;
  is_featured?: boolean;
  urgency_badge?: string;
  group_size?: string;
  accommodation_summary?: string;
  meals_summary?: string;
  inclusions?: string;
  exclusions?: string;
  itinerary?: string;                // legacy plain-text itinerary
  itinerary_json?: string;           // JSON [{day_no,title,description,activities[]}]
  pricing_tiers?: string;            // JSON [{name,blurb,price,is_popular}] (simple tours)
  gallery?: string;                  // JSON [url]
  related_tour_ids?: string;         // JSON [id]
  cover_image?: string;
  sort_order?: number;
  // rich "as per need" fields
  itinerary_code?: string;
  transport_label?: string;
  availability?: string;
  highlights?: string;               // JSON []
  videos?: string;                   // JSON [{title,youtube_id}]
  tags?: string;                     // JSON [] tag names
  map_lat?: number;
  map_lng?: number;
  map_embed_url?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  status: 'active' | 'inactive' | 'coming_soon';
  created_at?: string;
  updated_at?: string;
}

function tourSlugify(input: string): string {
  return input.toLowerCase().trim().replace(/['"]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
}

async function uniqueTourSlug(base: string, ignoreId?: number): Promise<string> {
  const root = tourSlugify(base) || 'tour';
  let candidate = root;
  let n = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    let query = supabase.from('tours').select('id').eq('slug', candidate);
    if (ignoreId) query = query.neq('id', ignoreId);
    const { data, error } = await query.maybeSingle();
    if (error && error.code !== 'PGRST116') throw error;
    if (!data) return candidate;
    n += 1;
    candidate = `${root}-${n}`;
  }
}

export async function getAllTours(filters?: {
  status?: string;
  category?: string;
  destination?: string;
}): Promise<Tour[]> {
  let query = supabase.from('tours').select('*');

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.category) {
    query = query.eq('category', filters.category);
  }

  if (filters?.destination) {
    query = query.eq('destination', filters.destination);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as Tour[];
}

export async function getTourById(id: number): Promise<Tour | undefined> {
  const { data, error } = await supabase
    .from('tours')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data as Tour | undefined;
}

export async function createTour(tour: Omit<Tour, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
  const slug = await uniqueTourSlug(tour.slug || tour.tour_name);
  const { data, error } = await supabase
    .from('tours')
    .insert([{ ...tour, slug }])
    .select('id')
    .single();

  if (error) throw error;
  return data?.id || 0;
}

export async function updateTour(id: number, tour: Partial<Tour>): Promise<void> {
  const payload = { ...tour };
  // Keep slug stable for SEO: only change it when a non-empty slug is explicitly provided.
  if (!payload.slug) {
    delete payload.slug;
  } else {
    payload.slug = await uniqueTourSlug(payload.slug, id);
  }
  const { error } = await supabase
    .from('tours')
    .update(payload)
    .eq('id', id);

  if (error) throw error;
}

export async function deleteTour(id: number): Promise<void> {
  const { error } = await supabase
    .from('tours')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getActiveTours(): Promise<Tour[]> {
  const { data, error } = await supabase
    .from('tours')
    .select('*')
    .eq('status', 'active')
    .order('tour_name', { ascending: true });

  if (error) throw error;
  return (data || []) as Tour[];
}

export async function getTourBySlug(slug: string): Promise<Tour | undefined> {
  const { data, error } = await supabase.from('tours').select('*').eq('slug', slug).maybeSingle();
  if (error && error.code !== 'PGRST116') throw error;
  return (data || undefined) as Tour | undefined;
}

export async function getFeaturedTours(limit = 6): Promise<Tour[]> {
  const { data, error } = await supabase
    .from('tours')
    .select('*')
    .eq('status', 'active')
    .eq('is_featured', true)
    .order('sort_order', { ascending: true })
    .limit(limit);
  if (error) throw error;
  return (data || []) as Tour[];
}

export interface TourFilters {
  category?: string;
  destination?: string;
  travel_mode?: string;
  tag?: string;
  minPrice?: number;
  maxPrice?: number;
  minDays?: number;
  maxDays?: number;
  sort?: 'popular' | 'price_asc' | 'price_desc' | 'rating';
}

// Public, active-only tour listing with server-side filtering + sorting.
export async function getPublicTours(filters: TourFilters = {}): Promise<Tour[]> {
  let query = supabase.from('tours').select('*').eq('status', 'active');

  if (filters.tag) {
    const { getTourIdsByTag } = await import('./tags-db');
    const ids = await getTourIdsByTag(filters.tag);
    if (!ids.length) return [];
    query = query.in('id', ids);
  }

  if (filters.category) query = query.ilike('category', filters.category);
  if (filters.destination) query = query.ilike('destination', filters.destination);
  if (filters.travel_mode) query = query.eq('travel_mode', filters.travel_mode);
  if (filters.minPrice != null) query = query.gte('price_per_person', filters.minPrice);
  if (filters.maxPrice != null) query = query.lte('price_per_person', filters.maxPrice);
  if (filters.minDays != null) query = query.gte('duration_days', filters.minDays);
  if (filters.maxDays != null) query = query.lte('duration_days', filters.maxDays);

  switch (filters.sort) {
    case 'price_asc':
      query = query.order('price_per_person', { ascending: true });
      break;
    case 'price_desc':
      query = query.order('price_per_person', { ascending: false });
      break;
    case 'rating':
      query = query.order('rating', { ascending: false });
      break;
    default: // popular
      query = query.order('is_featured', { ascending: false }).order('sort_order', { ascending: true });
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as Tour[];
}

export async function getToursByIds(ids: number[]): Promise<Tour[]> {
  if (!ids.length) return [];
  const { data, error } = await supabase.from('tours').select('*').in('id', ids).eq('status', 'active');
  if (error) throw error;
  return (data || []) as Tour[];
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

export async function getAllCustomers(search?: string): Promise<Customer[]> {
  let query = supabase
    .from('bookings')
    .select('customer_name, customer_email, customer_phone, total_price, created_at, COUNT(*) as total_bookings', {
      count: 'exact',
    });

  if (search) {
    query = query.or(`customer_name.ilike.%${search}%,customer_email.ilike.%${search}%,customer_phone.ilike.%${search}%`);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;

  // Group and aggregate data
  const customerMap = new Map<string, Customer>();
  (data || []).forEach((row: any) => {
    if (!customerMap.has(row.customer_email)) {
      customerMap.set(row.customer_email, {
        name: row.customer_name,
        email: row.customer_email,
        phone: row.customer_phone,
        total_bookings: 0,
        total_spent: 0,
        created_at: row.created_at,
      });
    }
    const customer = customerMap.get(row.customer_email)!;
    customer.total_bookings += 1;
    customer.total_spent += row.total_price || 0;
  });

  return Array.from(customerMap.values());
}

export async function getCustomerById(id: number): Promise<Customer | undefined> {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data as Customer | undefined;
}

export async function createCustomer(customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
  const { data, error } = await supabase
    .from('customers')
    .insert([customer])
    .select('id')
    .single();

  if (error) throw error;
  return data?.id || 0;
}

export async function updateCustomer(id: number, customer: Partial<Customer>): Promise<void> {
  const { error } = await supabase
    .from('customers')
    .update(customer)
    .eq('id', id);

  if (error) throw error;
}

// ============================================
// INQUIRY FUNCTIONS
// ============================================

export interface Inquiry {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  trip_dates?: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  replied_at?: string;
  created_at?: string;
}

export async function getAllInquiries(status?: string): Promise<Inquiry[]> {
  let query = supabase.from('inquiries').select('*');

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as Inquiry[];
}

export async function createInquiry(inquiry: Omit<Inquiry, 'id' | 'created_at'>): Promise<number> {
  const { data, error } = await supabase
    .from('inquiries')
    .insert([inquiry])
    .select('id')
    .single();

  if (error) throw error;
  return data?.id || 0;
}

export async function updateInquiryStatus(id: number, status: 'new' | 'read' | 'replied'): Promise<void> {
  const update: any = { status };
  if (status === 'replied') {
    update.replied_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from('inquiries')
    .update(update)
    .eq('id', id);

  if (error) throw error;
}

export async function deleteInquiry(id: number): Promise<void> {
  const { error } = await supabase
    .from('inquiries')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getUnreadInquiries(): Promise<Inquiry[]> {
  const { data, error } = await supabase
    .from('inquiries')
    .select('*')
    .eq('status', 'new')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as Inquiry[];
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

export async function getAllPayments(filters?: {
  method?: string;
  status?: string;
}): Promise<Payment[]> {
  let query = supabase.from('payments').select('*');

  if (filters?.method) {
    query = query.eq('payment_method', filters.method);
  }

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as Payment[];
}

export async function createPayment(payment: Omit<Payment, 'id' | 'created_at'>): Promise<number> {
  const { data, error } = await supabase
    .from('payments')
    .insert([payment])
    .select('id')
    .single();

  if (error) throw error;
  return data?.id || 0;
}

export async function updatePayment(id: number, payment: Partial<Payment>): Promise<void> {
  const { error } = await supabase
    .from('payments')
    .update(payment)
    .eq('id', id);

  if (error) throw error;
}

export async function getRevenueSummary(): Promise<{
  today: number;
  thisWeek: number;
  thisMonth: number;
  total: number;
}> {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString().split('T')[0];
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const todayResult = await supabase
    .from('bookings')
    .select('total_price')
    .eq('booking_status', 'completed')
    .gte('created_at', today);

  const weekResult = await supabase
    .from('bookings')
    .select('total_price')
    .eq('booking_status', 'completed')
    .gte('created_at', weekAgo);

  const monthResult = await supabase
    .from('bookings')
    .select('total_price')
    .eq('booking_status', 'completed')
    .gte('created_at', monthAgo);

  const totalResult = await supabase
    .from('bookings')
    .select('total_price')
    .eq('booking_status', 'completed');

  const sum = (arr: any[] | null) => (arr || []).reduce((s, r) => s + (r.total_price || 0), 0);

  return {
    today: sum(todayResult.data),
    thisWeek: sum(weekResult.data),
    thisMonth: sum(monthResult.data),
    total: sum(totalResult.data),
  };
}

export async function getDailyRevenue(days: number = 30): Promise<{ date: string; revenue: number }[]> {
  const { data, error } = await supabase.rpc('get_daily_revenue', { num_days: days });

  if (error) throw error;
  return (data || []) as { date: string; revenue: number }[];
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
  review_title?: string;
  trip_type?: string;
  country?: string;
  city?: string;
  score_accommodation?: number;
  score_transport?: number;
  score_meals?: number;
  score_guide?: number;
  score_value?: number;
  score_accuracy?: number;
  status: 'pending' | 'approved' | 'rejected';
  is_featured: boolean;
  created_at?: string;
  updated_at?: string;
}

export async function getAllReviews(status?: string): Promise<Review[]> {
  let query = supabase.from('reviews').select('*');

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as Review[];
}

export async function createReview(review: Omit<Review, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
  const { data, error } = await supabase
    .from('reviews')
    .insert([review])
    .select('id')
    .single();

  if (error) throw error;
  return data?.id || 0;
}

export async function updateReviewStatus(id: number, status: 'pending' | 'approved' | 'rejected'): Promise<void> {
  const { error } = await supabase
    .from('reviews')
    .update({ status })
    .eq('id', id);

  if (error) throw error;
}

export async function toggleFeaturedReview(id: number, is_featured: boolean): Promise<void> {
  const { error } = await supabase
    .from('reviews')
    .update({ is_featured })
    .eq('id', id);

  if (error) throw error;
}

export async function deleteReview(id: number): Promise<void> {
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getApprovedReviews(): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as Review[];
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

export async function getAllNotifications(limit?: number): Promise<Notification[]> {
  let query = supabase.from('notifications').select('*').order('created_at', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) throw error;
  return (data || []) as Notification[];
}

export async function createNotification(notification: Omit<Notification, 'id' | 'created_at'>): Promise<number> {
  const { data, error } = await supabase
    .from('notifications')
    .insert([notification])
    .select('id')
    .single();

  if (error) throw error;
  return data?.id || 0;
}

export async function markNotificationAsRead(id: number): Promise<void> {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', id);

  if (error) throw error;
}

export async function markAllNotificationsAsRead(): Promise<void> {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('is_read', false);

  if (error) throw error;
}

export async function getUnreadNotificationCount(): Promise<number> {
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('is_read', false);

  if (error) throw error;
  return count || 0;
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

export async function getSetting(key: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('settings')
    .select('setting_value')
    .eq('setting_key', key)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data?.setting_value || null;
}

export async function setSetting(key: string, value: string): Promise<void> {
  const { error } = await supabase
    .from('settings')
    .upsert({ setting_key: key, setting_value: value }, { onConflict: 'setting_key' });

  if (error) throw error;
}

export async function getAllSettings(): Promise<Record<string, string>> {
  const { data, error } = await supabase
    .from('settings')
    .select('setting_key, setting_value');

  if (error) throw error;

  const settings: Record<string, string> = {};
  (data || []).forEach((row: any) => {
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

export async function getAllStaff(): Promise<Staff[]> {
  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw error;
  return (data || []) as Staff[];
}

export async function getStaffById(id: number): Promise<Staff | undefined> {
  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data as Staff | undefined;
}

export async function createStaff(staff: Omit<Staff, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
  const { data, error } = await supabase
    .from('staff')
    .insert([staff])
    .select('id')
    .single();

  if (error) throw error;
  return data?.id || 0;
}

export async function updateStaff(id: number, staff: Partial<Staff>): Promise<void> {
  const { error } = await supabase
    .from('staff')
    .update(staff)
    .eq('id', id);

  if (error) throw error;
}

export async function deleteStaff(id: number): Promise<void> {
  const { error } = await supabase
    .from('staff')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
