#!/usr/bin/env tsx
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env file
config({ path: resolve(__dirname, '../.env') });

import { closeDb } from '../src/server/db';

async function main() {
  try { 
    // Test database connection
    console.log('Testing database connection...');
    console.log('Database URL:', process.env.DATABASE_URL);
    
    // Add your database operations here
    // For example:
    // const users = await db.query.users.findMany();
    // console.log('Users:', users);
    
    console.log('Database connection successful!');
  } catch (error) {
    console.error('Database error:', error);
    process.exit(1);
  } finally {
    // Close the database connection
    closeDb();
  }
}

main().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
}); 