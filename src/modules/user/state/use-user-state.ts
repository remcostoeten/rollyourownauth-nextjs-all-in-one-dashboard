import { create } from 'zustand'
import type { User } from '../models/z.user'

interface UserState {
  currentUser: User | null
  setCurrentUser: (user: User | null) => void
}

export const useUserStore = create<UserState>((set) => ({
  currentUser: {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: '/placeholder.svg'
  },
  setCurrentUser: (user) => set({ currentUser: user })
})) 