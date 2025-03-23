'use client';

import { useState } from 'react';
import type { Project } from '@/lib/linear-api';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Badge } from './ui/badge';

interface ProjectSwitcherClientProps {
  initialProjects: Project[];
  onProjectChange: (project: Project) => void;
}

export function ProjectSwitcherClient({ initialProjects, onProjectChange }: ProjectSwitcherClientProps) {
  const [selectedId, setSelectedId] = useState<string | null>(
    initialProjects.length > 0 ? initialProjects[0].id : null
  );

  if (!initialProjects.length) return <div>No projects found</div>;

  // Group projects by team
  const projectsByTeam = initialProjects.reduce((acc, project) => {
    const teamKey = project.team.key;
    if (!acc[teamKey]) {
      acc[teamKey] = {
        team: project.team,
        projects: []
      };
    }
    acc[teamKey].projects.push(project);
    return acc;
  }, {} as Record<string, { team: Project['team']; projects: Project[] }>);

  return (
    <Select
      value={selectedId || undefined}
      onValueChange={(value) => {
        setSelectedId(value);
        const project = initialProjects.find(p => p.id === value);
        if (project) onProjectChange(project);
      }}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select a project">
          {selectedId && initialProjects.find(p => p.id === selectedId)?.name}
        </SelectValue>
      </SelectTrigger>s
      <SelectContent>
        {Object.entries(projectsByTeam).map(([teamKey, { team, projects }]) => (
          <SelectGroup key={teamKey}>
            <SelectLabel className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
              {team.name}
            </SelectLabel>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                <div className="flex items-center gap-2">
                  <span>{project.name}</span>
                  {project.state && (
                    <Badge variant="outline" className="ml-2">
                      {project.state}
                    </Badge>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
} 