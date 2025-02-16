"use client"

import { useEffect, useRef, useState, useCallback, useMemo } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { AlertCircle, MapPin, Edit, Eye, Plus, List, Edit2, Trash2 } from "lucide-react"
import { useLocationStore } from "../store/locationStore"
import type { Location, LocationList } from "../types"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Supercluster from "supercluster"
import type { ClusterFeature, PointFeature } from "supercluster"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { geocodeAddress } from "../utils/geocoding"

// Set mapbox token from environment variable
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ""

console.log("Mapbox Token:", process.env.NEXT_PUBLIC_MAPBOX_TOKEN)

interface MapComponentProps {
  locations: Location[]
}

type LocationCluster = ClusterFeature<Location> | PointFeature<Location>

export const MapComponent = ({ locations }: MapComponentProps) => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [mapError, setMapError] = useState<string | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [isAddingLocation, setIsAddingLocation] = useState(false)
  const [newLocation, setNewLocation] = useState<Partial<Location>>({})
  const { addLocation } = useLocationStore()
  const [isManagingLists, setIsManagingLists] = useState(false)
  const [newList, setNewList] = useState<Partial<LocationList>>({})
  const { 
    lists, 
    activeListId, 
    addList, 
    removeList, 
    updateList, 
    setActiveList 
  } = useLocationStore()

  const markersRef = useRef<{ [id: string]: mapboxgl.Marker }>({})

  const supercluster = useMemo(() => {
    const cluster = new Supercluster({
      radius: 40,
      maxZoom: 16,
    })

    cluster.load(
      locations.map((loc) => ({
        type: "Feature",
        properties: { ...loc },
        geometry: {
          type: "Point",
          coordinates: [loc.longitude, loc.latitude],
        },
      })),
    )

    return cluster
  }, [locations])

  const updateMarkers = useCallback(() => {
    if (!map.current || !supercluster) return

    const bounds = map.current.getBounds()
    if (!bounds) return

    const zoom = Math.floor(map.current.getZoom())

    const bbox: [number, number, number, number] = [
      bounds.getWest(),
      bounds.getSouth(),
      bounds.getEast(),
      bounds.getNorth()
    ]

    const clusters = supercluster.getClusters(bbox, zoom) as Array<LocationCluster>

    // Use a Set to keep track of markers that should remain
    const newMarkers = new Set()

    clusters.forEach((cluster: LocationCluster) => {
      const [lng, lat] = cluster.geometry.coordinates
      const props = cluster.properties as (Location & { cluster?: boolean; point_count?: number; cluster_id?: number })
      const isCluster = props.cluster
      const pointCount = props.point_count || 0
      const clusterId = props.cluster_id || 0

      const id = props.id || `cluster-${clusterId}`

      if (markersRef.current[id]) {
        // Update existing marker
        markersRef.current[id].setLngLat([lng, lat])
        newMarkers.add(id)
      } else {
        // Create new marker
        const el = document.createElement("div")
        el.className = "location-marker"

        if (isCluster) {
          el.innerHTML = `<div class="cluster-marker">${pointCount}</div>`
          el.style.cssText = `
            width: ${Math.min(pointCount * 5 + 30, 60)}px;
            height: ${Math.min(pointCount * 5 + 30, 60)}px;
            border-radius: 50%;
            background-color: rgba(0, 248, 224, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            color: #000;
            font-weight: bold;
            transition: all 0.2s ease;
            cursor: pointer;
          `
        } else {
          // Create SVG pin marker
          el.innerHTML = `
            <div class="pin-marker ${cluster.properties.status}">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <div class="pin-popup">
                <div class="pin-content">
                  <strong>${cluster.properties.name}</strong>
                  <p>${cluster.properties.address}</p>
                  <div class="pin-actions">
                    <button class="view-btn" title="View Details">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                    <button class="edit-btn" title="Edit Location">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          `
          
          // Add styles for the marker
          const style = document.createElement('style')
          style.textContent = `
            .pin-marker {
              position: relative;
              cursor: pointer;
              width: 24px;
              height: 24px;
              transition: all 0.2s ease;
            }
            .pin-marker svg {
              filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
            }
            .pin-marker.active svg {
              color: #00F8E0;
            }
            .pin-marker.inactive svg {
              color: #666;
            }
            .pin-marker.pending svg {
              color: #FFA500;
            }
            .pin-marker:hover {
              transform: scale(1.2);
            }
            .pin-popup {
              position: absolute;
              bottom: 100%;
              left: 50%;
              transform: translateX(-50%) translateY(-10px);
              background: #1f1f1f;
              border-radius: 8px;
              padding: 12px;
              width: 200px;
              opacity: 0;
              visibility: hidden;
              transition: all 0.2s ease;
              pointer-events: none;
              box-shadow: 0 4px 12px rgba(0,0,0,0.2);
              z-index: 1000;
            }
            .pin-marker:hover .pin-popup {
              opacity: 1;
              visibility: visible;
              transform: translateX(-50%) translateY(0);
              pointer-events: all;
            }
            .pin-content {
              color: white;
              font-size: 12px;
            }
            .pin-content strong {
              display: block;
              margin-bottom: 4px;
            }
            .pin-content p {
              margin: 0;
              opacity: 0.7;
            }
            .pin-actions {
              display: flex;
              gap: 8px;
              margin-top: 8px;
              justify-content: flex-end;
            }
            .pin-actions button {
              background: none;
              border: none;
              padding: 4px;
              cursor: pointer;
              color: #00F8E0;
              border-radius: 4px;
              transition: all 0.2s ease;
            }
            .pin-actions button:hover {
              background: rgba(0,248,224,0.1);
            }
          `
          document.head.appendChild(style)
        }

        const marker = new mapboxgl.Marker(el).setLngLat([lng, lat]).addTo(map.current!)

        if (isCluster) {
          marker.getElement().addEventListener("click", () => {
            const expansionZoom = supercluster.getClusterExpansionZoom(clusterId)
            map.current!.easeTo({
              center: [lng, lat],
              zoom: expansionZoom,
            })
          })
        } else {
          const viewBtn = el.querySelector('.view-btn')
          const editBtn = el.querySelector('.edit-btn')

          viewBtn?.addEventListener('click', (e) => {
            e.stopPropagation()
            setSelectedLocation(cluster.properties as Location)
          })

          editBtn?.addEventListener('click', (e) => {
            e.stopPropagation()
            setNewLocation(cluster.properties as Location)
            setIsAddingLocation(true)
          })
        }

        markersRef.current[id] = marker
        newMarkers.add(id)
      }
    })

    // Remove markers that are no longer needed
    Object.keys(markersRef.current).forEach((id) => {
      if (!newMarkers.has(id)) {
        markersRef.current[id].remove()
        delete markersRef.current[id]
      }
    })
  }, [supercluster, map.current])

  useEffect(() => {
    if (!mapContainer.current) return

    if (!mapboxgl.accessToken) {
      console.error("Mapbox token is not configured")
      setMapError("Mapbox token is not configured")
      return
    }

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/dark-v10",
        center: [4.9041, 52.3676], // Amsterdam as default
        zoom: 11,
        pitch: 45,
        bearing: 0
      })

      map.current.on("load", () => {
        if (locations.length > 0) {
          // Start with the first location
          const primaryLocation = locations[0]
          const bounds = new mapboxgl.LngLatBounds()
          locations.forEach((location) => {
            bounds.extend([location.longitude, location.latitude])
          })

          // Immediately jump to first location
          map.current?.jumpTo({
            center: [primaryLocation.longitude, primaryLocation.latitude],
            zoom: 15,
            pitch: 45,
            bearing: 0
          })

          // Then smoothly fit to show all locations
          setTimeout(() => {
            map.current?.fitBounds(bounds, {
              padding: 50,
              duration: 2000,
              pitch: 0,
              bearing: 0
            })
          }, 1500)
        }
        updateMarkers()
      })

      map.current.on("moveend", updateMarkers)

      const handleMapClick = async (e: mapboxgl.MapMouseEvent) => {
        const { lng, lat } = e.lngLat
        
        try {
          // Reverse geocode the clicked coordinates
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`
          )
          const data = await response.json()
          
          if (data.features && data.features.length > 0) {
            const feature = data.features[0]
            const address = feature.place_name?.split(',')[0] || ''
            const city = data.features.find((f: any) => f.place_type.includes('place'))?.text || ''
            const country = data.features.find((f: any) => f.place_type.includes('country'))?.text || ''
            
            setNewLocation((prev) => ({
              ...prev,
              name: `Location at ${address}`,
              address,
              city,
              country,
              latitude: lat,
              longitude: lng,
              status: "active",
            }))
          } else {
            setNewLocation((prev) => ({
              ...prev,
              name: `New Location`,
              latitude: lat,
              longitude: lng,
              status: "active",
            }))
          }
        } catch (error) {
          console.error('Reverse geocoding error:', error)
          setNewLocation((prev) => ({
            ...prev,
            name: `New Location`,
            latitude: lat,
            longitude: lng,
            status: "active",
          }))
        }
        
        setIsAddingLocation(true)
      }
      
      map.current.on("click", handleMapClick)

      map.current.on("error", (e) => {
        console.error("Mapbox error:", e)
        setMapError("Error loading map: " + e.error)
      })
    } catch (error) {
      console.error("Map initialization error:", error)
      setMapError("Error initializing map: " + (error instanceof Error ? error.message : String(error)))
    }

    return () => {
      map.current?.remove()
    }
  }, [locations])

  useEffect(() => {
    updateMarkers()
  }, [locations, updateMarkers, map.current])

  const handleAddLocation = useCallback(async () => {
    if (!newLocation.name || !newLocation.latitude || !newLocation.longitude) {
      return
    }

    await addLocation({
      ...newLocation,
      id: "",
      address: newLocation.address || "",
      city: newLocation.city || "",
      country: newLocation.country || "",
      status: newLocation.status || "active",
      dateAdded: new Date().toISOString(),
      isFavorite: false,
      listId: activeListId || lists[0]?.id || crypto.randomUUID(),
    } as Location)
    
    // Update map without animation after adding locationz
    if (map.current) {
      map.current.setCenter([newLocation.longitude, newLocation.latitude])
      map.current.setZoom(15)
    }
    
    setNewLocation({})
    setIsAddingLocation(false)
  }, [newLocation, addLocation, activeListId, lists])

  const [isCalculatingCoords, setIsCalculatingCoords] = useState(false)

  const calculateCoordinates = async (
    searchText: string,
    type: 'address' | 'postalCode' | 'city' | 'country'
  ) => {
    if (!searchText) return
    
    setIsCalculatingCoords(true)
    try {
      // Build search query based on existing information
      let query = searchText
      if (type !== 'address' && newLocation.address) {
        query = `${newLocation.address}, ${query}`
      }
      if (type !== 'city' && newLocation.city) {
        query = `${query}, ${newLocation.city}`
      }
      if (type !== 'country' && newLocation.country) {
        query = `${query}, ${newLocation.country}`
      }

      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxgl.accessToken}&types=address,postcode,place,country`
      )
      const data = await response.json()

      if (data.features && data.features.length > 0) {
        const feature = data.features[0]
        const context = feature.context || []
        
        // Extract all relevant information
        const address = type === 'address' ? searchText : newLocation.address || feature.address || feature.text || ''
        const postalCode = context.find((c: any) => c.id.includes('postcode'))?.text || newLocation.postalCode || ''
        const city = type === 'city' ? searchText : (
          context.find((c: any) => c.id.includes('place'))?.text || 
          newLocation.city || 
          ''
        )
        const country = type === 'country' ? searchText : (
          context.find((c: any) => c.id.includes('country'))?.text || 
          newLocation.country || 
          ''
        )
        
        const [lng, lat] = feature.center || [newLocation.longitude, newLocation.latitude]

        setNewLocation(prev => ({
          ...prev,
          address,
          postalCode,
          city,
          country,
          latitude: lat,
          longitude: lng,
          name: prev.name || `${address}, ${city}`
        }))

        // Update map center without animation
        if (map.current && lng && lat) {
          map.current.setCenter([lng, lat])
          map.current.setZoom(15)
        }
      }
    } catch (error) {
      console.error('Error calculating coordinates:', error)
    } finally {
      setIsCalculatingCoords(false)
    }
  }

  // Filter locations based on active list
  const filteredLocations = useMemo(() => {
    if (!activeListId) return locations
    return locations.filter(loc => loc.listId === activeListId)
  }, [locations, activeListId])

  if (mapError) {
    return (
      <div className="w-full h-full bg-[#1f1f1f] flex items-center justify-center">
        <div className="text-center text-[#666]">
          <AlertCircle className="h-12 w-12 mx-auto mb-4" />
          <p className="text-sm">{mapError}</p>
          <p className="text-xs mt-2">Please check your Mapbox configuration</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div ref={mapContainer} className="w-full h-full relative">
        {/* List Management UI */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
          <Button
            onClick={() => setIsManagingLists(true)}
            className="bg-[#1f1f1f] text-white hover:bg-[#2f2f2f]"
          >
            <List className="w-4 h-4 mr-2" />
            Manage Lists
          </Button>
        </div>
      </div>

      {/* List Management Dialog */}
      <Dialog open={isManagingLists} onOpenChange={setIsManagingLists}>
        <DialogContent className="sm:max-w-[425px] bg-[#1f1f1f] text-white">
          <DialogHeader>
            <DialogTitle>Manage Location Lists</DialogTitle>
            <DialogDescription>Create and manage your location lists.</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Create New List Form */}
            <div className="flex items-center gap-2">
              <Input
                placeholder="New list name"
                value={newList.name || ""}
                onChange={(e) => setNewList({ name: e.target.value })}
                className="flex-1 bg-[#2f2f2f] border-[#3f3f3f] text-white"
              />
              <Button
                onClick={() => {
                  if (newList.name) {
                    addList({ name: newList.name })
                    setNewList({})
                  }
                }}
                disabled={!newList.name}
                className="bg-[#00F8E0] text-black hover:bg-[#00D8C0]"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* List of Lists */}
            <div className="space-y-2">
              {lists.map((list) => (
                <div
                  key={list.id}
                  className={`flex items-center justify-between p-3 rounded-md ${
                    activeListId === list.id ? "bg-[#00F8E0] text-black" : "bg-[#2f2f2f]"
                  }`}
                >
                  <div className="flex-1">
                    <h4 className="font-medium">{list.name}</h4>
                    <p className="text-sm opacity-70">
                      {filteredLocations.filter(loc => loc.listId === list.id).length} locations
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveList(list.id)}
                      className={activeListId === list.id ? "text-black" : "text-white"}
                    >
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newName = window.prompt("Enter new name", list.name)
                        if (newName) updateList(list.id, { name: newName })
                      }}
                      className={activeListId === list.id ? "text-black" : "text-white"}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (window.confirm("Are you sure you want to delete this list?")) {
                          removeList(list.id)
                        }
                      }}
                      className={activeListId === list.id ? "text-black" : "text-white"}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={selectedLocation !== null} onOpenChange={() => setSelectedLocation(null)}>
        <DialogContent className="sm:max-w-[425px] bg-[#1f1f1f] text-white">
          <DialogHeader>
            <DialogTitle>{selectedLocation?.name}</DialogTitle>
            <DialogDescription>
              {selectedLocation?.address}, {selectedLocation?.city}, {selectedLocation?.country}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <div className="col-span-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold
                  ${
                    selectedLocation?.status === "active"
                      ? "bg-green-500 text-white"
                      : selectedLocation?.status === "inactive"
                        ? "bg-red-500 text-white"
                        : "bg-yellow-500 text-black"
                  }`}
                >
                  {selectedLocation?.status}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dateAdded" className="text-right">
                Date Added
              </Label>
              <div className="col-span-3">{new Date(selectedLocation?.dateAdded || "").toLocaleDateString()}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="favorite" className="text-right">
                Favorite
              </Label>
              <div className="col-span-3">{selectedLocation?.isFavorite ? "Yes" : "No"}</div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={isAddingLocation} onOpenChange={setIsAddingLocation}>
        <DialogContent className="sm:max-w-[425px] bg-[#1f1f1f] text-white">
          <DialogHeader>
            <DialogTitle>Add New Location</DialogTitle>
            <DialogDescription>Fill in the details for the new location.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input
                id="name"
                value={newLocation.name || ""}
                onChange={(e) => setNewLocation(prev => ({ ...prev, name: e.target.value }))}
                className="col-span-3 bg-[#2f2f2f] border-[#3f3f3f] text-white"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">Address</Label>
              <Input
                id="address"
                value={newLocation.address || ""}
                onChange={(e) => {
                  const address = e.target.value
                  setNewLocation(prev => ({ ...prev, address }))
                  if (address) {
                    calculateCoordinates(address, 'address')
                  }
                }}
                className="col-span-3 bg-[#2f2f2f] border-[#3f3f3f] text-white"
                placeholder="Street name and number"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="postalCode" className="text-right">Postal Code</Label>
              <Input
                id="postalCode"
                value={newLocation.postalCode || ""}
                onChange={(e) => {
                  const postalCode = e.target.value
                  setNewLocation(prev => ({ ...prev, postalCode }))
                  if (postalCode) {
                    calculateCoordinates(postalCode, 'postalCode')
                  }
                }}
                className="col-span-3 bg-[#2f2f2f] border-[#3f3f3f] text-white"
                placeholder="Postal code"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="city" className="text-right">City</Label>
              <Input
                id="city"
                value={newLocation.city || ""}
                onChange={(e) => {
                  const city = e.target.value
                  setNewLocation(prev => ({ ...prev, city }))
                  if (city) {
                    calculateCoordinates(city, 'city')
                  }
                }}
                className="col-span-3 bg-[#2f2f2f] border-[#3f3f3f] text-white"
                placeholder="City"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="country" className="text-right">Country</Label>
              <Input
                id="country"
                value={newLocation.country || ""}
                onChange={(e) => {
                  const country = e.target.value
                  setNewLocation(prev => ({ ...prev, country }))
                  if (country) {
                    calculateCoordinates(country, 'country')
                  }
                }}
                className="col-span-3 bg-[#2f2f2f] border-[#3f3f3f] text-white"
                placeholder="Country"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Coordinates</Label>
              <div className="col-span-3 text-sm flex items-center gap-2">
                {isCalculatingCoords ? (
                  <div className="flex items-center gap-2 text-[#00F8E0]">
                    <AlertCircle className="h-4 w-4 animate-spin" />
                    Calculating...
                  </div>
                ) : (
                  <>
                    <span>Lat: {newLocation.latitude?.toFixed(4) || "N/A"}</span>
                    <span>Lng: {newLocation.longitude?.toFixed(4) || "N/A"}</span>
                  </>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">Status</Label>
              <Select
                value={newLocation.status || "active"}
                onValueChange={(value) => setNewLocation(prev => ({ ...prev, status: value as "active" | "inactive" | "pending" }))}
              >
                <SelectTrigger className="col-span-3 bg-[#2f2f2f] border-[#3f3f3f] text-white">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-[#2f2f2f] border-[#3f3f3f] text-white">
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="submit" 
              onClick={handleAddLocation} 
              disabled={isCalculatingCoords || !newLocation.name || !newLocation.latitude || !newLocation.longitude}
              className="bg-[#00F8E0] text-black hover:bg-[#00D8C0]"
            >
              {isCalculatingCoords ? "Calculating..." : "Add Location"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

