'use client';

import { Project } from '@/lib/linear-api';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { ArrowRight } from 'lucide-react';

interface ProjectListProps {
  projects: Project[];
  onProjectSelect: (project: Project) => void;
  selectedProjectId?: string;
  onViewIssues?: (project: Project) => void;
}

export function ProjectList({ projects, onProjectSelect, selectedProjectId, onViewIssues }: ProjectListProps) {
  return (
    <div className="p-4">
      <div className="mb-4">
        <h1 className="text-xl font-semibold">Projects</h1>
        <p className="text-sm text-muted-foreground">{projects.length} projects</p>
      </div>
      <div className="space-y-2">
        {projects.map(project => (
          <div
            key={project.id}
            className={cn(
              "rounded-lg border border-transparent hover:border-[#1D1D1D] transition-colors",
              selectedProjectId === project.id && "border-[#1D1D1D] bg-[#1D1D1D]"
            )}
          >
            <div className="flex items-start p-4">
              <div 
                className="flex-1 cursor-pointer" 
                onClick={() => onProjectSelect(project)}
              >
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{project.name}</span>
                    <Badge variant="outline">{project.state}</Badge>
                  </div>
                  {project.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Team: {project.team.name}</span>
                    <span>Updated {formatDistanceToNow(new Date(project.updatedAt))} ago</span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="ml-2 shrink-0"
                onClick={() => onViewIssues?.(project)}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 