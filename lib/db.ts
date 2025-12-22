import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.join(process.cwd(), 'tour_guide.db');
const schemaPath = path.join(process.cwd(), 'lib', 'schema.sql');

let db: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (!db) {
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    
    // Initialize schema if database is new
    if (fs.existsSync(schemaPath)) {
      const schema = fs.readFileSync(schemaPath, 'utf-8');
      db.exec(schema);
    }
  }
  return db;
}

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

export function getAllVideos(): Video[] {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM videos ORDER BY created_at DESC');
  return stmt.all() as Video[];
}

export function getVideoById(id: number): Video | undefined {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM videos WHERE id = ?');
  return stmt.get(id) as Video | undefined;
}

export function getVideosByCategory(category: string): Video[] {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM videos WHERE category = ? ORDER BY created_at DESC');
  return stmt.all(category) as Video[];
}

export function createVideo(video: Omit<Video, 'id' | 'created_at' | 'updated_at'>): number {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT INTO videos (title, description, category, video_url, thumbnail_url, duration)
    VALUES (@title, @description, @category, @video_url, @thumbnail_url, @duration)
  `);
  const result = stmt.run(video);
  return result.lastInsertRowid as number;
}

export function updateVideo(id: number, video: Partial<Video>): void {
  const db = getDatabase();
  const fields = Object.keys(video).filter(k => k !== 'id');
  const setClause = fields.map(f => `${f} = @${f}`).join(', ');
  
  const stmt = db.prepare(`
    UPDATE videos 
    SET ${setClause}, updated_at = CURRENT_TIMESTAMP
    WHERE id = @id
  `);
  stmt.run({ ...video, id });
}

export function deleteVideo(id: number): void {
  const db = getDatabase();
  const stmt = db.prepare('DELETE FROM videos WHERE id = ?');
  stmt.run(id);
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

export function getAllGalleryItems(): GalleryItem[] {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM gallery_items ORDER BY created_at DESC');
  return stmt.all() as GalleryItem[];
}

export function getGalleryItemsByType(type: 'image' | 'video'): GalleryItem[] {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM gallery_items WHERE type = ? ORDER BY created_at DESC');
  return stmt.all(type) as GalleryItem[];
}

export function getGalleryItemsByCategory(category: string): GalleryItem[] {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM gallery_items WHERE category = ? ORDER BY created_at DESC');
  return stmt.all(category) as GalleryItem[];
}

export function createGalleryItem(item: Omit<GalleryItem, 'id' | 'created_at' | 'updated_at'>): number {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT INTO gallery_items (type, category, title, description, media_url, thumbnail_url)
    VALUES (@type, @category, @title, @description, @media_url, @thumbnail_url)
  `);
  const result = stmt.run(item);
  return result.lastInsertRowid as number;
}

export function updateGalleryItem(id: number, item: Partial<GalleryItem>): void {
  const db = getDatabase();
  const fields = Object.keys(item).filter(k => k !== 'id');
  const setClause = fields.map(f => `${f} = @${f}`).join(', ');
  
  const stmt = db.prepare(`
    UPDATE gallery_items 
    SET ${setClause}, updated_at = CURRENT_TIMESTAMP
    WHERE id = @id
  `);
  stmt.run({ ...item, id });
}

export function deleteGalleryItem(id: number): void {
  const db = getDatabase();
  const stmt = db.prepare('DELETE FROM gallery_items WHERE id = ?');
  stmt.run(id);
}

// Initialize database on import
getDatabase();
