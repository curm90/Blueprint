import { useQuery } from '@tanstack/react-query'
import { Calendar, Folder } from 'lucide-react'
import { convexQuery } from '@convex-dev/react-query'
import { api } from 'convex/_generated/api'
import { EmptyUI } from '~/components/EmptyUI'
import PageTitle from '~/components/PageTitle'
import TrackWorkoutForm from '~/components/TrackWorkoutForm'
import { Card, CardContent, CardHeader } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'

export default function Homepage() {
  const allWorkouts = useQuery(convexQuery(api.workouts.listWorkouts))
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
  const todaysWorkouts = allWorkouts.data?.filter((w) => w.selectedDays.includes(today))

  const todayDate = new Date().toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className='flex flex-col gap-8 mx-auto w-full'>
      <PageTitle title={`Today's workouts`} subtitle={todayDate} />
      {todaysWorkouts && todaysWorkouts.length > 0 ? (
        todaysWorkouts.map((workout) => (
          <Card key={workout._id} className='pb-0'>
            <CardHeader>
              <h3 className='text-lg font-semibold'>{workout.title}</h3>
            </CardHeader>
            <Separator />
            <CardContent>
              <ul className='flex flex-col gap-2'>
                {workout.exercises.map((exercise) => (
                  <li key={exercise.exerciseTitle}>
                    <div className='flex items-center justify-between'>
                      <h4 className='text-[16px] '>{exercise.exerciseTitle}</h4>
                      <div className='flex gap-2'>
                        <span>{exercise.weight}kg</span>
                        <div className='w-[0.5px] h-4 bg-primary' />
                        <span>
                          {exercise.minReps}-{exercise.maxReps}
                        </span>
                        <span>Reps</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
            <TrackWorkoutForm workout={workout} />
          </Card>
        ))
      ) : (
        <Card className='bg-secondary'>
          <CardContent>
            <EmptyUI
              title='No Workouts Scheduled for Today'
              description="It looks like you don't have any workouts planned for today. Let's get moving and add a workout to your schedule!"
              icon={<Folder />}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
