import { Calendar, TrendingUp } from 'lucide-react'
import { CardFooter } from '../ui/card'

export default function WorkoutCardFooter({
  lastCompleted,
  completionCount,
  totalWeightProgress,
  weightUnit,
}: WorkoutCardFooterProps) {
  return (
    lastCompleted && (
      <CardFooter className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
            <Calendar className='size-3.5' />
            <span>{completionCount} completions</span>
          </div>
          {totalWeightProgress !== 0 && (
            <div
              className={`flex items-center gap-1 text-xs font-medium ${totalWeightProgress > 0 ? 'text-emerald-500' : 'text-red-500'}`}
            >
              <TrendingUp className={`size-3 ${totalWeightProgress < 0 ? 'rotate-180' : ''}`} />
              <span>
                {totalWeightProgress > 0 ? '+' : ''}
                {totalWeightProgress} {weightUnit}
              </span>
            </div>
          )}
        </div>
        <span className='text-xs text-muted-foreground'>
          Last completed{' '}
          {new Date(lastCompleted).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
          })}
        </span>
      </CardFooter>
    )
  )
}
