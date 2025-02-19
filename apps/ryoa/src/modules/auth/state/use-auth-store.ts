import { create, StateCreator } from "zustand"

type User = {
  id: string
  email: string
  role: "user" | "admin"
}

export type AuthStore = {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>((set: StateCreator<AuthStore>['set']) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  setUser: (user: User | null) => set({ user, isAuthenticated: !!user, isLoading: false }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  logout: () => set({ user: null, isAuthenticated: false }),
})) 