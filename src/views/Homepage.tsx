import { useQuery } from '@tanstack/react-query'
import { CalendarOff, CheckCircle, Dumbbell, Folder, TrendingUp } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { convexQuery } from '@convex-dev/react-query'
import { api } from 'convex/_generated/api'
import { CreateWorkoutForm } from '~/components/CreateWorkoutForm'
import { EmptyUI } from '~/components/EmptyUI'
import PageTitle from '~/components/PageTitle'
import TrackWorkoutForm from '~/components/TrackWorkoutForm'
import WorkoutCardSkeleton from '~/components/WorkoutCardSkeleton'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'
import StatsCardsList from '~/components/StatsCardsList'

export default function Homepage() {
  const allWorkouts = useQuery(convexQuery(api.workouts.listWorkouts))
  const stats = useQuery(convexQuery(api.workoutCompletions.getWorkoutStats, {}))

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
  const todaysWorkouts = allWorkouts.data?.filter((w) => w.selectedDays.includes(today))

  const startOfDay = new Date()
  startOfDay.setHours(0, 0, 0, 0)
  const todaysCompletions = useQuery(
    convexQuery(api.workoutCompletions.getTodaysCompletions, {
      startOfDay: startOfDay.getTime(),
    }),
  )

  const completedWorkoutIds = new Set(todaysCompletions.data?.map((c) => c.workoutId) ?? [])

  const todayDate = new Date().toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className='flex flex-col gap-8 mx-auto w-full'>
      <PageTitle title={`Today's workouts`} subtitle={todayDate} />

      {/* Stats row */}
      <StatsCardsList
        stats={stats}
        todaysWorkouts={todaysWorkouts}
        completedWorkoutIds={completedWorkoutIds}
      />

      {/* Workout cards */}
      {allWorkouts.isLoading ? (
        <div className='flex flex-col gap-4'>
          <WorkoutCardSkeleton />
          <WorkoutCardSkeleton />
        </div>
      ) : todaysWorkouts && todaysWorkouts.length > 0 ? (
        <div className='flex flex-col gap-4'>
          {todaysWorkouts.map((workout) => {
            const isCompleted = completedWorkoutIds.has(workout._id)
            const workoutCompletionCount =
              stats.data?.completionsByWorkout[workout._id as string] ?? 0
            const lastCompleted = stats.data?.lastCompletedByWorkout[workout._id as string]
            const totalWeightProgress = workout.exercises.reduce(
              (sum, ex) => sum + (ex.weight - ex.startingWeight),
              0,
            )

            return (
              <Card
                key={workout._id}
                className={`transition-all ${isCompleted ? 'opacity-60 ring-emerald-500/30' : ''}`}
              >
                <CardHeader>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      <div
                        className={`rounded-lg p-2 ${isCompleted ? 'bg-emerald-500/10' : 'bg-primary/10'}`}
                      >
                        <Dumbbell
                          className={`size-5 ${isCompleted ? 'text-emerald-500' : 'text-primary'}`}
                        />
                      </div>
                      <div>
                        <h3 className='text-lg font-semibold'>{workout.title}</h3>
                        <p className='text-xs text-muted-foreground'>
                          {workout.exercises.length} exercises &middot; {workout.weightUnit}
                        </p>
                      </div>
                    </div>
                    {isCompleted && (
                      <div className='flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1'>
                        <CheckCircle className='size-3.5 text-emerald-500' />
                        <span className='text-xs font-medium text-emerald-500'>Done</span>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <Separator />

                <CardContent className='flex flex-col gap-4'>
                  {/* Mini metrics row */}
                  <div className='grid grid-cols-3 gap-3'>
                    <div className='flex flex-col gap-0.5 rounded-lg bg-muted/50 px-3 py-2'>
                      <span className='text-[11px] font-medium text-muted-foreground uppercase tracking-wider'>
                        Schedule
                      </span>
                      <span className='text-sm font-semibold'>
                        {workout.selectedDays.length}x / week
                      </span>
                    </div>
                    <div className='flex flex-col gap-0.5 rounded-lg bg-muted/50 px-3 py-2'>
                      <span className='text-[11px] font-medium text-muted-foreground uppercase tracking-wider'>
                        Times Done
                      </span>
                      <span className='text-sm font-semibold'>{workoutCompletionCount}</span>
                    </div>
                    <div className='flex flex-col gap-0.5 rounded-lg bg-muted/50 px-3 py-2'>
                      <span className='text-[11px] font-medium text-muted-foreground uppercase tracking-wider'>
                        Progress
                      </span>
                      <span
                        className={`text-sm font-semibold flex items-center gap-1 ${totalWeightProgress > 0 ? 'text-emerald-500' : totalWeightProgress < 0 ? 'text-red-500' : ''}`}
                      >
                        {totalWeightProgress > 0 ? '+' : ''}
                        {totalWeightProgress} {workout.weightUnit}
                        {totalWeightProgress !== 0 && (
                          <TrendingUp
                            className={`size-3 ${totalWeightProgress < 0 ? 'rotate-180' : ''}`}
                          />
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Exercise list */}
                  <ul className='flex flex-col gap-2'>
                    {workout.exercises.map((exercise) => (
                      <li
                        key={exercise.exerciseTitle}
                        className='flex items-center justify-between rounded-lg border border-border/50 px-3 py-2.5'
                      >
                        <h4 className='text-sm font-medium'>{exercise.exerciseTitle}</h4>
                        <div className='flex items-center gap-2 text-sm'>
                          <span className='rounded-md bg-primary/10 px-2 py-0.5 font-semibold text-primary'>
                            {exercise.weight} {workout.weightUnit}
                          </span>
                          <span className='text-muted-foreground'>
                            {exercise.minReps}-{exercise.maxReps} reps
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {!isCompleted && <TrackWorkoutForm workout={workout} />}
                </CardContent>

                {lastCompleted && (
                  <CardFooter>
                    <span className='text-xs text-muted-foreground'>
                      Last completed{' '}
                      {new Date(lastCompleted).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </CardFooter>
                )}
              </Card>
            )
          })}
        </div>
      ) : allWorkouts.data && allWorkouts.data.length === 0 ? (
        <Card className='bg-secondary'>
          <CardContent>
            <EmptyUI
              title='No Workouts Yet'
              description='Create your first workout to start tracking your progress.'
              icon={<Folder />}
            />
          </CardContent>
        </Card>
      ) : (
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
              <CreateWorkoutForm />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
