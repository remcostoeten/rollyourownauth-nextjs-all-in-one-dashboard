"use client"

import { useState } from "react"
import { Check, MoreHorizontal, Calendar, User, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import type { LinearIssue } from "@/lib/types"

interface TaskItemProps {
  issue: LinearIssue
  onStatusChange?: (id: string, completed: boolean) => void
  onDelete?: (id: string) => void
}

export function TaskItem({ issue, onStatusChange, onDelete }: TaskItemProps) {
  const [isCompleted, setIsCompleted] = useState(issue.state.name === "Done")

  const handleStatusChange = () => {
    const newStatus = !isCompleted
    setIsCompleted(newStatus)
    onStatusChange?.(issue.id, newStatus)
  }

  return (
    <div className="task-item flex items-center justify-between p-4 rounded-lg bg-secondary">
      <div className="flex items-center gap-4 flex-1">
        <Button
          variant="ghost"
          size="icon"
          className={`rounded-full ${isCompleted ? "text-success" : "text-muted-foreground"}`}
          onClick={handleStatusChange}
        >
          <Check className="h-5 w-5" />
        </Button>
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`${isCompleted ? "line-through text-muted-foreground" : "text-foreground"} truncate`}>
              {issue.title}
            </span>
            {issue.labels?.map((label) => (
              <Badge key={label.id} variant="outline" className="text-xs">
                {label.name}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {issue.assignee && (
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{issue.assignee.name}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}</span>
            </div>
            {issue.project && (
              <div className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                <span>{issue.project.name}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => onStatusChange?.(issue.id, !isCompleted)}>
            Mark as {isCompleted ? "incomplete" : "complete"}
          </DropdownMenuItem>
          <DropdownMenuItem>Edit task</DropdownMenuItem>
          <DropdownMenuItem>View details</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive" onClick={() => onDelete?.(issue.id)}>
            Delete task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

