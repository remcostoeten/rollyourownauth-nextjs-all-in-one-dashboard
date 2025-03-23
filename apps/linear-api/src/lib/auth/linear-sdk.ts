/**
 * @author Remco Stoeten
 * @description Linear SDK integration for project management
 * Handles fetching and transforming Linear project data with caching
 */

import { LinearClient } from "@linear/sdk";
import { cache } from 'react';

// Create the Linear client
const linearClient = new LinearClient({
  apiKey: process.env.LINEAR_API_KEY,
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
}

// SDK operations that require Node.js features
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
