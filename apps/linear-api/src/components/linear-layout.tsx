"use client"

import { useState, useCallback } from "react";
import { getProjects, getProjectTasks as getIssues, Project, Task } from "@/lib/linear-api";
import { IssueList } from "./issue-list";
import { IssueDetail } from "./issue-detail";
import { ProjectList } from "./project-list";
import { cn } from "@/lib/utils";
import { Inbox, User, FolderKanban, ListTodo, LayoutGrid, GitPullRequest } from 'lucide-react';
import { Button } from "./ui/button";

interface LinearLayoutProps {
  initialProjects: Project[];
}

export function LinearLayout({ initialProjects }: LinearLayoutProps) {
  const [currentProject, setCurrentProject] = useState<Project | null>(initialProjects[0] || null);
  const [selectedIssue, setSelectedIssue] = useState<Task | null>(null);
  const [inboxItems, setInboxItems] = useState<Task[]>([]);
  const [issues, setIssues] = useState<Task[]>([]);
  const [projects, setProjects] = useState(initialProjects);
  const [currentView, setCurrentView] = useState<'inbox' | 'issues' | 'projects' | 'my-issues' | 'reviews' | 'views'>('issues');

  const handleRouteClick = useCallback(async (route: 'inbox' | 'issues' | 'projects' | 'my-issues' | 'reviews' | 'views') => {
    setCurrentView(route);
    setSelectedIssue(null); // Reset selected issue when changing routes
    
    // Reset project selection for non-project/issues views
    if (!['issues', 'projects'].includes(route)) {
      setCurrentProject(null);
    }

    // Trigger appropriate data fetch based on route
    switch (route) {
      case 'inbox':
        if (currentProject?.id) {
          console.log('Fetching inbox items for project:', currentProject.id);
          const items = await getIssues(currentProject.id);
          setInboxItems(items.filter(item => item.state === 'Inbox'));
        }
        break;
      case 'issues':
        if (currentProject?.id) {
          console.log('Fetching issues for project:', currentProject.id);
          const issues = await getIssues(currentProject.id);
          console.log('Fetched issues:', issues);
          setIssues(issues);
        }
        break;
      case 'projects':
        console.log('Fetching all projects');
        const projects = await getProjects();
        console.log('Fetched projects:', projects);
        setProjects(projects);
        break;
    }
  }, [currentProject?.id]);

  const handleProjectSelect = useCallback(async (project: Project) => {
    console.log('Selecting project:', project.name);
    setCurrentProject(project);
    if (currentView !== 'issues') {
      console.log('Fetching issues for newly selected project:', project.id);
      const issues = await getIssues(project.id);
      console.log('Fetched issues:', issues);
      setIssues(issues);
    }
  }, [currentView]);

  const handleViewIssues = useCallback(async (project: Project) => {
    console.log('Viewing issues for project:', project.name);
    setCurrentProject(project);
    setCurrentView('issues');
    const issues = await getIssues(project.id);
    console.log('Fetched issues:', issues);
    setIssues(issues);
  }, []);

  return (
    <div className="flex h-screen bg-[#09090B] text-[#E2E2E2]">
      <div className="w-[240px] bg-[#09090B] border-r border-[#1D1D1D] p-2 flex flex-col gap-1">
        <Button
          variant="ghost"
          className={cn(
            "justify-start",
            currentView === "inbox" && "bg-[#1D1D1D]"
          )}
          onClick={() => handleRouteClick("inbox")}
        >
          <Inbox className="mr-2 h-4 w-4" />
          Inbox
        </Button>
        <Button
          variant="ghost"
          className={cn(
            "justify-start",
            currentView === "issues" && "bg-[#1D1D1D]"
          )}
          onClick={() => handleRouteClick("issues")}
        >
          <ListTodo className="mr-2 h-4 w-4" />
          Issues
        </Button>
        <Button
          variant="ghost"
          className={cn(
            "justify-start",
            currentView === "projects" && "bg-[#1D1D1D]"
          )}
          onClick={() => handleRouteClick("projects")}
        >
          <FolderKanban className="mr-2 h-4 w-4" />
          Projects
        </Button>
        <Button
          variant="ghost"
          className={cn(
            "justify-start",
            currentView === "views" && "bg-[#1D1D1D]"
          )}
          onClick={() => handleRouteClick("views")}
        >
          <LayoutGrid className="mr-2 h-4 w-4" />
          Views
        </Button>
        <Button
          variant="ghost"
          className={cn(
            "justify-start",
            currentView === "my-issues" && "bg-[#1D1D1D]"
          )}
          onClick={() => handleRouteClick("my-issues")}
        >
          <User className="mr-2 h-4 w-4" />
          My Issues
        </Button>
        <Button
          variant="ghost"
          className={cn(
            "justify-start",
            currentView === "reviews" && "bg-[#1D1D1D]"
          )}
          onClick={() => handleRouteClick("reviews")}
        >
          <GitPullRequest className="mr-2 h-4 w-4" />
          Reviews
        </Button>
      </div>

      {/* Main Content */}
      <div className={cn(
        "flex-1 flex flex-col bg-[#09090B]",
        selectedIssue ? "border-r border-[#1D1D1D]" : ""
      )}>
        {currentView === 'inbox' && (
          <IssueList 
            issues={inboxItems}
            onIssueSelect={setSelectedIssue}
            selectedIssueId={selectedIssue?.id}
          />
        )}
        {currentView === 'issues' && (
          <IssueList 
            issues={issues}
            projectId={currentProject?.id}
            onIssueSelect={setSelectedIssue}
            selectedIssueId={selectedIssue?.id}
          />
        )}
        {currentView === 'projects' && (
          <ProjectList 
            projects={projects}
            onProjectSelect={handleProjectSelect}
            selectedProjectId={currentProject?.id}
            onViewIssues={handleViewIssues}
          />
        )}
        {['my-issues', 'reviews', 'views'].includes(currentView) && (
          <div className="flex items-center justify-center h-full text-[#737373]">
            {currentView.charAt(0).toUpperCase() + currentView.slice(1).replace('-', ' ')} view coming soon
          </div>
        )}
      </div>

      {/* Issue Details Panel */}
      {selectedIssue && (
        <div className="w-[45%] bg-[#09090B] border-l border-[#1D1D1D]">
          <IssueDetail 
            issue={selectedIssue}
            onClose={() => setSelectedIssue(null)}
          />
        </div>
      )}
    </div>
  );
}