import { getProjectTasks } from '@/lib/linear-api';
import { TaskListClient } from './task-list-client';

interface TaskListServerProps {
  projectId: string;
}

export async function TaskListServer({ projectId }: TaskListServerProps) {
  const tasks = await getProjectTasks(projectId);
  
  return <TaskListClient initialTasks={tasks} />;
} 