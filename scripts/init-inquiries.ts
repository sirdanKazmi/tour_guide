import Database from 'better-sqlite3';
import { join } from 'path';

const dbPath = join(process.cwd(), 'tour_guide.db');
const db = new Database(dbPath);

console.log('Adding sample inquiries...');

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
    message: 'I booked the Naran Kaghan tour last week but haven\'t received confirmation yet. My booking reference is #12345. Please update me on the status.',
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

try {
  const stmt = db.prepare(`
    INSERT INTO inquiries (name, email, phone, message, status)
    VALUES (@name, @email, @phone, @message, @status)
  `);

  const insert = db.transaction((inquiries) => {
    for (const inquiry of inquiries) {
      stmt.run(inquiry);
      console.log(`✅ Added inquiry from: ${inquiry.name} (${inquiry.status})`);
    }
  });

  insert(sampleInquiries);

  console.log(`\n✅ ${sampleInquiries.length} sample inquiries added successfully!`);
} catch (error) {
  console.error('❌ Error adding sample inquiries:', error);
} finally {
  db.close();
}
