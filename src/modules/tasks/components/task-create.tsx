'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { createTask } from '../api/mutations'
import { useRouter } from 'next/navigation'
import { Button } from 'ui'

export function TaskCreate() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setIsSubmitting(true)
    try {
      await createTask({ title, description })
      setTitle('')
      setDescription('')
      router.refresh() // Refresh the page to show new task
    } catch (error) {
      console.error('Failed to create task:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.form 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit} 
      className="space-y-4 bg-white p-6 rounded-lg shadow-sm border"
    >
      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isSubmitting}
        />
      </div>
      
      <div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isSubmitting}
        />
      </div>

      <Button 
        type="submit" 
        disabled={isSubmitting || !title.trim()}
        className="w-full"
      >
        {isSubmitting ? 'Creating...' : 'Add Task'}
      </Button>
    </motion.form>
  )
} 