#!/usr/bin/env node
import { prompt } from 'enquirer'
import {
    initDatabase,
    updateDatabaseProvider,
    generateSchema,
    pushSchema,
    createDatabase,
    deleteDatabase,
    viewTables,
    describeTable,
    testConnection,
    type DatabaseProvider
} from './db-manager'

type Provider = 'sqlite' | 'neon' | 'turso'

async function mainMenu() {
    const { action } = await prompt<{ action: string }>({
        type: 'select',
        name: 'action',
        message: '🚀 What would you like to do?',
        choices: [
            { name: 'init', message: 'Initialize database' },
            { name: 'provider', message: 'Switch database provider' },
            { name: 'generate', message: 'Generate Prisma schema' },
            { name: 'push', message: 'Push schema changes' },
            { name: 'create', message: 'Create database' },
            { name: 'delete', message: 'Delete database' },
            { name: 'tables', message: 'View tables' },
            { name: 'describe', message: 'Describe table' },
            { name: 'test', message: 'Test connection' },
            { name: 'exit', message: 'Exit' }
        ]
    })

    if (action === 'exit') {
        console.log('👋 Goodbye!')
        process.exit(0)
    }

    return handleAction(action)
}

async function selectProvider(): Promise<{ provider: Provider; url?: string; authToken?: string }> {
    const { provider } = await prompt<{ provider: Provider }>({
        type: 'select',
        name: 'provider',
        message: '📦 Select a database provider:',
        choices: [
            { name: 'sqlite', message: 'SQLite (Local)' },
            { name: 'neon', message: 'Neon (PostgreSQL)' },
            { name: 'turso', message: 'Turso (Distributed SQLite)' }
        ]
    })

    if (provider === 'sqlite') {
        return { provider }
    }

    const { url } = await prompt<{ url: string }>({
        type: 'input',
        name: 'url',
        message: `Enter ${provider} database URL:`,
        validate: (value) => value.length > 0 || 'URL is required'
    })

    if (provider === 'turso') {
        const { authToken } = await prompt<{ authToken: string }>({
            type: 'password',
            name: 'authToken',
            message: 'Enter Turso auth token:',
            validate: (value) => value.length > 0 || 'Auth token is required'
        })
        return { provider, url, authToken }
    }

    return { provider, url }
}

async function handleAction(action: string) {
    try {
        switch (action) {
            case 'init':
                await initDatabase({ provider: 'sqlite' })
                break

            case 'provider': {
                const config = await selectProvider()
                await updateDatabaseProvider(config.provider, config.url, config.authToken)
                break
            }

            case 'generate':
                await generateSchema()
                break

            case 'push':
                await pushSchema()
                break

            case 'create':
                await createDatabase()
                break

            case 'delete': {
                const { confirm } = await prompt<{ confirm: boolean }>({
                    type: 'confirm',
                    name: 'confirm',
                    message: '⚠️ Are you sure you want to delete the database?'
                })
                if (confirm) await deleteDatabase()
                break
            }

            case 'tables':
                await viewTables()
                break

            case 'describe': {
                const { tableName } = await prompt<{ tableName: string }>({
                    type: 'input',
                    name: 'tableName',
                    message: '📋 Enter table name to describe:',
                    validate: (value) => value.length > 0 || 'Table name is required'
                })
                await describeTable(tableName)
                break
            }

            case 'test':
                await testConnection({ provider: 'sqlite' })
                break
        }

        // Ask if user wants to perform another action
        const { another } = await prompt<{ another: boolean }>({
            type: 'confirm',
            name: 'another',
            message: '🔄 Would you like to perform another action?'
        })

        if (another) {
            return mainMenu()
        } else {
            console.log('👋 Goodbye!')
            process.exit(0)
        }
    } catch (error: unknown) {
        console.error('❌ Error:', error instanceof Error ? error.message : 'An unexpected error occurred')
        
        const { retry } = await prompt<{ retry: boolean }>({
            type: 'confirm',
            name: 'retry',
            message: '🔄 Would you like to try again?'
        })

        if (retry) {
            return mainMenu()
        } else {
            console.log('👋 Goodbye!')
            process.exit(1)
        }
    }
}

// Start the interactive menu
mainMenu().catch((error) => {
    console.error('❌ Fatal error:', error)
    process.exit(1) 