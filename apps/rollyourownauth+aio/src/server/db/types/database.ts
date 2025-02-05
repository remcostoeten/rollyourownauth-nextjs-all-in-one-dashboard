/**
 * Supported database providers
 * @typedef {'sqlite' | 'neon' | 'turso'} DatabaseProvider
 * - sqlite: Local SQLite database for development
 * - neon: Serverless PostgreSQL by Neon.tech
 * - turso: Distributed SQLite by Turso
 */
export type DatabaseProvider = 'sqlite' | 'neon' | 'turso'

/**
 * Database configuration options
 * @typedef {Object} DatabaseConfig
 * @property {DatabaseProvider} provider - The database provider to use
 * @property {string} [url] - Connection URL for the database
 * @property {string} [authToken] - Authentication token (required for Turso)
 */
export type DatabaseConfig = {
    provider: DatabaseProvider
    url?: string
    authToken?: string
}

/**
 * Default database configuration
 * Uses local SQLite for development by default
 */
export const DEFAULT_CONFIG: DatabaseConfig = {
    provider: 'sqlite'
} 