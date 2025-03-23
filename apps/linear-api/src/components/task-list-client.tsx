'use client';

import type { Task } from '@/lib/linear-api';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';

interface TaskListClientProps {
  initialTasks: Task[];
}

interface AvatarProps {
  src?: string;
  alt: string;
  fallback: string;
  className?: string;
}

function Avatar({ src, alt, fallback, className = "" }: AvatarProps) {
  if (!src) {
    return (
      <div className={`w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-sm font-medium">{fallback}</span>
      </div>
    );
  }

  return (
    <div className={`w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden ${className}`}>
      <Image 
        src={src} 
        alt={alt} 
        width={40} 
        height={40} 
        className="w-full h-full object-cover"
      />
    </div>
  );
}

export function TaskListClient({ initialTasks }: TaskListClientProps) {
  if (!initialTasks.length) return <div>No tasks found</div>;

  return (
    <div className="space-y-4">
      {initialTasks.map((task) => (
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