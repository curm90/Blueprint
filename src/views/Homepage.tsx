import { convexQuery } from '@convex-dev/react-query'
import { useQuery } from '@tanstack/react-query'
import { api } from 'convex/_generated/api'
import { Calendar, Folder } from 'lucide-react'
import { EmptyUI } from '~/components/EmptyUI'
import PageTitle from '~/components/PageTitle'
import { Button } from '~/components/ui/button'
import { Card, CardAction, CardContent, CardHeader } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'

export default function Homepage() {
  const allWorkouts = useQuery(convexQuery(api.workouts.listWorkouts))
  const testWorkout = allWorkouts.data?.[0]

  const todayDate = new Date().toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
  return (
    <div className='flex flex-col gap-8 mx-auto w-full'>
      <PageTitle title={`Today's workout`} subtitle={todayDate} />
      {testWorkout ? (
        <Card className='p-8 pb-8'>
          <CardHeader className='px-0'>
            <div className='flex gap-2 items-center'>
              <Calendar size={16} />
              <div className='flex  text-lg'>
                <h3 className='font-semibold'>Today's Workout</h3>
                <h3 className='text-muted-foreground'> - {todayDate}</h3>
              </div>
            </div>
          </CardHeader>
          <Card className='pb-0'>
            <CardHeader>
              <h3 className='text-lg font-semibold'>{testWorkout.title}</h3>
            </CardHeader>
            <Separator />
            <CardContent>
              <ul className='flex flex-col gap-2'>
                {testWorkout.exercises.map((exercise) => (
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
            <CardAction className='border-t w-full py-6 px-4'>
              <Button>Track Workout</Button>
            </CardAction>
          </Card>
        </Card>
      ) : (
        <Card className='bg-secondary'>
          <CardContent>
            <EmptyUI
              title='No Workouts Scheduled for Today'
              description="It looks like you don't have any workouts planned for today. Let's get moving and add a workout to your schedule!"
              buttonText='Create Workout'
              icon={<Folder />}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
