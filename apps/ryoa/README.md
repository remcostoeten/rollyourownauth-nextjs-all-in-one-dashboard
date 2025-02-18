# Authentication System Documentation

## Table of Contents
1. [Current Implementation](#current-implementation)
2. [Potential To-Dos](#potential-to-dos)
3. [Environment Variables](#environment-variables)
4. [How It Works](#how-it-works)

## Current Implementation

### User Authentication
- Email and password registration
- Email and password login
- GitHub OAuth login
- JWT-based session management
- Role-based access control (user and admin roles)

### Database
- SQLite database using Drizzle ORM
- Schemas for users, sessions, OAuth connections, and user profiles

### User Interface
- Login form with email/password and GitHub options
- Registration form with email/password and GitHub options
- Dashboard for regular users
- Admin dashboard with user list

### API Routes
- GitHub OAuth callback handling
- User list retrieval (admin only)

### Server-Side Logic
- User creation and authentication
- Session management
- Admin role assignment based on email

### Middleware
- Authentication check for protected routes
- Admin route protection

## Potential To-Dos

1. Implement password reset functionality
2. Add email verification for new registrations
3. Implement account deletion
4. Add user profile management (view/edit profile)
5. Implement refresh token mechanism for prolonged sessions
6. Add multi-factor authentication (2FA) option
7. Implement rate limiting on authentication endpoints
8. Add more OAuth providers (e.g., Google, Facebook)
9. Implement user activity logging
10. Add account lockout after multiple failed login attempts
11. Implement password strength requirements
12. Add session management UI (view active sessions, logout from other devices)
13. Implement remember me functionality
14. Add CSRF protection
15. Implement API key generation for users (if needed for external integrations)

## Environment Variables

Add the following environment variables to your \`.env\` file:

\`\`\`
DATABASE_URL=file:./dev.db
JWT_SECRET=your_jwt_secret_here
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
ADMIN_EMAILS=admin1@example.com,admin2@example.com
\`\`\`

- \`DATABASE_URL\`: The URL for your SQLite database
- \`JWT_SECRET\`: A secure random string used for signing JWTs
- \`GITHUB_CLIENT_ID\`: Your GitHub OAuth app client ID
- \`GITHUB_CLIENT_SECRET\`: Your GitHub OAuth app client secret
- \`ADMIN_EMAILS\`: Comma-separated list of email addresses that should be given admin role upon registration

## How It Works

### Registration Process
1. User submits registration form with email and password
2. Server validates input and checks if email is in ADMIN_EMAILS
3. If email is in ADMIN_EMAILS, user is assigned admin role; otherwise, user role
4. Password is hashed using bcrypt
5. User data is stored in the database
6. A JWT is generated and set as an HTTP-only cookie
7. User is redirected to dashboard (or admin dashboard for admins)

### Login Process
1. User submits login form with email and password
2. Server validates credentials
3. If valid, a JWT is generated and set as an HTTP-only cookie
4. User is redirected to dashboard (or admin dashboard for admins)

### GitHub OAuth Flow
1. User clicks "Login with GitHub" button
2. User is redirected to GitHub for authorization
3. GitHub redirects back to our callback URL with a code
4. Server exchanges code for access token
5. Server fetches user data from GitHub API
6. If user doesn't exist, a new user is created
7. A JWT is generated and set as an HTTP-only cookie
8. User is redirected to dashboard (or admin dashboard for admins)

### Session Management
- JWTs are used for maintaining user sessions
- JWTs are stored as HTTP-only cookies
- Middleware checks for valid JWT on protected routes
- If JWT is invalid or expired, user is redirected to login

### Admin Dashboard
- Only accessible to users with admin role
- Displays a list of all registered users
- Protected by middleware that checks user role

### Database Schema
- Users: id, email, passwordHash, role, createdAt, updatedAt
- Sessions: id, userId, expiresAt, createdAt
- OAuthConnections: id, userId, provider, providerUserId, createdAt, updatedAt
- UserProfiles: id, userId, fullName, bio, avatarUrl, createdAt, updatedAt

### API Routes
- \`/api/auth/github\`: Initiates GitHub OAuth flow
- \`/api/auth/callback/github\`: Handles GitHub OAuth callback
- \`/api/users\`: Returns list of all users (admin only)

### Middleware
- Checks for presence and validity of JWT
- Adds user ID and role to request headers
- Redirects unauthenticated users to login page
- Prevents authenticated users from accessing login/register pages
- Restricts access to admin routes based on user role

This authentication system provides a solid foundation for user management and authentication in a Next.js application. It combines traditional email/password authentication with OAuth support, role-based access control, and secure session management using JWTs.

