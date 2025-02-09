import { motion } from "framer-motion"
import { X, Calendar, Users, Tag } from 'lucide-react'
import { Task } from "../types"

interface TaskDetailProps {
  task: Task
  onClose: () => void
}

export function TaskDetail({ task, onClose }: TaskDetailProps) {
  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 20 }}
      className="w-96 border-l border-gray-800 p-6 bg-[#1e1f2a]"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Creator</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-md">
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <input
            type="text"
            value={task.title}
            className="w-full bg-transparent text-lg font-medium focus:outline-none"
          />
          <div className="flex gap-2">
            <button className="p-2 hover:bg-gray-800 rounded-md">
              <Calendar className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-gray-800 rounded-md">
              <Users className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-gray-800 rounded-md">
              <Tag className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-400">Subtasks</h3>
          <button className="w-full text-left p-3 rounded-lg flex items-center gap-2 hover:bg-gray-800">
            <input type="checkbox" className="rounded-full border-gray-600" />
            <span className="text-gray-400">Add new subtask...</span>
          </button>
        </div>
      </div>
    </motion.div>
  )
}

