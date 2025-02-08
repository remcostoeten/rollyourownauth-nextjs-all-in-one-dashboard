import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { db } from './client';

// Run migrations
console.log('Running migrations...');
migrate(db, { migrationsFolder: './src/server/db/migrations' });
console.log('Migrations completed!'); 