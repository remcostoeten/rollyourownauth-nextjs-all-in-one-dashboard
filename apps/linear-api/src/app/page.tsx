import { getProjects } from '@/lib/linear-api'
import { TaskBoard } from '@/components/task-board'
import { LinearLayout } from '@/components/linear-layout';


export default async function TasksPage() {
  const projects = await getProjects();
  const defaultProjectId = projects[0]?.id;

  return (
      <LinearLayout initialProjects={projects}>
      <div className="h-full flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between border-b px-6 h-14">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">All Issues</h1>
          </div>
        </header>
        <main className="flex-1 overflow-auto">
          <div className="px-6 py-4">
            {defaultProjectId ? (
              <TaskBoard projectId={defaultProjectId} />
            ) : (
              <div className="text-center text-muted-foreground py-8">
                No projects found. Create a project to get started.
              </div>
            )}
          </div>
        </main>
      </div>
    </LinearLayout>
  )
}

