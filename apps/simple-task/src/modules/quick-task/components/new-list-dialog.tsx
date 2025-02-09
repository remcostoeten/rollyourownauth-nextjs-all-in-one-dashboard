'use client'

import { useState } from 'react'
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, Button,Label,Input } from 'ui'
import { ListPlus } from 'lucide-react'

interface NewListDialogProps {
  isOpen: boolean
  onClose: () => void
  onCreateList: (name: string) => void
}

export function NewListDialog({ isOpen, onClose, onCreateList }: NewListDialogProps) {
  const [listName, setListName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (listName.trim()) {
      onCreateList(listName.trim())
      setListName('')
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ListPlus className="w-5 h-5" />
            Create New List
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">List name</Label>
              <Input
                id="name"
                autoFocus
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                placeholder="Enter list name..."
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!listName.trim()}>
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 