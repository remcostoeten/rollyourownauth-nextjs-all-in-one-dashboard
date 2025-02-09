'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { useMockUser } from '../hooks/use-mock-user'
import type { MockUser } from '../mocks/user'

interface MockUserContextValue {
  user: MockUser | null
  login: (emailOrId: string) => MockUser | null
  logout: () => void
}

const MockUserContext = createContext<MockUserContextValue | undefined>(undefined)

interface MockUserProviderProps {
  children: ReactNode
}

export function MockUserProvider({ children }: MockUserProviderProps) {
  const { currentUser, loginWithEmail, loginWithId, logout } = useMockUser()

  const login = (emailOrId: string) => {
    // Try login with email first, if fails try with ID
    return loginWithEmail(emailOrId) || loginWithId(emailOrId)
  }

  return (
    <MockUserContext.Provider
      value={{
        user: currentUser,
        login,
        logout
      }}
    >
      {children}
    </MockUserContext.Provider>
  )
}

export function useMockUserContext() {
  const context = useContext(MockUserContext)
  if (context === undefined) {
    throw new Error('useMockUserContext must be used within a MockUserProvider')
  }
  return context
} 