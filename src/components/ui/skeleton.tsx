import { cn } from '@/lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted/50', className)}
      {...props}
    />
  )
}

export function WorkoutCardSkeleton() {
  return (
    <div className="bg-card border border-border/50 rounded-lg p-6 shadow-sm space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <div className="space-y-1">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-3/4" />
        </div>
      </div>

      <div className="pt-4 border-t border-border/30">
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  )
}

export function ProgressRowSkeleton() {
  return (
    <tr className="border-b border-border/30 last:border-0">
      <td className="p-4">
        <Skeleton className="h-5 w-32" />
      </td>
      <td className="p-4 text-right">
        <Skeleton className="h-5 w-16 ml-auto" />
      </td>
      <td className="p-4 text-right">
        <Skeleton className="h-5 w-16 ml-auto" />
      </td>
      <td className="p-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <Skeleton className="h-6 w-16 rounded-md" />
          <Skeleton className="h-4 w-10" />
        </div>
      </td>
      <td className="p-4 text-right">
        <Skeleton className="h-5 w-8 ml-auto" />
      </td>
      <td className="p-4 text-right">
        <Skeleton className="h-5 w-20 ml-auto" />
      </td>
    </tr>
  )
}

export function HomeLoadingSkeleton() {
  return (
    <div className="mx-auto my-10 max-w-6xl px-6">
      <div className="flex flex-col gap-8">
        {/* Header Skeleton */}
        <div className="text-center">
          <Skeleton className="h-8 w-64 mx-auto mb-2" />
          <Skeleton className="h-4 w-48 mx-auto" />
        </div>

        {/* Workout Cards Skeleton */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <WorkoutCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function ProgressLoadingSkeleton() {
  return (
    <div className="mx-auto max-w-6xl my-10 flex flex-col gap-6 px-10">
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-48" />

        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-72" />
          <Skeleton className="h-5 w-24" />
        </div>
      </div>

      <div className="border border-border/50 rounded-lg overflow-hidden bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30 border-b border-border/50">
              <tr>
                <th className="text-left p-4 font-medium text-muted-foreground">
                  Exercise
                </th>
                <th className="text-right p-4 font-medium text-muted-foreground">
                  Current
                </th>
                <th className="text-right p-4 font-medium text-muted-foreground">
                  Started
                </th>
                <th className="text-right p-4 font-medium text-muted-foreground">
                  Progress
                </th>
                <th className="text-right p-4 font-medium text-muted-foreground">
                  Sessions
                </th>
                <th className="text-right p-4 font-medium text-muted-foreground">
                  Last Session
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <ProgressRowSkeleton key={i} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export function EmptyStateSkeleton() {
  return (
    <div className="mx-auto my-10 max-w-6xl px-6">
      <div className="text-center py-12">
        <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
        <Skeleton className="h-6 w-48 mx-auto mb-2" />
        <Skeleton className="h-4 w-64 mx-auto mb-6" />
        <Skeleton className="h-10 w-32 mx-auto" />
      </div>
    </div>
  )
}
