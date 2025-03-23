'use client';

import { Task } from '@/lib/linear-api';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from './ui/badge';
import { Avatar } from './ui/avatar';
import { X, MessageSquare } from 'lucide-react';
import { Button } from './ui/button';

interface IssueDetailProps {
  issue: Task;
  onClose: () => void;
}

export function IssueDetail({ issue, onClose }: IssueDetailProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-[#1E1E1E]">
        <div className="flex items-center gap-2">
          <Badge variant="outline">{issue.state}</Badge>
          <span className="text-sm text-muted-foreground">
            Created {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}
          </span>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-6">
        <div>
          <h1 className="text-xl font-semibold mb-4">{issue.title}</h1>
          {issue.description && (
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {issue.description}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium">Assignee</h2>
            {issue.assignee ? (
              <div className="flex items-center gap-2">
                <Avatar
                  src={issue.assignee.avatarUrl}
                  alt={issue.assignee.name}
                  fallback={issue.assignee.name?.[0] || '?'}
                  className="w-6 h-6"
                />
                <span className="text-sm">{issue.assignee.name}</span>
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">No assignee</span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium">Priority</h2>
            <Badge variant="outline">P{issue.priority || 0}</Badge>
          </div>

          {issue.labels && issue.labels.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-sm font-medium">Labels</h2>
              <div className="flex flex-wrap gap-2">
                {issue.labels.map((label) => (
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
          )}
        </div>

        {issue.comments && issue.comments.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <h2 className="text-sm font-medium">Comments</h2>
            </div>
            <div className="space-y-4">
              {issue.comments.map((comment) => (
                <div key={comment.id} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Avatar
                      src={comment.user.avatarUrl}
                      alt={comment.user.name}
                      fallback={comment.user.name?.[0] || '?'}
                      className="w-6 h-6"
                    />
                    <div>
                      <div className="text-sm font-medium">{comment.user.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm pl-8">{comment.body}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 