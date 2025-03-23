"use client"

import { useTransition, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"
import { Textarea } from "./ui/textarea"
import { createTask } from "@/lib/actions"
import { useRouter } from "next/navigation"

interface CreateTaskButtonProps {
  projectId: string
}

export function CreateTaskButton({ projectId }: CreateTaskButtonProps) {
  const [isPending, startTransition] = useTransition()
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    const title = formData.get('title') as string
    const description = formData.get('description') as string

    if (!title?.trim()) return

    startTransition(async () => {
      await createTask(projectId, { title, description })
      setIsOpen(false)
      router.refresh()
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div>
            <Input
              name="title"
              placeholder="Task title"
              disabled={isPending}
              required
            />
          </div>
          <div>
            <Textarea
              name="description"
              placeholder="Task description (optional)"
              disabled={isPending}
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

