import { create } from 'zustand'
import type { MockUser } from '../mocks/user'
import { defaultMockUser, getMockUser, getMockUserByEmail } from '../mocks/user'

interface MockUserState {
  currentUser: MockUser | null
  setCurrentUser: (user: MockUser | null) => void
  loginWithEmail: (email: string) => MockUser | null
  loginWithId: (id: string) => MockUser | null
  logout: () => void
}

export const useMockUser = create<MockUserState>((set) => ({
  currentUser: defaultMockUser,
  setCurrentUser: (user) => set({ currentUser: user }),
  loginWithEmail: (email) => {
    const user = getMockUserByEmail(email)
    set({ currentUser: user || null })
    return user || null
  },
  loginWithId: (id) => {
    const user = getMockUser(id)
    set({ currentUser: user || null })
    return user || null
  },
  logout: () => set({ currentUser: null })
})) 