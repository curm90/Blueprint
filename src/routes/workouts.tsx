import { convexQuery } from '@convex-dev/react-query'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { api } from 'convex/_generated/api'
import { Edit, Trash } from 'lucide-react'
import { CreateWorkoutForm } from '~/components/CreateWorkoutForm'
import PageTitle from '~/components/PageTitle'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'

export const Route = createFileRoute('/workouts')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: workouts, isPending, error } = useQuery(convexQuery(api.workouts.listWorkouts))

  if (isPending) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div className='p-8 flex flex-col gap-16 min-h-[calc(100vh-66px)] max-w-250 mx-auto'>
      <div className='flex items-center justify-between'>
        <PageTitle title='Workouts' />
        <CreateWorkoutForm />
      </div>

      {workouts.map((workout) => (
        <Card key={workout._id}>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <h4 className='text-lg font-semibold'>{workout.title}</h4>
              <div className='flex items-center gap-2'>
                <Button variant='outline'>
                  <Edit />
                </Button>
                <Button variant='outline'>
                  <Trash />
                </Button>
              </div>
            </div>
          </CardHeader>
          <Separator />
          <CardContent>
            <div className='flex flex-col gap-3'>
              <div className='flex gap-2'>
                <h5 className='text-sm font-medium'>Days:</h5>
                <p className='text-muted-foreground'>
                  {workout.selectedDays
                    .map((day) => day[0].toUpperCase() + day.slice(1))
                    .join(', ')}
                </p>
              </div>
              <div className='flex gap-2'>
                <h5 className='text-sm font-medium'>Exercises:</h5>
                <p className='text-muted-foreground'>
                  {workout.exercises.map((exercise) => exercise.exerciseTitle).join(', ')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
