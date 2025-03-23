import { z } from 'zod';

export const issueStateSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  color: z.string(),
});

export const issueAssigneeSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  avatarUrl: z.string().optional(),
});

export const issueLabelSchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string(),
});

export const issueCommentSchema = z.object({
  id: z.string(),
  body: z.string(),
  user: z.object({
    id: z.string(),
    name: z.string(),
    avatarUrl: z.string().optional(),
  }),
  createdAt: z.string(),
});

export const issueSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  state: issueStateSchema,
  priority: z.number().default(0),
  assignee: issueAssigneeSchema.optional(),
  project: z.object({
    id: z.string(),
    name: z.string(),
    state: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  dueDate: z.string().optional(),
  labels: z.array(issueLabelSchema).optional(),
  comments: z.array(issueCommentSchema).optional(),
});

export type Issue = z.infer<typeof issueSchema>; 