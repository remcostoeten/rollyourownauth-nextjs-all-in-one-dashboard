import { LinearClient } from '@linear/sdk';
import { Issue } from '../../models/z.issue';
import { z } from 'zod';

const linearClient = new LinearClient({
  apiKey: process.env.NEXT_PUBLIC_LINEAR_API_KEY,
});

const createIssueInputSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  assigneeId: z.string().optional(),
  priority: z.number().optional(),
  dueDate: z.string().optional(),
  labelIds: z.array(z.string()).optional(),
});

export type CreateIssueInput = z.infer<typeof createIssueInputSchema>;

export async function createIssue(projectId: string, input: CreateIssueInput): Promise<Issue | null> {
  try {
    // Validate input
    createIssueInputSchema.parse(input);

    // Get project details including team
    const projectDetails = await linearClient.project(projectId);
    const teamId = (await projectDetails.team)?.id;
    if (!teamId) return null;

    const response = await linearClient.createIssue({
      teamId,
      projectId,
      title: input.title,
      description: input.description,
      assigneeId: input.assigneeId,
      priority: input.priority,
      dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
      labelIds: input.labelIds,
    });

    const issue = await response.issue;
    if (!issue) return null;

    const [state, assignee, labels] = await Promise.all([
      issue.state,
      issue.assignee,
      issue.labels,
    ]);

    return {
      id: issue.id,
      title: issue.title,
      description: issue.description || undefined,
      state: {
        id: state.id,
        name: state.name,
        type: state.type,
        color: state.color,
      },
      priority: issue.priority || 0,
      assignee: assignee ? {
        id: assignee.id,
        name: assignee.name,
        email: assignee.email,
        avatarUrl: assignee.avatarUrl || undefined,
      } : undefined,
      project: {
        id: projectId,
        name: (await projectDetails).name,
        state: (await projectDetails).state,
        createdAt: (await projectDetails).createdAt.toISOString(),
        updatedAt: (await projectDetails).updatedAt.toISOString(),
      },
      createdAt: issue.createdAt.toISOString(),
      updatedAt: issue.updatedAt.toISOString(),
      dueDate: issue.dueDate?.toISOString(),
      labels: labels?.nodes.map(label => ({
        id: label.id,
        name: label.name,
        color: label.color,
      })),
      comments: [],
    };
  } catch (error) {
    console.error('Error creating issue:', error);
    return null;
  }
} 