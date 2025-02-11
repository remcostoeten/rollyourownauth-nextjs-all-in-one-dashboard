import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { env } from '../config/env';

// This is a singleton to ensure we don't create multiple database connections
let _db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (!_db) {
    const sqlite = new Database(env.DATABASE_URL);
    _db = drizzle(sqlite);
  }
  return _db;
}

export const db = getDb();

export * from './schema'; 