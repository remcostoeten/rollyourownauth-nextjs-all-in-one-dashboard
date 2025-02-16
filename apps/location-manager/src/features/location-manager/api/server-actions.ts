'use server'

import { db } from "@/server/db"
import { locations } from "@/server/db/schema"
import { eq } from "drizzle-orm"
import { v4 as uuidv4 } from "uuid"
import { revalidatePath } from "next/cache"

export type LocationInput = {
  name: string
  address: string
  city: string
  country: string
  status: "active" | "inactive" | "pending"
  latitude: number
  longitude: number
  isFavorite?: boolean
}

export async function getLocations() {
  try {
    const allLocations = await db.select().from(locations)
    return { data: allLocations, error: null }
  } catch (error) {
    console.error('Error fetching locations:', error)
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch locations'
    }
  }
}

export async function createLocation(data: LocationInput) {
  try {
    const locationData = {
      ...data,
      id: uuidv4(),
      dateAdded: new Date().toISOString(),
    }
    const [newLocation] = await db.insert(locations).values(locationData).returning()
    revalidatePath('/') // Adjust this path based on your routes
    return { data: newLocation, error: null }
  } catch (error) {
    console.error('Error creating location:', error)
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to create location'
    }
  }
}

export async function updateLocation(id: string, data: Partial<LocationInput>) {
  try {
    const [updatedLocation] = await db
      .update(locations)
      .set(data)
      .where(eq(locations.id, id))
      .returning()
    revalidatePath('/') // Adjust this path based on your routes
    return { data: updatedLocation, error: null }
  } catch (error) {
    console.error('Error updating location:', error)
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to update location'
    }
  }
}

export async function deleteLocation(id: string) {
  try {
    await db.delete(locations).where(eq(locations.id, id))
    revalidatePath('/') // Adjust this path based on your routes
    return { error: null }
  } catch (error) {
    console.error('Error deleting location:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to delete location'
    }
  }
} 