import { Plus, List, Layout, FileText, Copy } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Button, Kbd } from 'ui'
import { cn } from 'helpers'
import { useKeyboardShortcut } from '../../quick-task/hooks/use-keyboard-shortcut'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

interface CreateNewDropdownProps {
  className?: string
}

export function CreateNewDropdown({ className }: CreateNewDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  useKeyboardShortcut('alt+n', (e) => {
    e.preventDefault()
    setIsOpen(true)
  })

  const createOptions = [
    {
      label: 'New Task',
      icon: FileText,
      onClick: () => {
        console.log('Create task')
        setIsOpen(false)
      },
      description: 'Add a new task to the current list',
      shortcut: 'Alt+N'
    },
    // ... other options
  ]

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          className={cn(
            'w-full flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors relative',
            className
          )}
        >
          <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center">
            <Plus className="w-4 h-4 text-accent-foreground" />
          </div>
          <span className="text-sm">Create new</span>
          <Kbd className="absolute right-2 text-muted-foreground">
            <AnimatePresence mode="wait">
              {isOpen ? (
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
                  Alt+N
                </motion.span>
              )}
            </AnimatePresence>
          </Kbd>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[220px]">
        {createOptions.map((option) => (
          <DropdownMenuItem
            key={option.label}
            onClick={option.onClick}
            className="flex flex-col items-start py-2 px-3 cursor-pointer"
          >
            <div className="flex items-center gap-2 w-full">
              <option.icon className="w-4 h-4" />
              <span>{option.label}</span>
              {option.shortcut && (
                <Kbd className="ml-auto text-xs bg-muted px-1.5 py-0.5 rounded">
                  {option.shortcut}
                </Kbd>
              )}
            </div>
            <span className="text-xs text-muted-foreground mt-1">
              {option.description}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 