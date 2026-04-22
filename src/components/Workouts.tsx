import { useSuspenseQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { convexQuery } from '@convex-dev/react-query'
import { Calendar, TrendingUp } from 'lucide-react'
import { api } from 'convex/_generated/api'
import { CreateWorkoutForm } from './CreateWorkoutForm'
import EmptyUI from './EmptyUI'
import PageTitle from './PageTitle'
import ExerciseListItem from './ExerciseListItem'
import { Card, CardContent, CardFooter } from './ui/card'
import { Separator } from './ui/separator'
import { DAYS_OF_WEEK } from '~/lib/constants'
import WorkoutCardHeader from './WorkoutCard/WorkoutCardHeader'

export default function Workouts() {
  const { data: workouts } = useSuspenseQuery(convexQuery(api.workouts.listWorkouts, {}))
  const { data: stats } = useSuspenseQuery(convexQuery(api.workoutCompletions.getWorkoutStats, {}))
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  function toggleExpand(id: WorkoutId) {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }
  return (
    <>
      <div className='flex items-center justify-between'>
        <PageTitle title='My Workouts' />
        <CreateWorkoutForm />
      </div>
      {workouts.length === 0 ? (
        <Card className='bg-secondary'>
          <CardContent>
            <EmptyUI title='No workouts found.' description='Create your first workout here!' />
          </CardContent>
        </Card>
      ) : (
        <div className='flex flex-col gap-4'>
          {workouts.map((workout) => {
            const completionCount = stats?.completionsByWorkout[workout._id as string] ?? 0
            const lastCompleted = stats?.lastCompletedByWorkout[workout._id as string]
            const totalWeightProgress = workout.exercises.reduce(
              (sum, ex) => sum + (ex.weight - ex.startingWeight),
              0,
            )
            const isExpanded = expandedIds.has(workout._id)

            return (
              <Card key={workout._id}>
                <WorkoutCardHeader
                  variant='manage'
                  workoutId={workout._id}
                  isExpanded={isExpanded}
                  onToggleExpand={() => toggleExpand(workout._id)}
                  title={workout.title}
                  exerciseCount={workout.exercises.length}
                  weightUnit={workout.weightUnit}
                  selectedDays={workout.selectedDays}
                  exercises={workout.exercises}
                />
                {isExpanded && (
                  <>
                    <Separator />

                    <CardContent className='flex flex-col gap-4'>
                      {/* Schedule pills */}
                      <div className='flex flex-wrap gap-1.5'>
                        {workout.selectedDays.map((day) => (
                          <span
                            key={day}
                            className='rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary'
                          >
                            <span className='sm:hidden'>
                              {DAYS_OF_WEEK.find((d) => d.value === day)?.shortLabel ?? day}
                            </span>
                            <span className='hidden sm:inline'>
                              {DAYS_OF_WEEK.find((d) => d.value === day)?.label ?? day}
                            </span>
                          </span>
                        ))}
                      </div>

                      {/* Exercise list */}
                      <ul className='flex flex-col gap-2'>
                        {workout.exercises.map((exercise) => (
                          <ExerciseListItem
                            key={exercise.id}
                            title={exercise.exerciseTitle}
                            weight={exercise.weight}
                            weightUnit={workout.weightUnit}
                            sets={exercise.sets}
                            minReps={exercise.minReps}
                            maxReps={exercise.maxReps}
                          />
                        ))}
                      </ul>
                    </CardContent>
                  </>
                )}

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
                        <TrendingUp
                          className={`size-3 ${totalWeightProgress < 0 ? 'rotate-180' : ''}`}
                        />
                        <span>
                          {totalWeightProgress > 0 ? '+' : ''}
                          {totalWeightProgress} {workout.weightUnit}
                        </span>
                      </div>
                    )}
                  </div>
                  {lastCompleted && (
                    <span className='text-xs text-muted-foreground'>
                      Last:{' '}
                      {new Date(lastCompleted).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  )}
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </>
  )
}
