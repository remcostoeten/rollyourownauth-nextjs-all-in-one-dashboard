import { Plus, ListIcon } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Button, Input } from 'ui'
import { cn } from 'helpers'
import { useState, useRef } from 'react'
import { useListsStore } from '../../quick-task/state/lists'

interface CreateNewDropdownProps {
  className?: string
}

export function CreateNewDropdown({ className }: CreateNewDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isCreatingList, setIsCreatingList] = useState(false)
  const [newListName, setNewListName] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const { addList } = useListsStore()

  const handleCreateList = () => {
    if (newListName.trim()) {
      const newList = {
        id: crypto.randomUUID(),
        name: newListName.trim(),
        tasks: []
      }
      addList(newList)
      setNewListName('')
      setIsCreatingList(false)
      setIsOpen(false)
    }
  }

  const createOptions = [
    {
      label: 'New List',
      icon: ListIcon,
      onClick: () => {
        setIsCreatingList(true)
        setTimeout(() => inputRef.current?.focus(), 0)
      },
      description: 'Create a new list to organize tasks'
    },
  ]

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          className={cn(
            'w-full flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors',
            'focus:ring-0 focus:outline-none focus-visible:ring-1 focus-visible:ring-accent/20',
            className
          )}
        >
          <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center">
            <Plus className="w-4 h-4 text-accent-foreground" />
          </div>
          <span className="text-sm">Create new</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[220px]">
        {isCreatingList ? (
          <div className="p-2">
            <Input
              ref={inputRef}
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="List name..."
              className={cn(
                "w-full bg-transparent",
                "focus:ring-0 focus:outline-none focus-visible:ring-1 focus-visible:ring-accent/20",
                "border-none"
              )}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCreateList()
                } else if (e.key === 'Escape') {
                  setIsCreatingList(false)
                  setNewListName('')
                }
              }}
            />
            <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
              <span>Press Enter to create</span>
              <span>Esc to cancel</span>
            </div>
          </div>
        ) : (
          createOptions.map((option) => (
            <DropdownMenuItem
              key={option.label}
              onClick={option.onClick}
              className={cn(
                "flex flex-col items-start py-2 px-3 cursor-pointer",
                "focus:ring-0 focus:outline-none focus-visible:ring-1 focus-visible:ring-accent/20"
              )}
            >
              <div className="flex items-center gap-2 w-full">
                <option.icon className="w-4 h-4" />
                <span>{option.label}</span>
              </div>
              <span className="text-xs text-muted-foreground mt-1">
                {option.description}
              </span>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 