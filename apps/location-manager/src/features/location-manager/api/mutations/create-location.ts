import { z } from "zod"
import type { Location } from "../../types"

const createLocationSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  country: z.string().min(1),
  status: z.enum(["active", "inactive", "pending"]),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
})

export async function createLocation(data: z.infer<typeof createLocationSchema>): Promise<Location> {
  const validatedData = createLocationSchema.parse(data)

  const response = await fetch("/api/locations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...validatedData,
      latitude: validatedData.coordinates.lat,
      longitude: validatedData.coordinates.lng,
      dateAdded: new Date().toISOString(),
      isFavorite: false,
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to create location")
  }

  return response.json()
}

