# A monorepo for RYOAIO (Roll your own auth & all in one dashboard).

### Consists of

- RYOA - rollyourownauth.
  A very scalable, good practice, feature and non-standard nextjs application dashboard for personal use built also to showcase custom rolling auth and best practices.

- Docs
  A MDX powered documentation site for the project. Planning and guiding all (interesting) features/models/concepts of the project.

- Feature X/Y/Z For All-in-One Dashboard
  Behind the custom rolled auth sits my all-in-one dashboard. It's a work in progress and I'm not sure what it will be yet.

- As this is a monorepo and I try to built in an agnostic way, I often build features in separate apps and then move them to the core if they are generally useful. I often work on multiple projects at once. I do some doc work, get sidetracked and start working on a new feature, then move it to the core and back to a side project. This way I do keep all the "potentials" in one place.

# RYOA (Roll Your Own Auth)

A modern authentication system built with Next.js, Prisma, and TypeScript, featuring a flexible database management system.

## Features

- 🔐 Custom authentication system with session management
- 🗄️ Multi-provider database support:
  - Local SQLite or PostgreSQL via Docker
  - Neon (PostgreSQL)
  - Turso (distributed SQLite)
  - Whateveryouwish. Agnostic as possible.
- 🛠️ Interactive CLI for database management (creation, stopping, removing and way more)
- 🔑 OAuth support (GitHub, Google & extendable adapter pattern)
- 👤 Comprehensive user management (roles, permissions, etc)
- 🔒 Security-first approach with password hashing and session tracking

## Tech Stack

- Next.js 15
- Drizzle ORM
- TypeScript
- SQLite/PostgreSQL
- Jose (JWT)

## Key architecture patterns

- Strong separation of concerns
- Document first
- Shared components
- Feature flags
- SOLID principles
  ...

## Quick Start

```bash
# Install dependencies
pnpm install

# Initialize database
pnpm db init

# Generate Drizzle client
pnpm gen

# Push schema to database
pnpm dbpush

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
