'use client';

import { CreateTaskButton } from "@/components/create-task-button";
import { ProjectStateProvider } from '@/components/project-state-provider';
import type { Project } from '@/lib/linear-api';
import { Children, cloneElement, isValidElement } from 'react';

interface TasksClientProps {
  children: React.ReactNode;
  initialProjects: Project[];
}

interface ProjectSwitcherProps {
  onProjectChange: (project: Project) => void;
  initialProjects: Project[];
}

interface TaskListProps {
  projectId?: string;
}

export function TasksClient({ children, initialProjects }: TasksClientProps) {
  const childrenArray = Children.toArray(children);
  const projectSwitcher = childrenArray[0];
  const taskList = childrenArray[1] as React.ReactElement<TaskListProps>;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <ProjectStateProvider>
          {({ currentProject, setCurrentProject }) => (
            <>
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                  <h1 className="text-2xl font-semibold text-foreground">Tasks</h1>
                  <div className="w-[200px]">
                    {isValidElement(projectSwitcher) &&
                      cloneElement(projectSwitcher as React.ReactElement<ProjectSwitcherProps>, { 
                        onProjectChange: setCurrentProject,
                        initialProjects
                      })}
                  </div>
                </div>
                {currentProject && <CreateTaskButton projectId={currentProject.id} />}
              </div>

              {currentProject && isValidElement(taskList) && (
                <div className="mb-8">
                  {cloneElement(taskList, { projectId: currentProject.id })}
                </div>
              )}
            </>
          )}
        </ProjectStateProvider>
      </div>
    </div>
  );
} 