"use client"

import type React from "react"
import { useState, useCallback, memo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, Trash2, Edit2, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { Location } from "../types"
import { useLocationStore } from "../store/locationStore"
import { useToast } from "@/components/toast-provider"

interface LocationItemProps {
  location: Location
  viewMode: "list" | "grid"
}

export const LocationItem = memo(function LocationItem({ location, viewMode }: LocationItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedLocation, setEditedLocation] = useState(location)
  const { toggleFavorite, deleteLocation, setSelectedLocation, updateLocation } = useLocationStore()
  const { showToast } = useToast()

  const handleEdit = useCallback(() => {
    setIsEditing(true)
  }, [])

  const handleCancel = useCallback(() => {
    setIsEditing(false)
    setEditedLocation(location)
  }, [location])

  const handleSave = useCallback(async () => {
    showToast({ type: "loading", title: "Updating location..." })
    try {
      await updateLocation(location.id, editedLocation)
      setIsEditing(false)
      showToast({ type: "success", title: "Location updated successfully" })
    } catch (error) {
      showToast({ type: "error", title: "Failed to update location" })
    }
  }, [location.id, editedLocation, updateLocation, showToast])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditedLocation((prev) => ({ ...prev, [name]: value }))
  }, [])

  const handleDelete = useCallback(async () => {
    showToast({ type: "loading", title: "Deleting location..." })
    try {
      await deleteLocation(location.id)
      showToast({ type: "success", title: "Location deleted successfully" })
    } catch (error) {
      showToast({ type: "error", title: "Failed to delete location" })
    }
  }, [location.id, deleteLocation, showToast])

  const handleToggleFavorite = useCallback(async () => {
    showToast({ type: "loading", title: "Updating favorite status..." })
    try {
      await toggleFavorite(location.id)
      showToast({ type: "success", title: "Favorite status updated" })
    } catch (error) {
      showToast({ type: "error", title: "Failed to update favorite status" })
    }
  }, [location.id, toggleFavorite, showToast])

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        layout
        className={cn(
          "p-4 rounded bg-[#1f1f1f] hover:bg-[#2f2f2f] cursor-pointer",
          viewMode === "grid" && "flex flex-col"
        )}
        onClick={() => !isEditing && setSelectedLocation(location.id)}
      >
        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.div
              key="editing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              <Input
                name="name"
                value={editedLocation.name}
                onChange={handleChange}
                className="bg-[#2f2f2f] border-[#3f3f3f] text-white"
              />
              <Input
                name="address"
                value={editedLocation.address}
                onChange={handleChange}
                className="bg-[#2f2f2f] border-[#3f3f3f] text-white"
              />
              <Input
                name="city"
                value={editedLocation.city}
                onChange={handleChange}
                className="bg-[#2f2f2f] border-[#3f3f3f] text-white"
              />
              <Input
                name="country"
                value={editedLocation.country}
                onChange={handleChange}
                className="bg-[#2f2f2f] border-[#3f3f3f] text-white"
              />
              <div className="flex justify-end space-x-2 mt-2">
                <Button size="sm" onClick={handleSave}>
                  <Check className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="destructive" onClick={handleCancel}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="viewing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-2">
                <code className="text-xs font-mono text-[#666]">{location.id}</code>
                <span
                  className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-mono uppercase",
                    location.status === "active" && "bg-[#00F8E0]/10 text-[#00F8E0]",
                    location.status === "inactive" && "bg-[#666]/10 text-[#666]",
                    location.status === "pending" && "bg-yellow-500/10 text-yellow-500"
                  )}
                >
                  {location.status}
                </span>
              </div>
              <div className="text-sm font-semibold">{location.name}</div>
              <div className="text-xs text-[#666] mt-1">
                {location.city}, {location.country}
              </div>
              <div className="text-xs text-[#666] mt-1">
                {new Date(location.dateAdded).toLocaleDateString()}
              </div>
              <div className="flex justify-between mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleToggleFavorite()
                  }}
                >
                  <Star
                    className={cn(
                      "h-4 w-4",
                      location.isFavorite ? "text-yellow-500 fill-yellow-500" : "text-[#666]"
                    )}
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleEdit()
                  }}
                >
                  <Edit2 className="h-4 w-4 text-[#666]" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete()
                  }}
                >
                  <Trash2 className="h-4 w-4 text-[#666]" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
})

export default LocationItem