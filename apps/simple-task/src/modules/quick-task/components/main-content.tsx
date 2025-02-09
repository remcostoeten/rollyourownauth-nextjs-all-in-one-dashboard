"use client"

import { useState, useEffect, Suspense, lazy } from "react"
import type { Task } from "@/types/task"
import { cn } from "helpers" 
import { taskService } from "../services/task-service"
import { Loader2 } from "lucide-react"
import { Search } from "./search-input"
import { TaskList } from "./task-list"
import { useListsStore } from "../state/lists"
import { AddTask } from "../../task-management/components/add-task"
const TaskDetail = lazy(() => import("./task-detail"))

interface MainContentProps {
  activeItem: string
  onTaskSelect: (task: Task | null) => void
  sidebarVisible?: boolean
}

export function MainContent({ activeItem, onTaskSelect, sidebarVisible = true }: MainContentProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const { addList } = useListsStore()

  useEffect(() => {
    loadTasks()
  }, [])

  useEffect(() => {
    setFilteredTasks(tasks)
  }, [tasks])

  async function loadTasks() {
    try {
      const fetchedTasks = await taskService.getTasks()
      setTasks(fetchedTasks)
    } catch (error) {
      console.error("Failed to load tasks:", error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleAddTask(title: string, type?: string) {
    try {
      const newTask = await taskService.createTask({ title })
      setTasks((prev) => [...prev, newTask])
    } catch (error) {
      console.error("Failed to create task:", error)
    }
  }

  async function handleToggleTask(task: Task) {
    try {
      const updatedTask = await taskService.updateTask(task.id, {
        completed: !task.completed,
      })
      setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)))
    } catch (error) {
      console.error("Failed to update task:", error)
    }
  }

  function handleSearch(query: string) {
    const lowercaseQuery = query.toLowerCase()
    setFilteredTasks(tasks.filter((task) => task.title.toLowerCase().includes(lowercaseQuery)))
  }

  const handleCreateList = (name: string) => {
    addList({
      id: crypto.randomUUID(),
      name,
      tasks: [],
    })
  }

  if (isLoading) {
    return <Loader2 className="animate-spin" />
  }

  return (
    <div
      className={cn(
        "flex-1 flex flex-col bg-background pt-6 transition-all duration-300 ease-in-out",
        sidebarVisible ? "ml-20" : "ml-0",
      )}
    >
      <div className="px-8 py-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground capitalize">{activeItem}</h1>
      </div>

      <div className="px-8 flex-1 overflow-auto flex flex-wrap flex-col bcontent-between">
        <div className="flex items-center gap-2 mb-4">
          <Search onSearch={handleSearch} />
        </div>

        <TaskList
          tasks={filteredTasks}
          onToggle={handleToggleTask}
          onSelect={(taskId) => {
            setSelectedTaskId(taskId)
            onTaskSelect(tasks.find((t) => t.id === taskId) || null)
          }}
        />

        <AddTask onAddTask={handleAddTask} onCreateList={handleCreateList} />
      </div>

      {selectedTaskId && (
        <Suspense fallback={<Loader2 className="animate-spin" />}>
          <TaskDetail
            taskId={selectedTaskId}
            onClose={() => {
              setSelectedTaskId(null)
              onTaskSelect(null)
            }}
          />
        </Suspense>
      )}
    </div>
  )
}

export default MainContent

