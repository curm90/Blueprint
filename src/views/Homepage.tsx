import { useQuery } from '@tanstack/react-query'
import {
  Calendar,
  CheckCircle,
  Dumbbell,
  Flame,
  Folder,
  Target,
  TrendingUp,
  Trophy,
} from 'lucide-react'
import { convexQuery } from '@convex-dev/react-query'
import { api } from 'convex/_generated/api'
import { EmptyUI } from '~/components/EmptyUI'
import PageTitle from '~/components/PageTitle'
import TrackWorkoutForm from '~/components/TrackWorkoutForm'
import { Card, CardContent, CardFooter, CardHeader } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'

export default function Homepage() {
  const allWorkouts = useQuery(convexQuery(api.workouts.listWorkouts))
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
  const todaysWorkouts = allWorkouts.data?.filter((w) => w.selectedDays.includes(today))

  const startOfDay = new Date()
  startOfDay.setHours(0, 0, 0, 0)
  const todaysCompletions = useQuery(
    convexQuery(api.workoutCompletions.getTodaysCompletions, {
      startOfDay: startOfDay.getTime(),
    }),
  )

  const stats = useQuery(convexQuery(api.workoutCompletions.getWorkoutStats, {}))

  const completedWorkoutIds = new Set(todaysCompletions.data?.map((c) => c.workoutId) ?? [])

  const todayDate = new Date().toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  const statCards = [
    {
      label: 'Current Streak',
      value: stats.data?.streak ?? 0,
      suffix: stats.data?.streak === 1 ? 'day' : 'days',
      icon: <Flame className='size-4' />,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
    },
    {
      label: 'This Week',
      value: stats.data?.thisWeekCompletions ?? 0,
      suffix: 'sessions',
      icon: <Calendar className='size-4' />,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      label: 'Total Completions',
      value: stats.data?.totalCompletions ?? 0,
      suffix: 'all time',
      icon: <Trophy className='size-4' />,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
    },
    {
      label: "Today's Progress",
      value: todaysWorkouts ? `${completedWorkoutIds.size}/${todaysWorkouts.length}` : '0/0',
      suffix: 'workouts',
      icon: <Target className='size-4' />,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
  ]

  return (
    <div className='flex flex-col gap-8 mx-auto w-full'>
      <PageTitle title={`Today's workouts`} subtitle={todayDate} />

      {/* Stats row */}
      <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
        {statCards.map((stat) => (
          <Card key={stat.label} size='sm'>
            <CardContent className='flex flex-col gap-1'>
              <div className='flex items-center gap-2'>
                <div className={`rounded-md p-1.5 ${stat.bg}`}>
                  <span className={stat.color}>{stat.icon}</span>
                </div>
                <span className='text-xs text-muted-foreground'>{stat.label}</span>
              </div>
              <div className='flex items-baseline gap-1.5 pl-0.5'>
                <span className='text-2xl font-bold tracking-tight'>{stat.value}</span>
                <span className='text-xs text-muted-foreground'>{stat.suffix}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Workout cards */}
      {todaysWorkouts && todaysWorkouts.length > 0 ? (
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
