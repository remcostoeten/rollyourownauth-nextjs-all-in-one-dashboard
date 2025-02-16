import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Location, LocationList } from "../types"
import { getLocations } from "../api/server-actions"

interface LocationStore {
  locations: Location[]
  lists: LocationList[]
  activeListId: string | null
  dateFilter: Date | null
  addLocation: (location: Location) => void
  removeLocation: (id: string) => void
  updateLocation: (id: string, location: Partial<Location>) => void
  addList: (list: Omit<LocationList, 'id' | 'dateCreated'>) => void
  removeList: (id: string) => void
  updateList: (id: string, list: Partial<LocationList>) => void
  setActiveList: (id: string | null) => void
  setDateFilter: (date: Date | null) => void
  fetchLocations: () => void
}

export const useLocationStore = create<LocationStore>()(
  persist(
    (set) => ({
      locations: [],
      lists: [],
      activeListId: null,
      dateFilter: null,
      addLocation: (location) =>
        set((state) => ({
          locations: [...state.locations, { ...location, id: crypto.randomUUID() }],
        })),
      removeLocation: (id) =>
        set((state) => ({
          locations: state.locations.filter((loc) => loc.id !== id),
        })),
      updateLocation: (id, location) =>
        set((state) => ({
          locations: state.locations.map((loc) =>
            loc.id === id ? { ...loc, ...location } : loc
          ),
        })),
      addList: (list) =>
        set((state) => ({
          lists: [...state.lists, {
            ...list,
            id: crypto.randomUUID(),
            dateCreated: new Date().toISOString()
          }],
          activeListId: state.activeListId || state.lists.length === 0 ? crypto.randomUUID() : state.activeListId,
        })),
      removeList: (id) =>
        set((state) => ({
          lists: state.lists.filter((list) => list.id !== id),
          locations: state.locations.filter((loc) => loc.listId !== id),
          activeListId: state.activeListId === id ? (state.lists[0]?.id || null) : state.activeListId,
        })),
      updateList: (id, list) =>
        set((state) => ({
          lists: state.lists.map((l) =>
            l.id === id ? { ...l, ...list } : l
          ),
        })),
      setActiveList: (id) =>
        set(() => ({
          activeListId: id,
        })),
      setDateFilter: (date) =>
        set(() => ({
          dateFilter: date,
        })),
      fetchLocations: async () => {
        const locations = await getLocations()
      },
    }),
    {
      name: "location-store",
    }
  )
)

