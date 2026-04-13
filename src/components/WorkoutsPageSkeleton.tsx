import { Card, CardContent, CardHeader } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'
import { Skeleton } from '~/components/ui/skeleton'

export default function WorkoutsPageSkeleton() {
  return (
    <div className='flex flex-col gap-4'>
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <Skeleton className='size-9 rounded-lg' />
                <div className='flex flex-col gap-1.5'>
                  <Skeleton className='h-5 w-36' />
                  <Skeleton className='h-3 w-24' />
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <Skeleton className='size-9 rounded-md' />
                <Skeleton className='size-9 rounded-md' />
              </div>
            </div>
          </CardHeader>

          <Separator />

          <CardContent className='flex flex-col gap-4'>
            {/* Schedule pills */}
            <div className='flex flex-wrap gap-1.5'>
              {Array.from({ length: 4 }).map((_, j) => (
                <Skeleton key={j} className='h-6 w-14 rounded-full' />
              ))}
            </div>

            {/* Exercise list */}
            <div className='flex flex-col gap-2'>
              {Array.from({ length: 3 }).map((_, j) => (
                <div
                  key={j}
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
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
