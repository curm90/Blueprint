import { Card, CardContent } from './ui/card'
import { CalendarOff } from 'lucide-react'
import { Button } from './ui/button'
import { Link } from '@tanstack/react-router'
import { CreateWorkoutForm } from './CreateWorkoutForm'

export default function RestDayCard() {
  return (
    <Card className='border-dashed'>
      <CardContent className='flex flex-col items-center gap-4 py-8'>
        <div className='rounded-xl bg-muted p-3'>
          <CalendarOff className='size-6 text-muted-foreground' />
        </div>
        <div className='text-center'>
          <h3 className='text-lg font-semibold'>Rest Day</h3>
          <p className='text-sm text-muted-foreground mt-1'>
            No workouts scheduled for today. Enjoy the recovery!
          </p>
        </div>
        <div className='flex flex-col sm:flex-row gap-2'>
          <Button variant='outline' asChild>
            <Link to='/workouts'>View all workouts</Link>
          </Button>
          <CreateWorkoutForm compact={false} />
        </div>
      </CardContent>
    </Card>
  )
}
