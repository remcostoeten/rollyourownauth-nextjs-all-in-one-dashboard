'use client'

import { Button } from 'ui'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TaskCreate, zTaskCreate } from '../models/z.task'
import { createTask } from '../api/mutations'
import { useRouter } from 'next/navigation'

export function TaskForm() {
  const router = useRouter()
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<TaskCreate>({
    resolver: zodResolver(zTaskCreate)
  })

  const onSubmit = async (data: TaskCreate) => {
    try {
      await createTask(data)
      reset()
      router.refresh() // Refresh the page to show new task
    } catch (error) {
      console.error('Failed to create task:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <input
          type="text"
          {...register('title')}
          placeholder="Task title"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>
      
      <div>
        <textarea
          {...register('description')}
          placeholder="Description (optional)"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Add Task'}
      </Button>
    </form>
  )
} 