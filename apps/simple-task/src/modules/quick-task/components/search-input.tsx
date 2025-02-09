"use client"

import { SearchIcon } from "lucide-react"
import { useState, useRef, useEffect, useCallback } from "react"
import { Kbd } from "ui"

interface SearchProps {
  onSearch: (query: string) => void
}

const variants = {
  hidden: { scale: 0.8 },
  visible: { scale: 1 },
}

export function Search({ onSearch }: SearchProps) {
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFocus = useCallback(() => {
    setIsFocused(true)
    inputRef.current?.focus()
  }, [])

  const handleBlur = useCallback(() => {
    setIsFocused(false)
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        handleFocus()
      } else if (event.key === "Escape") {
        handleBlur()
        inputRef.current?.blur()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleFocus, handleBlur])

  return (
    <div className="flex-1 relative">
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <input
        ref={inputRef}
        type="text" 
        placeholder="Search tasks..."
        className="w-full bg-secondary/30 border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
        onChange={(e) => onSearch(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      <Kbd 
        framerMotion 
        animate={!isFocused ? "visible" : "hidden"} 
        variants={variants} 
        transition={{ duration: 0.5 }}
        className="absolute right-3 top-[9px] -translate-y-1/2"
      >
        {isFocused ? 'esc' : '⌘+k'}
      </Kbd>
    </div>
  )
}

