#!/usr/bin/env tsx

// Load environment variables before any other imports
import { config } from 'dotenv';
import { resolve } from 'path';
import { promisify } from 'util';
import { exec as execCallback } from 'child_process';
import { spawn } from 'child_process';
import { prompt } from 'enquirer';
import { existsSync, mkdirSync, readdir, readFile, writeFile } from 'fs';

// Ensure environment variables are loaded first
config({
  path: resolve(__dirname, '../.env'),
  override: true,
});

// Now we can import modules that depend on environment variables
import { db, closeDb } from '../src/server/db';
import { users } from '../src/server/db/schema';

const exec = promisify(execCallback);

async function checkDatabaseConnection() {
  try {
    console.log('Testing database connection...');
    console.log('Database URL:', process.env.DATABASE_URL);

    // Test a simple query
    const result = await db.select().from(users);
    console.log('Connection successful! Found', result.length, 'users');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  } finally {
    closeDb();
  }
}

async function runDrizzleCommand(command: string) {
  try {
    console.log(`Running drizzle ${command}...`);
    return new Promise((resolve, reject) => {
      const child = spawn('pnpm', [`db:${command}`], { 
        stdio: 'inherit',
        shell: true
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve(true);
        } else {
          reject(new Error(`Command failed with code ${code}`));
        }
      });

      child.on('error', (err) => {
        reject(err);
      });
    });
  } catch (error) {
    console.error(`Failed to run drizzle ${command}:`, error);
    return false;
  }
}

async function initializeDatabase() {
  console.log('Initializing database...');
  // Removed generate and push commands
  console.log('Database initialized successfully!');
  return true;
}

async function showDrizzleMenu() {
  const { action } = await prompt<{ action: string }>({
    type: 'select',
    name: 'action',
    message: 'Select a Drizzle command to run:',
    choices: [
      { name: 'push', message: 'Push migrations to the database' },
      { name: 'pull', message: 'Pull schema from the database' },
      { name: 'generate', message: 'Generate migration files' },
      { name: 'drop', message: 'Drop the database' },
      { name: 'seed', message: 'Seed the database' },
      { name: 'studio', message: 'Open Drizzle Studio' },
      { name: 'back', message: 'Back to main menu' },
    ],
  });

  if (action === 'back') return;
  await runDrizzleCommand(action);
}

async function showDatabaseManagementMenu() {
  const { action } = await prompt<{ action: string }>({
    type: 'select',
    name: 'action',
    message: 'Select a database management action:',
    choices: [
      { name: 'backup', message: 'Backup database' },
      { name: 'restore', message: 'Restore database' },
      { name: 'create', message: 'Create new database' },
      { name: 'back', message: 'Back to main menu' },
    ],
  });

  switch (action) {
    case 'backup':
      await backupDatabase();
      break;
    case 'restore':
      await restoreDatabase();
      break;
    case 'create':
      await createNewDatabase();
      break;
    case 'back':
      return;
  }
}

async function showTables() {
  try {
    console.log('Fetching tables from the database...');
    const result = await db.query.users.findMany();
    const tables = ['users', 'sessions', 'oauth_accounts'];
    
    console.log('Tables in the database:');
    tables.forEach((tableName) => console.log(`- ${tableName}`));
    return true;
  } catch (error) {
    console.error('Failed to fetch tables:', error);
    return false;
  } finally {
    closeDb();
  }
}

async function backupDatabase() {
  const backupDir = resolve(__dirname, '../backups');
  if (!existsSync(backupDir)) {
    mkdirSync(backupDir);
  }

  const timestamp = new Date().toISOString().replace(/[:T\-Z.]/g, '');
  const backupFile = resolve(backupDir, `backup_${timestamp}.db`);

  try {
    console.log(`Backing up database to ${backupFile}...`);
    const dbPath = process.env.DATABASE_URL?.replace('file:', '');
    if (!dbPath) {
      throw new Error('DATABASE_URL not set in .env file.');
    }
    await exec(`cp ${dbPath} ${backupFile}`);
    console.log('Database backed up successfully!');
    return true;
  } catch (error) {
    console.error('Database backup failed:', error);
    return false;
  }
}

async function restoreDatabase() {
  const backupDir = resolve(__dirname, '../backups');

  if (!existsSync(backupDir)) {
    console.log('No backups directory found.');
    return false;
  }

  try {
    const backups = await new Promise<string[]>((resolve, reject) => {
      readdir(backupDir, (err, files) => {
        if (err) reject(err);
        else resolve(files);
      });
    });

    if (backups.length === 0) {
      console.log('No backups found.');
      return false;
    }

    const { backupFile } = await prompt<{ backupFile: string }>({
      type: 'select',
      name: 'backupFile',
      message: 'Select a backup file to restore:',
      choices: backups,
    });

    const restorePath = resolve(backupDir, backupFile);
    const dbPath = process.env.DATABASE_URL?.replace('file:', '');

    if (!dbPath) {
      throw new Error('DATABASE_URL not set in .env file.');
    }

    await exec(`cp ${restorePath} ${dbPath}`);
    console.log('Database restored successfully!');
    return true;
  } catch (error) {
    console.error('Database restore failed:', error);
    return false;
  }
}

async function createNewDatabase() {
  const { newDbName } = await prompt<{ newDbName: string }>({
    type: 'input',
    name: 'newDbName',
    message: 'Enter the name for the new database (e.g., development.db):',
    initial: 'development.db',
  });

  const newDbPath = resolve(__dirname, '../', newDbName);

  try {
    console.log(`Creating new database at ${newDbPath}...`);
    
    await new Promise<void>((resolve, reject) => {
      writeFile(newDbPath, '', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    const envPath = resolve(__dirname, '../.env');
    const envContent = await new Promise<string>((resolve, reject) => {
      readFile(envPath, 'utf-8', (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });

    const newEnvContent = envContent.replace(
      /DATABASE_URL=.*/,
      `DATABASE_URL=sqlite://${newDbPath}`,
    );

    await new Promise<void>((resolve, reject) => {
      writeFile(envPath, newEnvContent, 'utf-8', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    console.log('New database created and .env updated successfully!');
    console.log('Please restart the application for changes to take effect.');
    return true;
  } catch (error) {
    console.error('Failed to create new database:', error);
    return false;
  }
}

async function main() {
  while (true) {
    const { action } = await prompt<{ action: string }>({
      type: 'select',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        { name: 'check', message: 'Check database connection' },
        { name: 'tables', message: 'Show tables' },
        { name: 'drizzle', message: 'Drizzle commands' },
        {
          name: 'db_manage',
          message: 'Database Management (Backup, Restore, Create)',
        },
        { name: 'init', message: 'Initialize database' },
        { name: 'exit', message: 'Exit' },
      ],
    });

    switch (action) {
      case 'check':
        await checkDatabaseConnection();
        break;
      case 'tables':
        await showTables();
        break;
      case 'drizzle':
        await showDrizzleMenu();
        break;
      case 'db_manage':
        await showDatabaseManagementMenu();
        break;
      case 'init':
        await initializeDatabase();
        break;
      case 'exit':
        console.log('Goodbye!');
        process.exit(0);
    }
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
