'use server';

import { revalidatePath } from 'next/cache';
import { createTask as createLinearTask, getProjects, getProjectTasks } from './linear-api';

export async function createTask(projectId: string, data: {
  title: string;
  description?: string;
}) {
  const task = await createLinearTask(projectId, data);
  revalidatePath('/');
  return task;
}

export async function fetchProjects() {
  return getProjects();
}

export async function fetchProjectTasks(projectId: string) {
  return getProjectTasks(projectId);
} 