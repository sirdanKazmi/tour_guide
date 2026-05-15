import Database from 'better-sqlite3';
import { join } from 'path';

const dbPath = join(process.cwd(), 'tour_guide.db');
const db = new Database(dbPath);

console.log('Initializing default settings...');

const defaultSettings = [
  { key: 'business_name', value: 'Smile For Miles' },
  { key: 'business_email', value: 'baltrotraders1234@gmail.com' },
  { key: 'business_phone', value: '' },
  { key: 'business_whatsapp', value: '' },
  { key: 'business_address', value: '' },
  { key: 'facebook_url', value: '' },
  { key: 'instagram_url', value: '' },
  { key: 'tiktok_url', value: '' },
  { key: 'youtube_url', value: '' },
  { key: 'homepage_banner_text', value: '' },
  { key: 'meta_title', value: '' },
  { key: 'meta_description', value: '' },
];

try {
  const stmt = db.prepare(`
    INSERT INTO settings (setting_key, setting_value) 
    VALUES (?, ?) 
    ON CONFLICT(setting_key) DO NOTHING
  `);

  for (const setting of defaultSettings) {
    stmt.run(setting.key, setting.value);
    console.log(`✅ ${setting.key}: ${setting.value || '(empty)'}`);
  }

  console.log('\n✅ Default settings initialized successfully!');
} catch (error) {
  console.error('❌ Error initializing settings:', error);
} finally {
  db.close();
}
