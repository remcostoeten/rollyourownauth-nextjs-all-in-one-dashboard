'use client';

import { useEffect, useState } from 'react';
import { Task } from '@/lib/linear-api';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from './ui/badge';
import { Avatar } from './ui/avatar';
import { Filter, Plus, ChevronDown, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface IssueListProps {
  projectId?: string;
  onIssueSelect: (issue: Task) => void;
  selectedIssueId?: string;
  issues?: Task[];
}

type IssueGroup = {
  title: string;
  count: number;
  issues: Task[];
};

export function IssueList({ projectId, onIssueSelect, selectedIssueId, issues: initialIssues }: IssueListProps) {
  const [issues, setIssues] = useState<Task[]>(initialIssues || []);
  const [loading, setLoading] = useState(!initialIssues);

  useEffect(() => {
    if (!projectId || initialIssues) return;

    async function fetchIssues() {
      setLoading(true);
      try {
        console.log('Fetching issues for project:', projectId);
        const response = await fetch(`/api/projects/${projectId}/tasks`);
        if (!response.ok) throw new Error('Failed to fetch issues');
        const data = await response.json();
        console.log('Fetched issues:', data);
        setIssues(data);
      } catch (error) {
        console.error('Error fetching issues:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchIssues();
  }, [projectId, initialIssues]);

  const issueGroups: IssueGroup[] = [
    {
      title: 'In Progress',
      count: issues.filter(i => i.state === 'In Progress').length,
      issues: issues.filter(i => i.state === 'In Progress')
    },
    {
      title: 'Todo',
      count: issues.filter(i => i.state === 'Todo' || i.state === 'Backlog').length,
      issues: issues.filter(i => i.state === 'Todo' || i.state === 'Backlog')
    },
    {
      title: 'Done',
      count: issues.filter(i => i.state === 'Done').length,
      issues: issues.filter(i => i.state === 'Done')
    }
  ];

  if (!projectId) {
    return (
      <div className="flex items-center justify-center h-full text-[#737373]">
        Select a project to view issues
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-[#737373]">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (issues.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-[#737373] gap-4">
        <p>No issues found</p>
        <Button size="sm" className="gap-2 bg-[#4B4B4B] hover:bg-[#666666] text-white border-none">
          <Plus className="w-4 h-4" />
          Create First Issue
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      {/* Filter Bar */}
      <div className="sticky top-0 bg-[#09090B] border-b border-[#1D1D1D] p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2 border-[#1D1D1D] bg-transparent text-[#A1A1A1] hover:text-[#E2E2E2] hover:bg-[#1D1D1D]">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="gap-2 border-[#1D1D1D] bg-transparent text-[#A1A1A1] hover:text-[#E2E2E2] hover:bg-[#1D1D1D]">
              Display
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
          <Button size="sm" className="gap-2 bg-[#4B4B4B] hover:bg-[#666666] text-white border-none">
            <Plus className="w-4 h-4" />
            Add Issue
          </Button>
        </div>
      </div>

      {/* Issue Groups */}
      <div className="p-4 space-y-6">
        {issueGroups.map(group => (
          <div key={group.title}>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-sm font-medium text-[#E2E2E2]">{group.title}</h2>
              <Badge variant="secondary" className="text-xs bg-[#1D1D1D] text-[#A1A1A1]">
                {group.count}
              </Badge>
              <Button variant="ghost" size="sm" className="ml-auto text-[#737373] hover:text-[#E2E2E2] hover:bg-[#1D1D1D]">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {group.issues.map(issue => (
                <button
                  key={issue.id}
                  onClick={() => onIssueSelect(issue)}
                  className={cn(
                    "w-full text-left p-3 rounded-md transition-colors",
                    "hover:bg-[#1D1D1D]",
                    selectedIssueId === issue.id ? "bg-[#1D1D1D]" : ""
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-[#737373]">
                          {issue.id.split('-')[1]}
                        </span>
                        <h3 className="text-sm font-medium text-[#E2E2E2] truncate">{issue.title}</h3>
                      </div>
                      {issue.labels && issue.labels.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {issue.labels.map(label => (
                            <Badge
                              key={label.id}
                              variant="outline"
                              style={{ 
                                backgroundColor: `${label.color}15`,
                                color: label.color,
                                borderColor: `${label.color}30`
                              }}
                              className="text-xs"
                            >
                              {label.name}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    {issue.assignee && (
                      <Avatar
                        src={issue.assignee.avatarUrl}
                        alt={issue.assignee.name}
                        fallback={issue.assignee.name?.[0] || '?'}
                        className="w-6 h-6"
                      />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 