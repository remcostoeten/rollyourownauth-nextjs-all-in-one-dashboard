"use client"

import { useEffect, useState } from 'react';
import type { Project } from '@/lib/linear-api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Badge } from './ui/badge';

interface ProjectSwitcherProps {
  onProjectChange: (project: Project) => void;
}

export function ProjectSwitcher({ onProjectChange }: ProjectSwitcherProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        const response = await fetch('/api/projects');
        if (!response.ok) throw new Error('Failed to fetch projects');
        const data = await response.json();
        setProjects(data);
        if (data.length > 0) {
          onProjectChange(data[0]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch projects');
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, [onProjectChange]);

  if (loading) return <div>Loading projects...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!projects.length) return <div>No projects found</div>;

  return (
    <Select onValueChange={(value) => {
      const project = projects.find(p => p.id === value);
      if (project) onProjectChange(project);
    }}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select a project" />
      </SelectTrigger>
      <SelectContent>
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
      </SelectContent>
    </Select>
  );
}

