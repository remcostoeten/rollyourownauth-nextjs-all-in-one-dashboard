# Database Layer

This directory contains the database layer of our application, built with Drizzle ORM for type-safe database operations.

## Directory Structure

```
db/
├── schemas/        # Database schema definitions by module
│   └── index.ts   # Schema re-exports
├── migrations/     # Generated migration files
└── client.ts      # Database client setup
```

## Usage

The database client is exported as `db` and can be imported from the database layer:

```typescript
import { db } from '@/server/db/client';
```

### Available Scripts

- `pnpm db:generate` - Generate migrations from schema changes
- `pnpm db:push` - Push schema changes to the database
- `pnpm db:studio` - Open Drizzle Studio to view/edit data

### Schema Structure

The schema is organized by feature modules:
- `auth/models/z.user.ts` - User accounts and authentication
- `auth/models/z.session.ts` - Session management
- `auth/models/z.oauth-account.ts` - OAuth provider connections
- `profile/models/z.profile.ts` - User profiles and preferences

### Environment Setup

The database uses a simple SQLite setup with one environment variable:
```bash
DATABASE_URL="sqlite:./local.db"  # Default for local development
```

### Best Practices

1. **Schema Organization**:
   - Keep schemas in their respective module directories
   - Use the `z.*.ts` naming convention
   - Re-export all schemas through `db/schemas/index.ts`

2. **Database Operations**:
   - Co-locate queries with their modules in `src/modules/<feature>/api/`
   - Use the type-safe query builder
   - Leverage Drizzle's built-in validation

3. **Migrations**:
   - Never modify the database schema directly
   - Always use migrations for schema changes
   - Run migrations as part of your deployment process

## Architecture Decisions

1. **ORM Choice**: We use Drizzle ORM for:
   - Type safety
   - Performance
   - Developer experience
   - Easy swapping of database providers

2. **Schema Organization**:
   - Schemas are organized by feature modules
   - Each module owns its own schema files
   - Clear separation of concerns
   - Easy to maintain and extend

3. **Migration Strategy**:
   - Migrations are version controlled
   - Generated automatically from schema changes
   - Applied in order of creation

4. **Database Choice**:
   - SQLite for simplicity and portability
   - Easy to swap for other databases if needed
   - No external dependencies required 