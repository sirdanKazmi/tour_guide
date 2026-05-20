import { supabase } from './supabaseClient';

// Video CRUD operations
export interface Video {
  id?: number;
  title: string;
  description?: string;
  category: string;
  video_url: string;
  thumbnail_url?: string;
  duration?: number;
  created_at?: string;
  updated_at?: string;
}

export async function getAllVideos(): Promise<Video[]> {
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return (data || []) as Video[];
}

export async function getVideoById(id: number): Promise<Video | undefined> {
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data as Video | undefined;
}

export async function getVideosByCategory(category: string): Promise<Video[]> {
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return (data || []) as Video[];
}

export async function createVideo(video: Omit<Video, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
  const { data, error } = await supabase
    .from('videos')
    .insert([video])
    .select('id')
    .single();
  
  if (error) throw error;
  return data?.id || 0;
}

export async function updateVideo(id: number, video: Partial<Video>): Promise<void> {
  const { error } = await supabase
    .from('videos')
    .update(video)
    .eq('id', id);
  
  if (error) throw error;
}

export async function deleteVideo(id: number): Promise<void> {
  const { error } = await supabase
    .from('videos')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// Gallery CRUD operations
export interface GalleryItem {
  id?: number;
  type: 'image' | 'video';
  category: string;
  title?: string;
  description?: string;
  media_url: string;
  thumbnail_url?: string;
  created_at?: string;
  updated_at?: string;
}

export async function getAllGalleryItems(): Promise<GalleryItem[]> {
  const { data, error } = await supabase
    .from('gallery_items')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return (data || []) as GalleryItem[];
}

export async function getGalleryItemsByType(type: 'image' | 'video'): Promise<GalleryItem[]> {
  const { data, error } = await supabase
    .from('gallery_items')
    .select('*')
    .eq('type', type)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return (data || []) as GalleryItem[];
}

export async function getGalleryItemsByCategory(category: string): Promise<GalleryItem[]> {
  const { data, error } = await supabase
    .from('gallery_items')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return (data || []) as GalleryItem[];
}

export async function createGalleryItem(item: Omit<GalleryItem, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
  const { data, error } = await supabase
    .from('gallery_items')
    .insert([item])
    .select('id')
    .single();
  
  if (error) throw error;
  return data?.id || 0;
}

export async function updateGalleryItem(id: number, item: Partial<GalleryItem>): Promise<void> {
  const { error } = await supabase
    .from('gallery_items')
    .update(item)
    .eq('id', id);
  
  if (error) throw error;
}

export async function deleteGalleryItem(id: number): Promise<void> {
  const { error } = await supabase
    .from('gallery_items')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}
