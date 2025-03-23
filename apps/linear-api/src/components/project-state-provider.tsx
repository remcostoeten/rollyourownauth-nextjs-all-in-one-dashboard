'use client';

import { useState, type ReactNode } from 'react';
import type { Project } from '@/lib/linear-api';

interface ProjectStateProviderProps {
  children: (state: {
    currentProject: Project | null;
    setCurrentProject: (project: Project) => void;
  }) => ReactNode;
}

export function ProjectStateProvider({ children }: ProjectStateProviderProps) {
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  return (
    <div>
      {children({
        currentProject,
        setCurrentProject,
      })}
    </div>
  );
} 