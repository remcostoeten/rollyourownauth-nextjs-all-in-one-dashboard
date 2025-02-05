# A monorepo for RYOAIO (Roll your own auth & all in one dashboard).

### Consists of

- RYOA 
A very scalable, good practice, feature and non-standard nextjs application dashboard for personal use built also to showcase custom rolling auth and best practices.

- Docs
A fumadocs application for aesthetic documentation as I will be doing a lot of planning and writing guides, sharing schemas and models and whatnot.

# RYOA (Roll Your Own Auth)

A modern authentication system built with Next.js, Prisma, and TypeScript, featuring a flexible database management system.

## Features

- 🔐 Custom authentication system with session management
- 🗄️ Multi-provider database support:
  - SQLite (local development)
  - Neon (PostgreSQL)
  - Turso (distributed SQLite)
- 🛠️ Interactive CLI for database management
- 🔑 OAuth support (GitHub, Google)
- 👤 Comprehensive user management
- 🔒 Security-first approach with password hashing and session tracking

## Tech Stack

- Next.js 14
- Prisma ORM
- TypeScript
- TailwindCSS
- SQLite/PostgreSQL

## Quick Start

```bash
# Install dependencies
pnpm install

# Initialize database
pnpm db init

# Generate Prisma client
pnpm db generate

# Start development server
pnpm dev
```

## Database Management

Use the interactive CLI for database operations:

```bash
pnpm db
```

Available commands:
- Initialize database
- Switch providers (SQLite/Neon/Turso)
- Generate/push schema
- View/describe tables
- Test connections

## Project Structure
To be expanded...
```
src/
├── app/                   # Next.js app router
├── components/           # React components
├── core/                # Core utilities
│   └── database/        # Database management
├── modules/             # Feature modules
│   └── authentication/  # Auth system
└── server/             # Server-side code
    └── db/             # Database config
```

## Environment Variables

```env
TO be expanded
ADMIN_EMAIL=
DATABASE_URL=
``` 

## Feature flags

A way to control certain feature behaviour

```ts
To be implemented
```