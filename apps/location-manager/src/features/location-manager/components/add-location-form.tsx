"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLocationStore } from "../store/locationStore"
import { PlusCircle, MapPin, Loader2 } from "lucide-react"
import { useToast } from "@/components/toast-provider"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { LocationInput } from "../api/server-actions"
import { geocodeAddress } from "../utils/geocoding"

export function AddLocationForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGeocoding, setIsGeocoding] = useState(false)
  const [name, setName] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [country, setCountry] = useState("")
  const [latitude, setLatitude] = useState("")
  const [longitude, setLongitude] = useState("")
  const [status, setStatus] = useState<"active" | "inactive" | "pending">("active")

  const { addLocation } = useLocationStore()
  const { showToast } = useToast()

  async function handleGeocodeAddress() {
    if (!address || !city || !country) {
      showToast({ 
        type: "error", 
        title: "Missing address information", 
        description: "Please fill in the address, city, and country fields" 
      })
      return
    }

    setIsGeocoding(true)
    try {
      const result = await geocodeAddress(address, city, country)
      if (result.error) {
        showToast({ type: "error", title: "Geocoding failed", description: result.error })
        return
      }
      
      setLatitude(result.latitude.toString())
      setLongitude(result.longitude.toString())
      showToast({ type: "success", title: "Coordinates found", description: "Latitude and longitude have been set automatically" })
    } catch (error) {
      showToast({ 
        type: "error", 
        title: "Geocoding failed", 
        description: error instanceof Error ? error.message : "Failed to get coordinates" 
      })
    } finally {
      setIsGeocoding(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (isSubmitting) return

    if (!name || !address || !city || !country || !latitude || !longitude) {
      showToast({ type: "error", title: "Please fill in all fields" })
      return
    }

    setIsSubmitting(true)
    showToast({ type: "loading", title: "Adding new location..." })

    try {
      const locationData: LocationInput = {
        name,
        address,
        city,
        country,
        status,
        latitude: Number(latitude),
        longitude: Number(longitude),
      }

      await addLocation(locationData)
      showToast({ type: "success", title: "Location added successfully!" })
      resetForm()
      setIsOpen(false)
    } catch (error) {
      showToast({ 
        type: "error", 
        title: "Failed to add location", 
        description: error instanceof Error ? error.message : "Unknown error occurred" 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  function resetForm() {
    setName("")
    setAddress("")
    setCity("")
    setCountry("")
    setLatitude("")
    setLongitude("")
    setStatus("active")
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Location
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Location</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new location to your list.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Location name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Street address"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Country"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <div className="flex gap-2">
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="Latitude"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <div className="flex gap-2">
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="Longitude"
                />
              </div>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGeocodeAddress}
            disabled={isGeocoding || !address || !city || !country}
          >
            {isGeocoding ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <MapPin className="mr-2 h-4 w-4" />
            )}
            {isGeocoding ? "Getting Coordinates..." : "Get Coordinates from Address"}
          </Button>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(value: "active" | "inactive" | "pending") => setStatus(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Location"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

