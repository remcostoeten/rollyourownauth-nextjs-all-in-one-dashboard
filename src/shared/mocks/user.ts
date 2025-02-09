import { z } from 'zod'

export const zMockUser = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  avatar: z.string().optional(),
  role: z.enum(['admin', 'user', 'guest']),
  settings: z.object({
    theme: z.enum(['light', 'dark', 'system']).default('system'),
    notifications: z.boolean().default(true),
    language: z.string().default('en'),
  }).optional(),
  metadata: z.record(z.unknown()).optional()
})

export type MockUser = z.infer<typeof zMockUser>

export const defaultMockUser: MockUser = {
  id: 'mock-user-1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: '/avatars/default.png',
  role: 'user',
  settings: {
    theme: 'system',
    notifications: true,
    language: 'en'
  }
}

export const mockUsers: MockUser[] = [
  defaultMockUser,
  {
    id: 'mock-user-2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    avatar: '/avatars/jane.png',
    role: 'admin',
    settings: {
      theme: 'dark',
      notifications: true,
      language: 'en'
    }
  },
  {
    id: 'mock-user-3',
    name: 'Guest User',
    email: 'guest@example.com',
    role: 'guest',
    settings: {
      theme: 'light',
      notifications: false,
      language: 'en'
    }
  }
]

export const getMockUser = (id: string) => mockUsers.find(user => user.id === id)
export const getMockUserByEmail = (email: string) => mockUsers.find(user => user.email === email) 