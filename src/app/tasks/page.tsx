import { getTasks } from '@/modules/tasks/api/queries'
import { TaskCreate } from '@/modules/tasks/components/task-create'
import { TaskItem } from '@/modules/tasks/components/task-item'

export default async function TasksPage() {
  const tasks = await getTasks()
  
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <TaskCreate />
      
      <div className="space-y-4">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>
    </div>
  )
} 