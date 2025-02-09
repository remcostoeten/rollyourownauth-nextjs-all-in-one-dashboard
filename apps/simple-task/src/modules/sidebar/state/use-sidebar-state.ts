import { create } from 'zustand'
import type { NavItem } from '../models/z.nav-item'

interface SidebarState {
  isVisible: boolean
  isLocked: boolean
  activeItem: string
  navItems: NavItem[]
  searchQuery: string
  setVisible: (isVisible: boolean) => void
  setLocked: (isLocked: boolean) => void
  setActiveItem: (id: string) => void
  setNavItems: (items: NavItem[]) => void
  setSearchQuery: (query: string) => void
  reorderNavItems: (sourceIndex: number, destinationIndex: number) => void
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isVisible: true,
  isLocked: false,
  activeItem: 'inbox',
  navItems: [],
  searchQuery: '',
  setVisible: (isVisible) => set({ isVisible }),
  setLocked: (isLocked) => set({ isLocked }),
  setActiveItem: (activeItem) => set({ activeItem }),
  setNavItems: (navItems) => set({ navItems }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  reorderNavItems: (sourceIndex, destinationIndex) =>
    set((state) => {
      const items = [...state.navItems]
      const [reorderedItem] = items.splice(sourceIndex, 1)
      items.splice(destinationIndex, 0, reorderedItem)
      return { navItems: items }
    }),
})) 