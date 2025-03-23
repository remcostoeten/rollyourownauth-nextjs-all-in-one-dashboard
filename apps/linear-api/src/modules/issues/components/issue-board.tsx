'use client';

import { useCallback, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Issue } from '../models/z.issue';
import { useIssues } from '../hooks/use-issues';
import { IssueCard } from './issue-card';
import { CreateIssueDialog } from './create-issue-dialog';
import { Button } from '@/shared/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { CreateIssueInput } from '../api/mutations/create-issue';

interface IssueBoardProps {
  projectId: string;
}

type IssueColumn = {
  id: string;
  title: string;
  stateId: string;
  issues: Issue[];
};

export function IssueBoard({ projectId }: IssueBoardProps) {
  const { issues, loading, error, createIssue, refetch, updateIssueState } = useIssues({ projectId });
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);

  const columns: IssueColumn[] = [
    {
      id: 'backlog',
      title: 'Backlog',
      stateId: 'backlog',
      issues: issues.filter(issue => issue.state.name === 'Backlog'),
    },
    {
      id: 'todo',
      title: 'Todo',
      stateId: 'todo',
      issues: issues.filter(issue => issue.state.name === 'Todo'),
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      stateId: 'in_progress',
      issues: issues.filter(issue => issue.state.name === 'In Progress'),
    },
    {
      id: 'done',
      title: 'Done',
      stateId: 'done',
      issues: issues.filter(issue => issue.state.name === 'Done'),
    },
  ];

  const handleDragEnd = useCallback(async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // Dropped outside a valid droppable
    if (!destination) return;

    // Dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;

    const sourceColumn = columns.find(col => col.id === source.droppableId);
    const destinationColumn = columns.find(col => col.id === destination.droppableId);

    if (!sourceColumn || !destinationColumn) return;

    // If the issue was moved to a different column, update its state
    if (source.droppableId !== destination.droppableId) {
      const issue = sourceColumn.issues.find(i => i.id === draggableId);
      if (!issue) return;

      try {
        await updateIssueState(issue.id, destinationColumn.stateId);
        await refetch();
      } catch (error) {
        console.error('Failed to update issue state:', error);
        // TODO: Show error toast
      }
    }
  }, [columns, updateIssueState, refetch]);

  const handleCreateIssue = useCallback(async (data: CreateIssueInput) => {
    if (!selectedColumn) return;
    await createIssue(data);
    await refetch();
    setCreateDialogOpen(false);
    setSelectedColumn(null);
  }, [createIssue, refetch, selectedColumn]);

  const handleCreateClick = useCallback((columnId: string) => {
    setSelectedColumn(columnId);
    setCreateDialogOpen(true);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-destructive">
        {error.message}
      </div>
    );
  }

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 p-4 h-full overflow-x-auto">
          {columns.map(column => (
            <div
              key={column.id}
              className="flex flex-col w-80 bg-[#1D1D1D] rounded-lg"
            >
              <div className="flex items-center justify-between p-3 border-b border-[#2D2D2D]">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{column.title}</h3>
                  <span className="text-sm text-muted-foreground">
                    {column.issues.length}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => handleCreateClick(column.id)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex-1 p-2 space-y-2 overflow-y-auto"
                  >
                    {column.issues.map((issue, index) => (
                      <Draggable
                        key={issue.id}
                        draggableId={issue.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <IssueCard issue={issue} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      <CreateIssueDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateIssue}
        defaultState={selectedColumn || undefined}
      />
    </>
  );
} 