export interface Location {
  id: string
  name: string
  address: string
  city: string
  country: string
  status: "active" | "inactive" | "pending"
  dateAdded: string
  coordinates: {
    lat: number
    lng: number
  }
  isFavorite: boolean
}

export interface LocationManagerProps {
  className?: string
}

