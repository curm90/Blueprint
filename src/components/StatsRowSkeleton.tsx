import { Card, CardContent } from '~/components/ui/card'
import { Skeleton } from '~/components/ui/skeleton'

export default function StatsRowSkeleton() {
  return (
    <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} size='sm'>
          <CardContent className='flex flex-col gap-1'>
            <div className='flex items-center gap-2'>
              <Skeleton className='size-7 rounded-md' />
              <Skeleton className='h-3 w-16' />
            </div>
            <div className='flex items-baseline gap-1.5 pl-0.5'>
              <Skeleton className='h-7 w-10' />
              <Skeleton className='h-3 w-12' />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
