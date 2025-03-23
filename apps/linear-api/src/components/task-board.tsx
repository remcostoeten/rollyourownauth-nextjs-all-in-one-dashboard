'use client';

import { useEffect, useState } from 'react';
import type { Task } from '@/lib/linear-api';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar } from './ui/avatar';
import { formatDistanceToNow } from 'date-fns';

interface TaskBoardProps {
  projectId: string;
}

const STATES = ['Todo', 'In Progress', 'Done'] as const;

export function TaskBoard({ projectId }: TaskBoardProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await fetch(`/api/projects/${projectId}/tasks`);
        if (!response.ok) throw new Error('Failed to fetch tasks');
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, [projectId]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {STATES.map((state) => (
          <div key={state} className="space-y-4">
            <h2 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
              {state}
              <span className="text-xs bg-accent/20 px-1.5 rounded">Loading...</span>
            </h2>
            <Card className="h-24 animate-pulse bg-accent/10" />
            <Card className="h-24 animate-pulse bg-accent/10" />
          </div>
        ))}
      </div>
    );
  }

  const tasksByState = STATES.reduce((acc, state) => {
    acc[state] = tasks.filter(task => task.state === state);
    return acc;
  }, {} as Record<typeof STATES[number], Task[]>);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
    dawdd  {STATES.map((state) => (
        <div key={state} className="space-y-4">
          <h2 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
            {state}
            <span className="text-xs bg-accent/20 px-1.5 rounded">
              {tasksByState[state].length}
            </span>
          </h2>
          {tasksByState[state].map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      ))}
    </div>
  );
}

interface TaskCardProps {
  task: Task;
}

function TaskCard({ task }: TaskCardProps) {
  return (
    <Card className="p-4 hover:border-accent/50 transition-colors cursor-pointer">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="text-sm font-medium leading-none">{task.title}</h3>
          {task.assignee && (
            <Avatar 
              src={task.assignee.avatarUrl}
              alt={task.assignee.name}
              fallback={task.assignee.name[0]}
              className="w-6 h-6"
            />
          )}
        </div>
        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {task.description}
          </p>
        )}
        <div className="flex items-center gap-2 flex-wrap">
          {task.priority > 0 && (
            <Badge variant="outline" className="text-xs">
              P{task.priority}
            </Badge>
          )}
          {task.labels?.map((label) => (
            <Badge
              key={label.id}
              variant="outline"
              className="text-xs"
              style={{ backgroundColor: label.color }}
            >
              {label.name}
            </Badge>
          ))}
          <span className="text-xs text-muted-foreground ml-auto">
            {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}
          </span>
        </div>
      </div>
    </Card>
  );
} 