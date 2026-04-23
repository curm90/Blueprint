import { Card, CardContent, CardHeader } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'
import { Skeleton } from '~/components/ui/skeleton'

export default function WorkoutCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <Skeleton className='size-9 rounded-lg' />
            <div className='flex flex-col gap-1.5'>
              <Skeleton className='h-5 w-32' />
              <Skeleton className='h-3 w-24' />
            </div>
          </div>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className='flex flex-col gap-4'>
        {/* Mini metrics row */}
        <div className='grid grid-cols-3 gap-3'>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className='flex flex-col gap-1.5 rounded-lg bg-muted/50 px-3 py-2'>
              <Skeleton className='h-2.5 w-14' />
              <Skeleton className='h-4 w-16' />
            </div>
          ))}
        </div>

        {/* Exercise list */}
        <div className='flex flex-col gap-2'>
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className='flex items-center justify-between rounded-lg border border-border/50 px-3 py-2.5'
            >
              <Skeleton className='h-4 w-28' />
              <div className='flex items-center gap-2'>
                <Skeleton className='h-5 w-14 rounded-md' />
                <Skeleton className='h-4 w-16' />
              </div>
            </div>
          ))}
        </div>

        {/* Track button */}
        <Skeleton className='h-9 w-full rounded-md' />
      </CardContent>
    </Card>
  )
}
