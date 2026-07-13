import { supabase } from './supabaseClient';

export interface PackageHotel { area: string; nights?: number; hotel: string; room_type?: string }

export interface PackageOption {
  id?: number;
  tour_id: number;
  code?: string | null;
  tier?: string | null;
  transport_mode?: string | null;
  price_unit?: 'per_person' | 'per_group';
  min_persons?: number | null;
  max_persons?: number | null;
  rooms?: number | null;
  price: number;
  vehicle_text?: string | null;
  vehicle_id?: number | null;
  hotels?: string | null;        // JSON [{area,nights,hotel,room_type}]
  included?: string | null;      // JSON []
  not_included?: string | null;  // JSON []
  extras?: string | null;        // JSON []
  sort_order?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// A grid option carries a party band; a tier option does not.
export function isGridOption(o: PackageOption): boolean {
  return o.min_persons != null || o.max_persons != null;
}

export async function getPackageOptionsByTour(tourId: number, activeOnly = false): Promise<PackageOption[]> {
  let query = supabase.from('package_options').select('*').eq('tour_id', tourId);
  if (activeOnly) query = query.eq('is_active', true);
  const { data, error } = await query.order('sort_order', { ascending: true }).order('price', { ascending: true });
  if (error) throw error;
  return (data || []) as PackageOption[];
}

export async function getPackageOptionById(id: number): Promise<PackageOption | undefined> {
  const { data, error } = await supabase.from('package_options').select('*').eq('id', id).maybeSingle();
  if (error && error.code !== 'PGRST116') throw error;
  return (data || undefined) as PackageOption | undefined;
}

export async function createPackageOption(opt: Omit<PackageOption, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
  const { data, error } = await supabase.from('package_options').insert([opt]).select('id').single();
  if (error) throw error;
  return data?.id || 0;
}

export async function updatePackageOption(id: number, patch: Partial<PackageOption>): Promise<void> {
  const { error } = await supabase.from('package_options').update(patch).eq('id', id);
  if (error) throw error;
}

export async function deletePackageOption(id: number): Promise<void> {
  const { error } = await supabase.from('package_options').delete().eq('id', id);
  if (error) throw error;
}
