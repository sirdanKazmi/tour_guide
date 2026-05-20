import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

// Helper to load env variables manually from .env file
function loadEnv() {
  try {
    const envPath = join(process.cwd(), '.env');
    const envContent = readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const parts = line.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim().replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
        if (key && !key.startsWith('#')) {
          process.env[key] = value;
        }
      }
    });
  } catch (error) {
    console.warn('Warning: Could not read .env file', error);
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Supabase credentials not found in environment or .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const defaultSettings = [
  { setting_key: 'business_name', setting_value: 'Smile For Miles' },
  { setting_key: 'business_email', setting_value: 'baltrotraders1234@gmail.com' },
  { setting_key: 'business_phone', setting_value: '' },
  { setting_key: 'business_whatsapp', setting_value: '' },
  { setting_key: 'business_address', setting_value: '' },
  { setting_key: 'facebook_url', setting_value: '' },
  { setting_key: 'instagram_url', setting_value: '' },
  { setting_key: 'tiktok_url', setting_value: '' },
  { setting_key: 'youtube_url', setting_value: '' },
  { setting_key: 'homepage_banner_text', setting_value: '' },
  { setting_key: 'meta_title', setting_value: '' },
  { setting_key: 'meta_description', setting_value: '' },
];

async function initSettings() {
  console.log('Initializing default settings in Supabase...');

  try {
    const { error } = await supabase
      .from('settings')
      .upsert(defaultSettings, { onConflict: 'setting_key' });

    if (error) {
      throw error;
    }

    for (const setting of defaultSettings) {
      console.log(`✅ ${setting.setting_key}: ${setting.setting_value || '(empty)'}`);
    }

    console.log('\n✅ Default settings initialized successfully in Supabase!');
  } catch (error) {
    console.error('❌ Error initializing settings:', error);
  }
}

initSettings();
