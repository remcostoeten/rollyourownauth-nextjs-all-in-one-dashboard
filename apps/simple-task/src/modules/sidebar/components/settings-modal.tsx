"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "ui"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "ui"
import { mockUser } from "config"
import { useTheme } from "next-themes"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "helpers"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

const shortcuts = [
  { key: "⌘ + K", description: "Open command palette" },
  { key: "⌘ + N", description: "Create new list" },
  { key: "⌘ + /", description: "Show keyboard shortcuts" },
  { key: "⌘ + [", description: "Navigate back" },
  { key: "⌘ + ]", description: "Navigate forward" },
  { key: "⌘ + S", description: "Save changes" },
]

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState("account")
  const { theme, setTheme } = useTheme()

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-[600px] bg-[#0A0A0A]/95 backdrop-blur-sm border-[#1C1C1C]">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-200">Settings</DialogTitle>
            </DialogHeader>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
              <TabsList className="w-full bg-[#1C1C1C] p-1 rounded-lg">
                <TabsTrigger
                  value="account"
                  className={cn(
                    "flex-1 py-2 text-sm font-medium rounded-md transition-colors",
                    "data-[state=active]:bg-[#2A2A2A] data-[state=active]:text-white",
                    "data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-gray-300"
                  )}
                >
                  Account
                </TabsTrigger>
                <TabsTrigger
                  value="appearance"
                  className={cn(
                    "flex-1 py-2 text-sm font-medium rounded-md transition-colors",
                    "data-[state=active]:bg-[#2A2A2A] data-[state=active]:text-white",
                    "data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-gray-300"
                  )}
                >
                  Appearance
                </TabsTrigger>
                <TabsTrigger
                  value="shortcuts"
                  className={cn(
                    "flex-1 py-2 text-sm font-medium rounded-md transition-colors",
                    "data-[state=active]:bg-[#2A2A2A] data-[state=active]:text-white",
                    "data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-gray-300"
                  )}
                >
                  Shortcuts
                </TabsTrigger>
              </TabsList>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="mt-6"
              >
                <TabsContent value="account" className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#2A2A2A]">
                      <Image
                        src={mockUser.profile.avatar}
                        alt={`${mockUser.profile.firstName}'s avatar`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-200">
                        {mockUser.profile.firstName} {mockUser.profile.lastName}
                      </h3>
                      <p className="text-sm text-gray-400">{mockUser.email}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Display Name</label>
                      <input
                        type="text"
                        value={`${mockUser.profile.firstName} ${mockUser.profile.lastName}`}
                        className="w-full px-3 py-2 text-sm bg-[#1C1C1C] border border-[#2A2A2A] rounded-md focus:outline-none focus:ring-2 focus:ring-[#3A3A3A]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Email</label>
                      <input
                        type="email"
                        value={mockUser.email}
                        className="w-full px-3 py-2 text-sm bg-[#1C1C1C] border border-[#2A2A2A] rounded-md focus:outline-none focus:ring-2 focus:ring-[#3A3A3A]"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="appearance" className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-300 mb-3">Theme</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={() => setTheme("dark")}
                          className={cn(
                            "p-4 rounded-lg border text-left transition-all",
                            theme === "dark"
                              ? "border-white/20 bg-[#1C1C1C] ring-2 ring-white/20"
                              : "border-[#2A2A2A] bg-[#1C1C1C] hover:border-white/20"
                          )}
                        >
                          <div className="space-y-2">
                            <div className="w-8 h-8 rounded-full bg-[#0A0A0A] border border-[#2A2A2A]" />
                            <div className="text-sm font-medium text-gray-200">Dark</div>
                            <div className="text-xs text-gray-400">Dark mode for night owls</div>
                          </div>
                        </button>
                        <button
                          onClick={() => setTheme("light")}
                          className={cn(
                            "p-4 rounded-lg border text-left transition-all",
                            theme === "light"
                              ? "border-black/20 bg-white ring-2 ring-black/20"
                              : "border-[#2A2A2A] bg-[#1C1C1C] hover:border-white/20"
                          )}
                        >
                          <div className="space-y-2">
                            <div className="w-8 h-8 rounded-full bg-white border border-black/10" />
                            <div className="text-sm font-medium text-gray-200">Light</div>
                            <div className="text-xs text-gray-400">Light and clean</div>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="shortcuts" className="space-y-6">
                  <div className="space-y-4">
                    {shortcuts.map((shortcut, index) => (
                      <motion.div
                        key={shortcut.key}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ 
                          opacity: 1, 
                          y: 0,
                          transition: { delay: index * 0.05 }
                        }}
                        className="flex items-center justify-between p-3 rounded-lg bg-[#1C1C1C] border border-[#2A2A2A]"
                      >
                        <span className="text-sm text-gray-300">{shortcut.description}</span>
                        <kbd className="px-2 py-1 text-xs font-mono rounded bg-[#2A2A2A] text-gray-400">
                          {shortcut.key}
                        </kbd>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>
              </motion.div>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
} 