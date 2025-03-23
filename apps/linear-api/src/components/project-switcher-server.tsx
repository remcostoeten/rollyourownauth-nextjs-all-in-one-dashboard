import { getProjects } from '@/lib/linear-api';
import { ProjectSwitcherClient } from './project-switcher-client';
import type { Project } from '@/lib/linear-api';

interface ProjectSwitcherServerProps {
  onProjectChange: (project: Project) => void;
}

export async function ProjectSwitcherServer({ onProjectChange }: ProjectSwitcherServerProps) {
  const projects = await getProjects();
  
  return (
    <ProjectSwitcherClient 
      initialProjects={projects} 
      onProjectChange={onProjectChange} 
    />
  );
} 