import { cache } from 'react';
import { LinearClient } from '@linear/sdk';
import { Issue } from '../../models/z.issue';

const linearClient = new LinearClient({
  apiKey: process.env.NEXT_PUBLIC_LINEAR_API_KEY,
});

export const getIssues = cache(async (projectId: string): Promise<Issue[]> => {
  try {
    const issues = await linearClient.issues({
      filter: {
        project: { id: { eq: projectId } },
      },
      first: 100,
      includeArchived: false,
    });

    const validIssues: Issue[] = [];

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

        validIssues.push({
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

    return validIssues;
  } catch (error) {
    console.error('Error fetching issues:', error);
    return [];
  }
}); 