'use client'

import type { ElementType } from 'react'
import { useState, useRef, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Search, Pin, PinOff } from 'lucide-react'
import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, Kbd } from 'ui'
import { ThemeSwitcher } from '@/src/components/theme-switcher'
import { SettingsMenu } from './settings-menu'
import { CreateNewDropdown } from './create-new-dropdown'
import { SearchResults } from './search-results'
import { NavItemComponent } from './nav-item'
import { useSidebarStore } from '../state/use-sidebar-state'
import { useUserStore } from '../../user/state/use-user-state'
import { useSearch } from '../../quick-task/hooks/use-search'
import { useListsStore } from '../../quick-task/state/lists'
import type { DropResult } from 'react-beautiful-dnd'
import { useMockUserContext } from '@/src/shared/providers/mock-user-provider'
import { useKeyboardShortcut } from '../../quick-task/hooks/use-keyboard-shortcut'
import { motion, AnimatePresence } from 'framer-motion'

type NavItem = {
  id: string
  icon: ElementType
  label: string
  color?: string
  isHidden?: boolean
}

interface SidebarProps {
  onItemClick: (id: string) => void
}

export function Sidebar({ onItemClick }: SidebarProps) {
  const {
    isVisible,
    isLocked,
    activeItem,
    navItems,
    searchQuery,
    setLocked,
    setSearchQuery,
    reorderNavItems
  } = useSidebarStore()
  
  const { currentUser } = useUserStore()
  const { lists } = useListsStore()
  const searchResults = useSearch(searchQuery)
  const { user } = useMockUserContext()
  const [isFocused, setIsFocused] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useKeyboardShortcut('mod+k', (e) => {
    e.preventDefault()
    searchInputRef.current?.focus()
  })

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return
    reorderNavItems(result.source.index, result.destination.index)
  }

  const handleSearchSelect = (result: { type: 'task' | 'list'; id: string }) => {
    if (result.type === 'list') {
      onItemClick(result.id)
    } else {
      const task = lists.flatMap((list) => list.tasks).find((task) => task.id === result.id)
      if (task) {
        onItemClick(task.id)
      }
    }
    setSearchQuery('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (searchQuery.trim()) {
        handleSearchSelect({ type: 'list', id: searchQuery })
      }
    }
  }

  return (
    <div className={cn(
      'w-60 flex flex-col h-screen bg-background/50 backdrop-blur-sm transition-all duration-300 ease-in-out border-r border-dashed',
      'absolute top-0 left-0 origin-left',
      isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
    )}>
      {/* Header Section */}
      <div className="p-4 border-b border-dashed">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Quick Tasks</h2>
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setLocked(!isLocked)}
                  className={cn('h-8 w-8', isLocked ? 'text-primary' : 'text-muted-foreground')}
                >
                  {isLocked ? <Pin className="h-4 w-4" /> : <PinOff className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" align="center">
                <p>{isLocked ? 'Unpin sidebar' : 'Pin sidebar'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search tasks, lists..."
            className="w-full bg-background/50 border border-border rounded-md pl-9 pr-16 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <Kbd className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground">
            <AnimatePresence mode="wait">
              {isFocused ? (
                <motion.span
                  key="enter"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  Enter
                </motion.span>
              ) : (
                <motion.span
                  key="shortcut"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  ⌘K
                </motion.span>
              )}
            </AnimatePresence>
          </Kbd>
        </div>
      </div>

      {/* Search Results */}
      {searchQuery.trim() && (
        <div className="flex-1 overflow-auto">
          <SearchResults
            results={searchResults}
            query={searchQuery}
            onSelect={handleSearchSelect}
          />
        </div>
      )}

      {/* Navigation Section */}
      {!searchQuery.trim() && (
        <div className="flex-1 overflow-auto py-4">
          <div className="px-3 mb-2">
            <h3 className="text-xs font-medium text-muted-foreground mb-2 px-3">
              QUICK ACCESS
            </h3>
            <nav className="space-y-1">
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="sidebar-list">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {navItems
                        .filter((item) => !item.isHidden)
                        .map((item, index) => (
                          <Draggable key={item.id} draggableId={item.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="relative group"
                              >
                                <NavItemComponent
                                  item={item}
                                  isActive={item.id === activeItem}
                                  onClick={() => onItemClick(item.id)}
                                  dragHandleProps={provided.dragHandleProps}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </nav>
          </div>

          <div className="px-3 mb-2">
            <h3 className="text-xs font-medium text-muted-foreground mb-2 px-3">
              RECENT LISTS
            </h3>
            <nav className="space-y-1">
              {lists.slice(0, 3).map((list) => (
                <button
                  key={list.id}
                  onClick={() => onItemClick(list.id)}
                  className={cn(
                    'flex items-center w-full rounded-sm px-3 py-1.5 text-sm transition-colors group relative overflow-hidden',
                    list.id === activeItem
                      ? 'text-foreground bg-primary/5'
                      : 'text-muted-foreground hover:text-foreground hover:bg-primary/5'
                  )}
                >
                  <ListsIcon className="w-4 h-4 mr-3" />
                  <span className="truncate">{list.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Footer Section */}
      <div className="border-t border-dashed p-4 space-y-3">
        {user && (
          <div className="flex items-center gap-3 p-2 rounded-lg bg-secondary/30">
            <img
              src={user?.avatar || '/placeholder.svg'}
              alt={user?.name}
              className="w-8 h-8 rounded-full ring-1 ring-border"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {user?.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <SettingsMenu />
              <ThemeSwitcher />
            </div>
          </div>
        )}
        <CreateNewDropdown />
      </div>
    </div>
  )
} 