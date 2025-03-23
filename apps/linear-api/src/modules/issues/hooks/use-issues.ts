import { useState, useCallback, useEffect } from 'react';
import { Issue } from '../models/z.issue';
import { getIssues } from '../api/queries/get-issues';
import { createIssue, CreateIssueInput } from '../api/mutations/create-issue';
import { updateIssueState } from '../api/mutations/update-issue-state';

interface UseIssuesOptions {
  projectId: string;
}

interface UseIssuesReturn {
  issues: Issue[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  createIssue: (input: CreateIssueInput) => Promise<Issue | null>;
  updateIssueState: (issueId: string, stateId: string) => Promise<Issue | null>;
}

export function useIssues({ projectId }: UseIssuesOptions): UseIssuesReturn {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchIssues = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedIssues = await getIssues(projectId);
      setIssues(fetchedIssues);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch issues'));
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const handleCreateIssue = useCallback(async (input: CreateIssueInput) => {
    try {
      const newIssue = await createIssue(projectId, input);
      if (newIssue) {
        setIssues(prev => [...prev, newIssue]);
      }
      return newIssue;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create issue'));
      return null;
    }
  }, [projectId]);

  const handleUpdateIssueState = useCallback(async (issueId: string, stateId: string) => {
    try {
      const updatedIssue = await updateIssueState(issueId, stateId);
      if (updatedIssue) {
        setIssues(prev => prev.map(issue => 
          issue.id === updatedIssue.id ? updatedIssue : issue
        ));
      }
      return updatedIssue;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update issue state'));
      return null;
    }
  }, []);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  return {
    issues,
    loading,
    error,
    refetch: fetchIssues,
    createIssue: handleCreateIssue,
    updateIssueState: handleUpdateIssueState,
  };
} 