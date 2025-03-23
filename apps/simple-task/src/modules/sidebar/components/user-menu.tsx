"use client"

import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "ui"
import { Settings, LogOut, User, Moon, Sun } from "lucide-react"
import { mockUser } from "config"
import { useTheme } from "next-themes"
import Image from "next/image"
import { cn } from "helpers"
import { SettingsModal } from "./settings-modal"

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const { theme, setTheme } = useTheme()

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <button 
            className={cn(
              "flex items-center gap-2 w-full p-2 rounded-md",
              "hover:bg-[#1C1C1C] transition-colors duration-150",
              "focus:outline-none"
            )}
          >
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#2A2A2A]">
              <Image
                src={mockUser.profile.avatar}
                alt={`${mockUser.profile.firstName}'s avatar`}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-gray-200">
                {mockUser.profile.firstName} {mockUser.profile.lastName}
              </p>
              <p className="text-xs text-gray-500">{mockUser.email}</p>
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="w-56 bg-[#0A0A0A]/95 backdrop-blur-sm border-[#1C1C1C]"
          align="end"
          sideOffset={8}
        >
          <DropdownMenuLabel className="text-gray-400">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium text-gray-200">
                {mockUser.profile.firstName} {mockUser.profile.lastName}
              </p>
              <p className="text-xs font-normal text-gray-500">{mockUser.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-[#1C1C1C]" />
          <DropdownMenuItem className="gap-2 text-gray-300 focus:text-white focus:bg-[#1C1C1C]">
            <User className="w-4 h-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="gap-2 text-gray-300 focus:text-white focus:bg-[#1C1C1C]"
            onClick={() => {
              setIsOpen(false)
              setShowSettings(true)
            }}
          >
            <Settings className="w-4 h-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="gap-2 text-gray-300 focus:text-white focus:bg-[#1C1C1C]"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
            Switch Theme
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-[#1C1C1C]" />
          <DropdownMenuItem className="gap-2 text-red-500 focus:text-red-400 focus:bg-[#1C1C1C]">
            <LogOut className="w-4 h-4" />
            Log Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />
    </>
  )
} 