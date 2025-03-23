import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function Loading() {
  return (
    <Card className="bg-card">
      <CardContent className="p-6">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-card-secondary">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
              <Skeleton className="h-8 w-8" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

