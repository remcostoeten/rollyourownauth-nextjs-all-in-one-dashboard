import { getProjectTasks, createTask } from '@/lib/linear-api';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const tasks = await getProjectTasks(params.projectId);
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const data = await request.json();
    const task = await createTask(params.projectId, data);
    
    if (!task) {
      return NextResponse.json(
        { error: 'Failed to create task' },
        { status: 400 }
      );
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
} 