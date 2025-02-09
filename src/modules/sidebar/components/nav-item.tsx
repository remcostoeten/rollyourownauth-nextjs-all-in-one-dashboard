'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from 'helpers'
import type { NavItem } from '../models/z.nav-item'

interface NavItemProps {
  item: NavItem
  isActive: boolean
  onClick: () => void
  dragHandleProps?: any
}

export function NavItemComponent({ item, isActive, onClick, dragHandleProps }: NavItemProps) {
  const [hovering, setHovering] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })
    }
  }

  return (
    <motion.button
      ref={buttonRef}
      className={cn(
        'relative flex items-center gap-3 w-full rounded-sm px-3 py-1.5 text-sm transition-colors overflow-hidden',
        isActive
          ? 'text-foreground bg-primary/5'
          : 'text-muted-foreground hover:text-foreground'
      )}
      style={{ color: item.color }}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onHoverStart={() => setHovering(true)}
      onHoverEnd={() => setHovering(false)}
      {...dragHandleProps}
    >
      <item.icon />
      <span>{item.label}</span>
      {hovering && (
        <motion.div
          className="absolute inset-0 rounded-sm pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 0.05
          }}
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, var(--primary) 0%, transparent 100%)`
          }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
        />
      )}
    </motion.button>
  )
} 