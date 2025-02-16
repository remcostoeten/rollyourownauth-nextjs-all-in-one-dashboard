"use client"

import {
  Bell,
  ChevronDown,
  Filter,
  Layout,
  LogOut,
  MapPin,
  Menu,
  MessageSquare,
  MoreVertical,
  Plane,
  Settings,
  Star,
  SunMedium,
  Wallet,
  Search,
} from "lucide-react"
import Link from "next/link"
import { useState, useMemo, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MapComponent } from "./map-component"
import { TimelineSlider } from "./timeline-slider"
import { AddLocationForm } from "./add-location-form"
import { LocationItem } from "./location-item"
import { useLocationStore } from "../store/locationStore"
import { ToastProvider } from "@/components/toast-provider"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const LocationManager = () => {
  const [selectedOrganization, setSelectedOrganization] = useState("Personal")
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "favorite">("all")

  const { locations, dateFilter, fetchLocations } = useLocationStore()

  useEffect(() => {
    fetchLocations()
  }, [fetchLocations])

  const filteredLocations = useMemo(() => {
    return locations.filter(
      (location) =>
        (location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          location.country.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (!dateFilter || new Date(location.dateAdded) <= dateFilter) &&
        (activeFilter === "all" ||
          (activeFilter === "active" && location.status === "active") ||
          (activeFilter === "favorite" && location.isFavorite)),
    )
  }, [locations, searchTerm, dateFilter, activeFilter])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }, [])

  const handleViewModeChange = useCallback((mode: "list" | "grid") => {
    setViewMode(mode)
  }, [])

  const favoriteLocationsCount = useMemo(() => {
    return locations.filter((loc) => loc.isFavorite).length
  }, [locations])

  const handleFilterAll = useCallback(() => setActiveFilter("all"), [])
  const handleFilterActive = useCallback(() => setActiveFilter("active"), [])
  const handleFilterFavorite = useCallback(() => setActiveFilter("favorite"), [])

  const renderLocationItems = useCallback(() => {
    return filteredLocations.map((location) => (
      <LocationItem key={location.id} location={location} viewMode={viewMode} />
    ))
  }, [filteredLocations, viewMode])

  // Removed useSpring animation
  // const [{ opacity }, set] = useSpring(() => ({ opacity: 1 }));

  // useEffect(() => {
  //   set({ opacity: 0 });
  //   setTimeout(() => set({ opacity: 1 }), 100);
  // }, [set]);

  const MemoizedMapComponent = useMemo(() => <MapComponent locations={filteredLocations} />, [filteredLocations])

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#121212] text-white">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-[#1f1f1f] px-4 py-2">
          <div className="flex items-center space-x-1">
            <span className="text-[#00F8E0] font-medium">SMART</span>
            <span className="text-xs font-mono tracking-wider">LOCATIONS</span>
          </div>
          <div className="flex items-center space-x-6">
            <Link href="#" className="text-[#666] hover:text-white text-xs">
              Prohibited goods
            </Link>
            <Link href="#" className="text-[#666] hover:text-white text-xs">
              Partnerse
            </Link>
            <Link href="#" className="text-[#666] hover:text-white text-xs">
              Contact
            </Link>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="w-8 h-8">
                <SunMedium className="h-4 w-4 text-[#666]" />
              </Button>
              <Button variant="ghost" size="icon" className="w-8 h-8 relative">
                <Bell className="h-4 w-4 text-[#666]" />
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
              </Button>
              <Button variant="ghost" size="icon" className="w-8 h-8">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-l4F6J1G8QL5CISVqGl6C6I7UAsENQy.png"
                  alt="Avatar"
                  className="h-full w-full rounded-full"
                />
              </Button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-[280px_1fr]">
          {/* Sidebar */}
          <aside className="border-r border-[#1f1f1f] p-4 bg-[#121212] h-screen overflow-y-auto">
            <div className="mb-8">
              <Button variant="ghost" className="w-full justify-between text-white hover:bg-[#1f1f1f]">
                <div className="flex items-center">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-l4F6J1G8QL5CISVqGl6C6I7UAsENQy.png"
                    alt="Organization"
                    className="mr-2 h-6 w-6 rounded-full"
                  />
                  {selectedOrganization}
                </div>
                <ChevronDown className="h-4 w-4 text-[#666]" />
              </Button>
            </div>

            <nav className="space-y-6">
              <div>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-[#666] hover:text-white hover:bg-[#1f1f1f]"
                >
                  <Layout className="mr-2 h-4 w-4" />
                  Overview
                </Button>
              </div>

              <div className="space-y-1">
                <div className="px-2 text-xs font-medium text-[#666]">Locations</div>
                <Button
                  variant={activeFilter === "all" ? "default" : "ghost"}
                  className="w-full justify-start text-[#666] hover:text-white hover:bg-[#1f1f1f]"
                  onClick={handleFilterAll}
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  All Locations
                  <span className="ml-auto text-xs bg-[#1f1f1f] px-1.5 rounded-md">{locations.length}</span>
                </Button>
                <Button
                  variant={activeFilter === "active" ? "default" : "ghost"}
                  className="w-full justify-start text-[#666] hover:text-white hover:bg-[#1f1f1f]"
                  onClick={handleFilterActive}
                >
                  <Plane className="mr-2 h-4 w-4" />
                  Active Locations
                  <span className="ml-auto text-xs bg-[#1f1f1f] px-1.5 rounded-md">
                    {locations.filter((loc) => loc.status === "active").length}
                  </span>
                </Button>
                <Button
                  variant={activeFilter === "favorite" ? "default" : "ghost"}
                  className="w-full justify-start text-[#666] hover:text-white hover:bg-[#1f1f1f]"
                  onClick={handleFilterFavorite}
                >
                  <Star className="mr-2 h-4 w-4" />
                  Favorite Locations
                  <span className="ml-auto text-xs bg-[#1f1f1f] px-1.5 rounded-md">{favoriteLocationsCount}</span>
                </Button>
              </div>

              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-[#666] hover:text-white hover:bg-[#1f1f1f]"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Messages
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-[#666] hover:text-white hover:bg-[#1f1f1f]"
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  Payments
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-[#666] hover:text-white hover:bg-[#1f1f1f]"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </div>
            </nav>

            <div className="mt-8">
              <AddLocationForm />
            </div>

            <div className="absolute bottom-4 space-y-2">
              <Button variant="ghost" className="w-full justify-start text-[#666] hover:text-white hover:bg-[#1f1f1f]">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
              <Button variant="ghost" className="w-full justify-start text-[#666] hover:text-white hover:bg-[#1f1f1f]">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </aside>

          {/* Main content */}
          <main className="bg-[#121212]">
            <div className="p-4 border-b border-[#1f1f1f] flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-lg font-semibold">
                  {activeFilter === "all"
                    ? "All Locations"
                    : activeFilter === "active"
                      ? "Active Locations"
                      : "Favorite Locations"}
                </h1>
                <Button variant="ghost" size="icon">
                  <Filter className="h-4 w-4 text-[#666]" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4 text-[#666]" />
                </Button>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  className="border-[#1f1f1f] bg-transparent hover:bg-[#1f1f1f] text-xs"
                  onClick={() => handleViewModeChange("grid")}
                >
                  <Layout className="mr-2 h-4 w-4" />
                  Grid view
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  className="border-[#1f1f1f] bg-transparent hover:bg-[#1f1f1f] text-xs"
                  onClick={() => handleViewModeChange("list")}
                >
                  <Menu className="mr-2 h-4 w-4" />
                  List view
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-[350px_1fr]">
              <div className="border-r border-[#1f1f1f] p-4">
                <div className="relative mb-4">
                  <Input
                    type="search"
                    placeholder="Search locations..."
                    className="bg-[#1f1f1f] border-0 text-white placeholder-[#666] pl-10 text-sm"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#666]" />
                </div>

                <div className="transition-all duration-300 ease-in-out">
                  {" "}
                  {/* Removed animated.div */}
                  {filteredLocations.length === 0 ? (
                    <div className="text-center text-[#666] py-4">
                      <p>No locations found</p>
                    </div>
                  ) : (
                    <motion.div
                      layout
                      className={cn("space-y-2", viewMode === "grid" && "grid grid-cols-2 gap-2 space-y-0")}
                    >
                      <AnimatePresence>{renderLocationItems()}</AnimatePresence>
                    </motion.div>
                  )}
                </div>
              </div>

              <div className="relative h-[calc(100vh-9rem)]">
                {MemoizedMapComponent}
                <TimelineSlider />
              </div>
            </div>
          </main>
        </div>
      </div>
    </ToastProvider>
  )
}

export { LocationManager }

