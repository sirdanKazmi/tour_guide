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

const sampleInquiries = [
  {
    name: 'Ahmed Khan',
    email: 'ahmed.khan@email.com',
    phone: '+92 300 1234567',
    message: 'Hi, I am interested in the Hunza valley tour package. Can you provide more details about the itinerary and pricing for a group of 4 people?',
    status: 'new',
  },
  {
    name: 'Sarah Ali',
    email: 'sarah.ali@email.com',
    phone: '+92 321 9876543',
    message: 'We are planning a family trip to Skardu next month. Do you have any family-friendly packages available? Please share the details.',
    status: 'new',
  },
  {
    name: 'Muhammad Usman',
    email: 'usman.m@email.com',
    phone: '+92 333 4567890',
    message: "I booked the Naran Kaghan tour last week but haven't received confirmation yet. My booking reference is #12345. Please update me on the status.",
    status: 'read',
  },
  {
    name: 'Fatima Noor',
    email: 'fatima.noor@email.com',
    phone: '+92 345 6789012',
    message: 'Thank you for the amazing Swat valley tour! The experience was wonderful and the guide was very knowledgeable. I would love to book another tour with you.',
    status: 'replied',
  },
];

async function initInquiries() {
  console.log('Adding sample inquiries to Supabase...');

  try {
    const { error } = await supabase
      .from('inquiries')
      .insert(sampleInquiries);

    if (error) {
      throw error;
    }

    for (const inquiry of sampleInquiries) {
      console.log(`✅ Added inquiry from: ${inquiry.name} (${inquiry.status})`);
    }

    console.log(`\n✅ ${sampleInquiries.length} sample inquiries added successfully to Supabase!`);
  } catch (error) {
    console.error('❌ Error adding sample inquiries:', error);
  }
}

initInquiries();
