'use client';

import { type Project } from '@/lib/linear-api';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { formatDistanceToNow } from 'date-fns';

interface MetadataProps {
  project: Project;
  className?: string;
}

export function Metadata({ project, className }: MetadataProps) {
  return (
    <Card className={className}>
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold">{project.name}</h2>
            {project.description && (
              <p className="mt-1 text-sm text-muted-foreground">
                {project.description}
              </p>
            )}
          </div>
          <Badge variant="outline">{project.state}</Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetadataItem
            label="Created"
            value={formatDistanceToNow(new Date(project.createdAt))}
            suffix="ago"
          />
          <MetadataItem
            label="Last Updated"
            value={formatDistanceToNow(new Date(project.updatedAt))}
            suffix="ago"
          />
          {project.members && (
            <MetadataItem
              label="Team Members"
              value={project.members.length.toString()}
              suffix="members"
            />
          )}
          {project.archivedAt && (
            <MetadataItem
              label="Archived"
              value={formatDistanceToNow(new Date(project.archivedAt))}
              suffix="ago"
            />
          )}
        </div>

        {project.members && project.members.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-2">Team Members</h3>
            <div className="flex flex-wrap gap-2">
              {project.members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-2 bg-secondary/50 rounded-full px-3 py-1"
                >
                  {member.avatarUrl ? (
                    <img
                      src={member.avatarUrl}
                      alt={member.name}
                      className="w-4 h-4 rounded-full"
                    />
                  ) : (
                    <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center text-xs">
                      {member.name[0]}
                    </div>
                  )}
                  <span className="text-sm">{member.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {project.metadata && Object.keys(project.metadata).length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-2">Additional Information</h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(project.metadata).map(([key, value]) => (
                <div key={key} className="text-sm">
                  <span className="font-medium">{key}: </span>
                  <span className="text-muted-foreground">
                    {typeof value === 'string' ? value : JSON.stringify(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

interface MetadataItemProps {
  label: string;
  value: string;
  suffix?: string;
}

function MetadataItem({ label, value, suffix }: MetadataItemProps) {
  return (
    <div>
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="text-sm font-medium">
        {value} {suffix && <span className="text-muted-foreground">{suffix}</span>}
      </div>
    </div>
  );
} 