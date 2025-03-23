'use client';

import { formatDistanceToNow } from 'date-fns';
import { Issue } from '../models/z.issue';
import { Badge } from '@/shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { MessageSquare, AlertCircle } from 'lucide-react';

interface IssueCardProps {
  issue: Issue;
  onClick?: (issue: Issue) => void;
}

export function IssueCard({ issue, onClick }: IssueCardProps) {
  const handleClick = () => {
    onClick?.(issue);
  };

  return (
    <div
      onClick={handleClick}
      className="p-3 bg-[#141414] rounded-lg hover:bg-[#1D1D1D] transition-colors cursor-pointer"
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between">
          <h4 className="font-medium line-clamp-2">{issue.title}</h4>
          {issue.priority > 0 && (
            <Badge variant="outline" className="shrink-0 ml-2">
              P{issue.priority}
            </Badge>
          )}
        </div>

        {issue.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {issue.description}
          </p>
        )}

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {issue.assignee && (
            <div className="flex items-center gap-1">
              <Avatar className="w-4 h-4">
                <AvatarImage src={issue.assignee.avatarUrl} />
                <AvatarFallback>
                  {issue.assignee.name
                    .split(' ')
                    .map(n => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <span>{issue.assignee.name}</span>
            </div>
          )}

          <span>·</span>
          <span>Updated {formatDistanceToNow(new Date(issue.updatedAt))} ago</span>
        </div>

        <div className="flex items-center gap-2 mt-1">
          {issue.labels && issue.labels.length > 0 && (
            <div className="flex items-center gap-1">
              {issue.labels.map(label => (
                <div
                  key={label.id}
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: label.color }}
                  title={label.name}
                />
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 ml-auto">
            {(issue.comments?.length ?? 0) > 0 && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MessageSquare className="w-3 h-3" />
                <span>{issue.comments?.length}</span>
              </div>
            )}
            {issue.priority >= 3 && (
              <AlertCircle className="w-3 h-3 text-orange-500" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 