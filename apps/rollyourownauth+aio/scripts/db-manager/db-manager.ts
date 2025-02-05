import { PrismaClient } from '@prisma/client'
import { createClient as createTursoClient } from '@libsql/client'
import { neon } from '@neondatabase/serverless'
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

/**
 * Supported database provider types
 * @typedef {'sqlite' | 'neon' | 'turso'} DatabaseProvider
 */

/**
 * Database configuration interface
 * @interface DatabaseConfig
 * @property {DatabaseProvider} provider - The database provider to use
 * @property {string} [url] - Database connection URL
 * @property {string} [authToken] - Authentication token (required for Turso)
 */
type DatabaseProvider = 'sqlite' | 'neon' | 'turso'

interface DatabaseConfig {
    provider: DatabaseProvider
    url?: string
    authToken?: string
}

/**
 * Path constants for database files and configuration
 * @constant {string}
 */
const DB_PATH = path.join(process.cwd(), 'prisma/dev.db')
const SCHEMA_PATH = path.join(process.cwd(), 'prisma/schema.prisma')
const ENV_PATH = path.join(process.cwd(), '.env')

/**
 * Generates the appropriate database URL based on the provider configuration
 * @param {DatabaseConfig} config - Database configuration object
 * @returns {string} The formatted database URL
 * @throws {Error} If Turso provider is missing required credentials
 */
function getProviderUrl(config: DatabaseConfig): string {
    switch (config.provider) {
        case 'sqlite':
            return 'file:./dev.db'
        case 'neon':
            return config.url || process.env.NEON_DATABASE_URL || ''
        case 'turso':
            const url = config.url || process.env.TURSO_DATABASE_URL
            const authToken = config.authToken || process.env.TURSO_AUTH_TOKEN
            if (!url || !authToken) {
                throw new Error('Turso requires both URL and auth token')
            }
            return url
        default:
            return 'file:./dev.db'
    }
}

/**
 * Validates the database configuration
 * @param {DatabaseConfig} config - Database configuration to validate
 * @throws {Error} If the configuration is invalid or missing required fields
 */
function validateConfig(config: DatabaseConfig) {
    if (config.provider === 'turso') {
        if (!config.url && !process.env.TURSO_DATABASE_URL) {
            throw new Error('Turso requires a database URL. Use: npm run db use turso <url> <authToken>')
        }
        if (!config.authToken && !process.env.TURSO_AUTH_TOKEN) {
            throw new Error('Turso requires an auth token. Use: npm run db use turso <url> <authToken>')
        }
    }
    if (config.provider === 'neon' && !config.url && !process.env.NEON_DATABASE_URL) {
        throw new Error('Neon requires a database URL. Use: npm run db use neon <url>')
    }
}

/**
 * Initializes the database configuration and environment
 * @param {DatabaseConfig} config - Database configuration object
 * @returns {Promise<void>}
 * @throws {Error} If initialization fails
 */
async function initDatabase(config: DatabaseConfig) {
    try {
        validateConfig(config)
        
        const envContent: string[] = []
        envContent.push(`DATABASE_URL="${getProviderUrl(config)}"`)

        if (config.provider === 'neon' && config.url) {
            envContent.push(`NEON_DATABASE_URL="${config.url}"`)
        }
        if (config.provider === 'turso') {
            if (config.url) envContent.push(`TURSO_DATABASE_URL="${config.url}"`)
            if (config.authToken) envContent.push(`TURSO_AUTH_TOKEN="${config.authToken}"`)
        }

        fs.writeFileSync(ENV_PATH, envContent.join('\n') + '\n')
        console.log('✨ Database initialized')
    } catch (error) {
        console.error('Failed to initialize database:', error)
        throw error
    }
}

/**
 * Updates the database provider and related configuration
 * @param {DatabaseProvider} provider - The database provider to switch to
 * @param {string} [url] - Database connection URL
 * @param {string} [authToken] - Authentication token (required for Turso)
 * @returns {Promise<void>}
 * @throws {Error} If provider update fails
 */
