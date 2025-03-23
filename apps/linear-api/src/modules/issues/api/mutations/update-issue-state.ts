import { LinearClient } from '@linear/sdk';
import { Issue } from '../../models/z.issue';

const linearClient = new LinearClient({
  apiKey: process.env.NEXT_PUBLIC_LINEAR_API_KEY,
});

export async function updateIssueState(issueId: string, stateId: string): Promise<Issue | null> {
  try {
    const response = await linearClient.updateIssue(issueId, {
      stateId,
    });

    const issue = await response.issue;
    if (!issue) return null;

    const [state, assignee, labels, comments, project] = await Promise.all([
      issue.state,
      issue.assignee,
      issue.labels({ first: 100 }),
      issue.comments({ first: 100 }),
      issue.project,
    ]);

    if (!state) {
      throw new Error(`No state found for issue ${issue.id}`);
    }

    const labelsNodes = await labels.nodes;
    const commentsNodes = await comments.nodes;

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
      labels: labelsNodes.map(label => ({
        id: label.id,
        name: label.name,
        color: label.color,
      })),
      comments: await Promise.all(
        commentsNodes.map(async (comment) => {
          const user = await comment.user;
          if (!user) {
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
    };
  } catch (error) {
    console.error('Error updating issue state:', error);
    return null;
  }
} 