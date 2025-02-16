import { z } from "zod"

export const locationSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  city: z.string(),
  country: z.string(),
  status: z.enum(["active", "inactive", "pending"]),
  dateAdded: z.string(),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
})

export type Location = z.infer<typeof locationSchema>

