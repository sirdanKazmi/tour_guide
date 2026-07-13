import { supabase } from './supabaseClient';

// ============================================
// SHARED HELPERS
// ============================================

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

// Ensure a slug is unique within a table by appending -2, -3, ... if needed.
async function uniqueSlug(table: 'vehicles' | 'by_air_packages', base: string, ignoreId?: number): Promise<string> {
  const root = slugify(base) || table;
  let candidate = root;
  let n = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    let query = supabase.from(table).select('id').eq('slug', candidate);
    if (ignoreId) query = query.neq('id', ignoreId);
    const { data, error } = await query.maybeSingle();
    if (error && error.code !== 'PGRST116') throw error;
    if (!data) return candidate;
    n += 1;
    candidate = `${root}-${n}`;
  }
}

// ============================================
// VEHICLES (Car Rental fleet)
// ============================================

export interface Vehicle {
  id?: number;
  name: string;
  slug?: string;
  type: string;
  seats: number;
  has_ac: boolean;
  fuel: string;
  with_driver: boolean;
  price_per_day: number;
  description?: string;
  cover_image?: string;
  gallery?: string;        // JSON array of urls
  specs?: string;          // JSON object
  urgency_badge?: string;
  status: 'active' | 'inactive';
  sort_order?: number;
  meta_title?: string;
  meta_description?: string;
  created_at?: string;
  updated_at?: string;
}

export async function getAllVehicles(filters?: { status?: string; type?: string }): Promise<Vehicle[]> {
  let query = supabase.from('vehicles').select('*');
  if (filters?.status) query = query.eq('status', filters.status);
  if (filters?.type) query = query.eq('type', filters.type);
  const { data, error } = await query.order('sort_order', { ascending: true }).order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as Vehicle[];
}

export async function getActiveVehicles(): Promise<Vehicle[]> {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('status', 'active')
    .order('sort_order', { ascending: true })
    .order('price_per_day', { ascending: true });
  if (error) throw error;
  return (data || []) as Vehicle[];
}

export async function getVehicleBySlug(slug: string): Promise<Vehicle | undefined> {
  const { data, error } = await supabase.from('vehicles').select('*').eq('slug', slug).maybeSingle();
  if (error && error.code !== 'PGRST116') throw error;
  return (data || undefined) as Vehicle | undefined;
}

export async function getVehicleById(id: number): Promise<Vehicle | undefined> {
  const { data, error } = await supabase.from('vehicles').select('*').eq('id', id).maybeSingle();
  if (error && error.code !== 'PGRST116') throw error;
  return (data || undefined) as Vehicle | undefined;
}

export async function createVehicle(vehicle: Omit<Vehicle, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
  const slug = await uniqueSlug('vehicles', vehicle.slug || vehicle.name);
  const { data, error } = await supabase
    .from('vehicles')
    .insert([{ ...vehicle, slug }])
    .select('id')
    .single();
  if (error) throw error;
  return data?.id || 0;
}

export async function updateVehicle(id: number, vehicle: Partial<Vehicle>): Promise<void> {
  const payload = { ...vehicle };
  if (payload.slug !== undefined) {
    payload.slug = await uniqueSlug('vehicles', payload.slug || payload.name || '', id);
  }
  const { error } = await supabase.from('vehicles').update(payload).eq('id', id);
  if (error) throw error;
}

export async function deleteVehicle(id: number): Promise<void> {
  const { error } = await supabase.from('vehicles').delete().eq('id', id);
  if (error) throw error;
}

// ============================================
// BY-AIR PACKAGES
// ============================================

export interface ByAirPackage {
  id?: number;
  title: string;
  slug?: string;
  destination: string;
  airline?: string;
  flight_duration?: string;
  road_duration?: string;
  duration_days: number;
  duration_nights: number;
  price_per_person: number;
  description?: string;
  highlights?: string;     // JSON array
  inclusions?: string;
  exclusions?: string;
  itinerary?: string;      // JSON array or text
  cover_image?: string;
  gallery?: string;        // JSON array
  urgency_badge?: string;
  is_featured: boolean;
  status: 'active' | 'inactive' | 'coming_soon';
  sort_order?: number;
  meta_title?: string;
  meta_description?: string;
  created_at?: string;
  updated_at?: string;
}

export async function getAllByAirPackages(filters?: { status?: string }): Promise<ByAirPackage[]> {
  let query = supabase.from('by_air_packages').select('*');
  if (filters?.status) query = query.eq('status', filters.status);
  const { data, error } = await query.order('sort_order', { ascending: true }).order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as ByAirPackage[];
}

export async function getActiveByAirPackages(): Promise<ByAirPackage[]> {
  const { data, error } = await supabase
    .from('by_air_packages')
    .select('*')
    .eq('status', 'active')
    .order('is_featured', { ascending: false })
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return (data || []) as ByAirPackage[];
}

export async function getByAirBySlug(slug: string): Promise<ByAirPackage | undefined> {
  const { data, error } = await supabase.from('by_air_packages').select('*').eq('slug', slug).maybeSingle();
  if (error && error.code !== 'PGRST116') throw error;
  return (data || undefined) as ByAirPackage | undefined;
}

export async function createByAirPackage(pkg: Omit<ByAirPackage, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
  const slug = await uniqueSlug('by_air_packages', pkg.slug || pkg.title);
  const { data, error } = await supabase
    .from('by_air_packages')
    .insert([{ ...pkg, slug }])
    .select('id')
    .single();
  if (error) throw error;
  return data?.id || 0;
}

export async function updateByAirPackage(id: number, pkg: Partial<ByAirPackage>): Promise<void> {
  const payload = { ...pkg };
  if (payload.slug !== undefined) {
    payload.slug = await uniqueSlug('by_air_packages', payload.slug || payload.title || '', id);
  }
  const { error } = await supabase.from('by_air_packages').update(payload).eq('id', id);
  if (error) throw error;
}

export async function deleteByAirPackage(id: number): Promise<void> {
  const { error } = await supabase.from('by_air_packages').delete().eq('id', id);
  if (error) throw error;
}
