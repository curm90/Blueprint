import { Calendar } from 'lucide-react'
import { Card, CardHeader } from './ui/card'

export default function TodaysWorkoutCard() {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })
  return (
    <Card>
      <CardHeader>
        <div>
          <Calendar className='h-4 w-4 text-muted-foreground' />
          <h3 className='text-sm font-medium'>Today's Workout - {today}</h3>
        </div>
      </CardHeader>
    </Card>
  )
}
