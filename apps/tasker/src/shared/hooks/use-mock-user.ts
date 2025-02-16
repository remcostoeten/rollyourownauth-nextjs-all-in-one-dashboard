import { mockUser, type MockUser } from '@repo/configuration/mock-user'
import { create } from 'zustand'
// Drizzle ORM Imports (Example for SQLite)
// import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
// import { drizzle } from 'drizzle-orm/libsql';
// import { createClient } from '@libsql/client';
// import { eq } from 'drizzle-orm'; // Import eq for WHERE clause

interface MockUserState {
	currentUser: MockUser | null
	setCurrentUser: (user: MockUser | null) => void
	loginWithEmail: (email: string) => MockUser | null
	loginWithId: (id: string) => MockUser | null
	logout: () => void
}

// Drizzle Schema (Example)
// export const users = sqliteTable('users', {
//   id: text('id').primaryKey(), // Explicitly define id as text
//   name: text('name').notNull(),
//   email: text('email').notNull().unique(),
//   avatar: text('avatar'),
// });

// Database Connection (Example)
// const client = createClient({ url: 'libsql://your-database-url.turso.io', authToken: 'your-auth-token' });
// const db = drizzle(client);

async function getMockUserByEmail(email: string): Promise<MockUser | null> {
	// Drizzle Implementation (Example)
	// try {
	//   const result = await db.select().from(users).where(eq(users.email, email)).get();
	//   if (result) {
	//     return {
	//       id: result.id,
	//       name: result.name,
	//       email: result.email,
	//       avatar: result.avatar || '',
	//     };
	//   }
	//   return null; // Explicitly return null if no user is found
	// } catch (error) {
	//   console.error("Database error:", error);
	//   return null; // Handle errors gracefully
	// }

	// Mock Implementation (Replace with Drizzle)
	// Since email is not used, suppress the eslint warning
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const unusedEmail = email
	return mockUser
}

async function getMockUser(id: string): Promise<MockUser | null> {
	// Drizzle Implementation (Example)
	// try {
	//   const result = await db.select().from(users).where(eq(users.id, id)).get();
	//   if (result) {
	//     return {
	//       id: result.id,
	//       name: result.name,
	//       email: result.email,
	//       avatar: result.avatar || '',
	//     };
	//   }
	//   return null; // Explicitly return null if no user is found
	// } catch (error) {
	//   console.error("Database error:", error);
	//   return null; // Handle errors gracefully
	// }

	// Mock Implementation (Replace with Drizzle)
	// Since id is not used, suppress the eslint warning
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const unusedId = id
	return defaultMockUser
}

export const useMockUser = create<MockUserState>(
	(set: (arg0: { currentUser: unknown }) => void) => ({
		currentUser: defaultMockUser,
		setCurrentUser: (user: MockUser | null) => set({ currentUser: user }),
		loginWithEmail: async (email: string) => {
			const user = await getMockUserByEmail(email)
			set({ currentUser: user })
			return user
		},
		loginWithId: async (id: string) => {
			const user = await getMockUser(id)
			set({ currentUser: user })
			return user
		},
		logout: () => set({ currentUser: null })
	})
)
