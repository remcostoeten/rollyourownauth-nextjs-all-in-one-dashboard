'use client';

import { useEffect, useState } from 'react';
import type { Task } from '@/lib/linear-api';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { Avatar } from './ui/avatar';
interface TaskListProps {
  projectId: string;
}

export function TaskList({ projectId }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTasks() {
      try {
        setLoading(true);
        const response = await fetch(`/api/projects/${projectId}/tasks`);
        if (!response.ok) throw new Error('Failed to fetch tasks');
        const data = await response.json();
        setTasks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, [projectId]);

  if (loading) return <div>Loading tasks...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!tasks.length) return <div>No tasks found</div>;

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card key={task.id} className="p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">{task.title}</h3>
              {task.description && (
                <p className="text-sm text-muted-foreground">{task.description}</p>
              )}
              <div className="flex items-center gap-2">
                <Badge variant={task.state === 'Done' ? 'default' : 'secondary'}>
                  {task.state}
                </Badge>
                {task.priority && (
                  <Badge variant="outline">P{task.priority}</Badge>
                )}
                {task.labels?.map((label) => (
                  <Badge
                    key={label.id}
                    variant="outline"
                    style={{ backgroundColor: label.color }}
                  >
                    {label.name}
                  </Badge>
                ))}
              </div>
            </div>
            {task.assignee && (
              <Avatar
                src={task.assignee.avatarUrl}
                alt={task.assignee.name}
                fallback={task.assignee.name[0]}
              />
            )}
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <div>
              Created {formatDistanceToNow(new Date(task.createdAt))} ago
            </div>
            {task.dueDate && (
              <div>
                Due {formatDistanceToNow(new Date(task.dueDate))} from now
              </div>
            )}
          </div>
          {task.comments && task.comments.length > 0 && (
            <div className="mt-4 border-t pt-4">
              <h4 className="text-sm font-medium mb-2">
                Comments ({task.comments.length})
              </h4>
              <div className="space-y-2">
                {task.comments.map((comment) => (
                  <div key={comment.id} className="flex items-start gap-2">
                    <Avatar
                      src={comment.user.avatarUrl}
                      alt={comment.user.name}
                      fallback={comment.user.name[0]}
                      className="w-6 h-6"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {comment.user.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.createdAt))} ago
                        </span>
                      </div>
                      <p className="text-sm">{comment.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}

