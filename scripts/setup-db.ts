import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { join } from 'path';

const dbPath = join(process.cwd(), 'tour_guide.db');
const db = new Database(dbPath);

console.log('Setting up database tables...');

try {
  // Read and execute schema
  const schemaPath = join(process.cwd(), 'lib', 'schema.sql');
  const schema = readFileSync(schemaPath, 'utf-8');
  
  db.exec(schema);
  
  console.log('✅ Database tables created successfully!');
  console.log('📍 Database location:', dbPath);
} catch (error) {
  console.error('❌ Error setting up database:', error);
} finally {
  db.close();
}
