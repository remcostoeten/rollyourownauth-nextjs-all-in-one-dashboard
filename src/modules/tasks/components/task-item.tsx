'use client'

import { motion } from 'framer-motion'
import { Task } from '@/server/db/schema'

type TaskItemProps = {
  task: Task
}

export function TaskItem({ task }: TaskItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
    >
      <h3 className="font-medium text-lg">{task.title}</h3>
      {task.description && (
        <p className="mt-2 text-gray-600">{task.description}</p>
      )}
      <div className="mt-2 text-sm text-gray-500">
        Created: {new Date(task.createdAt).toLocaleDateString()}
      </div>
    </motion.div>
  )
} 