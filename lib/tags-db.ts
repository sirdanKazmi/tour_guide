import { supabase } from './supabaseClient';

export interface Tag {
  id: number;
  name: string;
  slug?: string;
}

function tagSlug(name: string): string {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export async function getAllTags(): Promise<Tag[]> {
  const { data, error } = await supabase.from('tags').select('id, name, slug').order('name', { ascending: true });
  if (error) throw error;
  return (data || []) as Tag[];
}

export async function getTagsForTour(tourId: number): Promise<string[]> {
  const { data: links, error } = await supabase.from('tour_tags').select('tag_id').eq('tour_id', tourId);
  if (error) throw error;
  const ids = (links || []).map((l: any) => l.tag_id);
  if (!ids.length) return [];
  const { data: tags, error: e2 } = await supabase.from('tags').select('name').in('id', ids);
  if (e2) throw e2;
  return (tags || []).map((t: any) => t.name);
}

export async function getTourIdsByTag(tagName: string): Promise<number[]> {
  const { data: tag, error } = await supabase.from('tags').select('id').ilike('name', tagName).maybeSingle();
  if (error && error.code !== 'PGRST116') throw error;
  if (!tag) return [];
  const { data: links, error: e2 } = await supabase.from('tour_tags').select('tour_id').eq('tag_id', (tag as any).id);
  if (e2) throw e2;
  return (links || []).map((l: any) => l.tour_id);
}

async function ensureTag(name: string): Promise<number> {
  const clean = name.trim();
  const { data, error } = await supabase
    .from('tags')
    .upsert({ name: clean, slug: tagSlug(clean) }, { onConflict: 'name' })
    .select('id')
    .single();
  if (error) throw error;
  return (data as any).id;
}

// Recompute the denormalized tours.tags JSON cache from the join table.
async function syncTagCache(tourId: number): Promise<void> {
  const names = await getTagsForTour(tourId);
  await supabase.from('tours').update({ tags: JSON.stringify(names) }).eq('id', tourId);
}

// Replace all tags for a tour (used when saving a tour's comma-separated tag field).
export async function setTagsForTour(tourId: number, names: string[]): Promise<void> {
  const clean = Array.from(new Set(names.map((n) => n.trim()).filter(Boolean)));
  const tagIds: number[] = [];
  for (const n of clean) tagIds.push(await ensureTag(n));

  await supabase.from('tour_tags').delete().eq('tour_id', tourId);
  if (tagIds.length) {
    const { error } = await supabase.from('tour_tags').insert(tagIds.map((tag_id) => ({ tour_id: tourId, tag_id })));
    if (error) throw error;
  }
  await supabase.from('tours').update({ tags: JSON.stringify(clean) }).eq('id', tourId);
}

export async function addTagToTour(tourId: number, name: string): Promise<number> {
  const tagId = await ensureTag(name);
  const { error } = await supabase.from('tour_tags').upsert({ tour_id: tourId, tag_id: tagId }, { onConflict: 'tour_id,tag_id' });
  if (error) throw error;
  await syncTagCache(tourId);
  return tagId;
}

export async function removeTagFromTour(tourId: number, tagId: number): Promise<void> {
  const { error } = await supabase.from('tour_tags').delete().eq('tour_id', tourId).eq('tag_id', tagId);
  if (error) throw error;
  await syncTagCache(tourId);
}
