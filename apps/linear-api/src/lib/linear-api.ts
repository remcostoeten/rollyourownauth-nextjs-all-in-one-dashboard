'use server'

import { LinearClient } from '@linear/sdk';
import { cache } from 'react';

const linearClient = new LinearClient({
  apiKey: process.env.NEXT_PUBLIC_LINEAR_API_KEY,
});

export interface Project {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  state: string;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
  team: {
    id: string;
    name: string;
    key: string;
  };
  members?: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  }[];
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  state: string;
  priority: number;
  assignee?: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
  project?: {
    id: string;
    name: string;
    state: string;
    createdAt: string;
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  labels?: {
    id: string;
    name: string;
    color: string;
  }[];
  comments?: {
    id: string;
    body: string;
    user: {
      id: string;
      name: string;
      avatarUrl?: string;
    };
    createdAt: string;
  }[];
}

// Cache the getProjects call for 5 minutes
export const getProjects = cache(async (): Promise<Project[]> => {
  try {
    const projects = await linearClient.projects();
    return Promise.all(
      projects.nodes.map(async (project) => {
        const team = await project.team;
        return {
          id: project.id,
          name: project.name,
          description: project.description || undefined,
          color: project.color || undefined,
          icon: project.icon || undefined,
          state: project.state,
          createdAt: project.createdAt.toISOString(),
          updatedAt: project.updatedAt.toISOString(),
          archivedAt: project.archivedAt?.toISOString(),
          team: {
            id: team?.id,
            name: team?.name,
            key: team?.key,
          },
        };
      })
    );
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
});

// Cache the getProjectTasks call for 30 seconds
export const getProjectTasks = cache(async (projectId: string): Promise<Task[]> => {
  try {
    console.log('Fetching tasks from Linear API for project:', projectId);
    const issues = await linearClient.issues({
      filter: {
        project: { id: { eq: projectId } },
      },
      first: 100,
      includeArchived: false,
    });

    console.log('Raw Linear API response:', issues.nodes);

    const validTasks: Task[] = [];

    for (const issue of issues.nodes) {
      try {
        const [state, assignee, labelsConnection, commentsConnection, project] = await Promise.all([
          issue.state,
          issue.assignee,
          issue.labels({ first: 100 }),
          issue.comments({ first: 100 }),
          issue.project,
        ]);

        if (!state) {
          console.warn(`No state found for issue ${issue.id}, skipping`);
          continue;
        }

        const labels = await labelsConnection.nodes;
        const comments = await commentsConnection.nodes;

        validTasks.push({
          id: issue.id,
          title: issue.title,
          description: issue.description || undefined,
          state: state.name,
          priority: issue.priority || 0,
          assignee: assignee ? {
            id: assignee.id,
            name: assignee.name,
            email: assignee.email,
            avatarUrl: assignee.avatarUrl || undefined,
          } : undefined,
          project: project ? {
            id: project.id,
            name: project.name,
            state: project.state,
            createdAt: project.createdAt.toISOString(),
            updatedAt: project.updatedAt.toISOString(),
          } : undefined,
          createdAt: issue.createdAt.toISOString(),
          updatedAt: issue.updatedAt.toISOString(),
          dueDate: issue.dueDate?.toISOString(),
          labels: labels.map(label => ({
            id: label.id,
            name: label.name,
            color: label.color,
          })),
          comments: await Promise.all(
            comments.map(async (comment) => {
              const user = await comment.user;
              if (!user) {
                console.warn(`No user found for comment ${comment.id}, using system user`);
                return {
                  id: comment.id,
                  body: comment.body,
                  user: {
                    id: 'system',
                    name: 'System',
                    avatarUrl: undefined,
                  },
                  createdAt: comment.createdAt.toISOString(),
                };
              }
              return {
                id: comment.id,
                body: comment.body,
                user: {
                  id: user.id,
                  name: user.name,
                  avatarUrl: user.avatarUrl || undefined,
                },
                createdAt: comment.createdAt.toISOString(),
              };
            })
          ),
        });
      } catch (error) {
        console.error(`Error processing issue ${issue.id}:`, error);
        continue;
      }
    }

    console.log('Transformed tasks:', validTasks);
    return validTasks;
  } catch (error) {
    console.error('Error fetching tasks from Linear API:', error);
    return [];
  }
});

export async function createTask(projectId: string, data: {
  title: string;
  description?: string;
  assigneeId?: string;
  priority?: number;
  dueDate?: string;
  labelIds?: string[];
}): Promise<Task | null> {
  try {
    // Get project details including team
    const projectDetails = await linearClient.project(projectId);
    const teamId = (await projectDetails.team)?.id;
    if (!teamId) return null;

    const response = await linearClient.createIssue({
      teamId,
      projectId,
      title: data.title,
      description: data.description,
      assigneeId: data.assigneeId,
      priority: data.priority,
      dueDate: data.dueDate,
      labelIds: data.labelIds,
    });

    // Get full issue details after creation
    const createdIssue = await response.issue;
    if (!createdIssue) return null;

    const [state, createdAt, updatedAt] = await Promise.all([
      createdIssue.state,
      createdIssue.createdAt,
      createdIssue.updatedAt,
    ]);

    return {
      id: createdIssue.id,
      title: createdIssue.title,
      description: createdIssue.description || undefined,
      state: (await state)?.name || 'Unknown',
      priority: createdIssue.priority || 0,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    };
  } catch (error) {
    console.error('Error creating task:', error);
    return null;
  }
} 