async function updateDatabaseProvider(provider: DatabaseProvider, url?: string, authToken?: string) {
    const config: DatabaseConfig = { provider, url, authToken }

    try {
        await initDatabase(config)
        
        const schemaContent = fs.readFileSync(SCHEMA_PATH, 'utf-8')
        const updatedSchema = schemaContent.replace(
            /provider = ".*"/,
            `provider = "${provider === 'turso' ? 'sqlite' : provider}"`
        )
        fs.writeFileSync(SCHEMA_PATH, updatedSchema)
        
        console.log(`✨ Switched to ${provider} provider`)
        return generateSchema()
    } catch (error) {
        console.error(`Failed to update provider to ${provider}:`, error)
        throw error
    }
}

/**
 * Generates Prisma client based on the current schema
 * @returns {Promise<void>}
 * @throws {Error} If schema generation fails
 */
async function generateSchema() {
    try {
        execSync('npx prisma generate', { stdio: 'inherit' })
        console.log('✨ Schema generated successfully')
    } catch (error) {
        console.error('Failed to generate schema:', error)
        throw error
    }
}

/**
 * Pushes the current schema to the database
 * @returns {Promise<void>}
 * @throws {Error} If schema push fails
 */
async function pushSchema() {
    try {
        execSync('npx prisma db push', { stdio: 'inherit' })
        console.log('✨ Schema pushed to database')
    } catch (error) {
        console.error('Failed to push schema:', error)
        throw error
    }
}

/**
 * Creates a new SQLite database if it doesn't exist
 * @returns {Promise<void>}
 * @throws {Error} If database creation fails
 */
async function createDatabase() {
    try {
        if (!fs.existsSync(DB_PATH)) {
            await pushSchema()
            console.log('✨ Database created successfully')
        } else {
            console.log('Database already exists')
        }
    } catch (error) {
        console.error('Failed to create database:', error)
        throw error
    }
}

/**
 * Deletes the SQLite database file if it exists
 * @returns {Promise<void>}
 * @throws {Error} If database deletion fails
 */
async function deleteDatabase() {
    try {
        if (fs.existsSync(DB_PATH)) {
            fs.unlinkSync(DB_PATH)
            console.log('✨ Database deleted successfully')
        } else {
            console.log('Database does not exist')
        }
    } catch (error) {
        console.error('Failed to delete database:', error)
        throw error
    }
}

/**
 * Lists all tables in the current database
 * @returns {Promise<any[]>} Array of table names and their information
 * @throws {Error} If table retrieval fails
 */
async function viewTables() {
    try {
        const tables = await prisma.$queryRaw`
            SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';
        `
        console.log('📊 Database Tables:')
        console.table(tables)
        return tables
    } catch (error) {
        console.error('Failed to view tables:', error)
        return []
    }
}

/**
 * Describes the structure of a specific table
 * @param {string} tableName - Name of the table to describe
 * @returns {Promise<any[]>} Array of column definitions and their properties
 * @throws {Error} If table description fails
 */
async function describeTable(tableName: string) {
    try {
        const columns = await prisma.$queryRaw`
            PRAGMA table_info(${tableName});
        `
        console.log(`📋 Table Structure for ${tableName}:`)
        console.table(columns)
        return columns
    } catch (error) {
        console.error(`Failed to describe table ${tableName}:`, error)
        return []
    }
}

/**
 * Tests the connection to the current database
 * @param {DatabaseConfig} config - Database configuration to test
 * @returns {Promise<boolean>} True if connection is successful, false otherwise
 */
async function testConnection(config: DatabaseConfig) {
    try {
        switch (config.provider) {
            case 'sqlite':
                await prisma.$queryRaw`SELECT 1`
                break
            case 'neon':
                const sql = neon(config.url!)
                await sql`SELECT 1`
                break
            case 'turso':
                const client = createTursoClient({
                    url: config.url!,
                    authToken: config.authToken
                })
                await client.execute('SELECT 1')
                break
        }
        console.log('✨ Database connection successful')
        return true
    } catch (error) {
        console.error('Failed to connect to database:', error)
        return false
    }
}

export {
    initDatabase,
    updateDatabaseProvider,
    generateSchema,
    pushSchema,
    createDatabase,
    deleteDatabase,
    viewTables,
    describeTable,
    testConnection,
    type DatabaseConfig,
    type DatabaseProvider
}