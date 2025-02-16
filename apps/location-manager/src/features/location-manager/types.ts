export interface Location {
  id: string
  name: string
  address: string
  postalCode: string
  city: string
  country: string
  status: "active" | "inactive" | "pending"
  dateAdded: string
  latitude: number
  longitude: number
  isFavorite: boolean
  listId: string
  coordinates?: { lat: number; lng: number }
}

export interface LocationList {
  id: string
  name: string
  dateCreated: string
  description?: string
} 