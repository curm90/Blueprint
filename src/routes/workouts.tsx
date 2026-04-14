import { convexQuery } from '@convex-dev/react-query'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Calendar, ChevronDown, Dumbbell, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import { api } from 'convex/_generated/api'
import type { Id } from 'convex/_generated/dataModel'
import { CreateWorkoutForm, EditWorkoutForm } from '~/components/CreateWorkoutForm'
import DeleteWorkoutDialog from '~/components/DeleteWorkoutDialog'
import { EmptyUI } from '~/components/EmptyUI'
import PageTitle from '~/components/PageTitle'
import WorkoutsPageSkeleton from '~/components/WorkoutsPageSkeleton'
import { Card, CardContent, CardFooter, CardHeader } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'
import { DAYS_OF_WEEK } from '~/lib/constants'

export const Route = createFileRoute('/workouts')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: workouts, isPending, error } = useQuery(convexQuery(api.workouts.listWorkouts))
  const stats = useQuery(convexQuery(api.workoutCompletions.getWorkoutStats, {}))
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  function toggleExpand(id: Id<'workouts'>) {
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

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div className='p-4 pb-24 sm:p-8 sm:pb-8 flex flex-col gap-8 sm:gap-10 min-h-[calc(100vh-66px)] max-w-250 mx-auto'>
      <div className='flex items-center justify-between'>
        <PageTitle title='My Workouts' />
        <CreateWorkoutForm />
      </div>
      {isPending ? (
        <WorkoutsPageSkeleton />
      ) : workouts.length === 0 ? (
        <Card className='bg-secondary'>
          <CardContent>
            <EmptyUI title='No workouts found.' description='Create your first workout here!' />
          </CardContent>
        </Card>
      ) : (
        <div className='flex flex-col gap-4'>
          {workouts.map((workout) => {
            const completionCount = stats.data?.completionsByWorkout[workout._id as string] ?? 0
            const lastCompleted = stats.data?.lastCompletedByWorkout[workout._id as string]
            const totalWeightProgress = workout.exercises.reduce(
              (sum, ex) => sum + (ex.weight - ex.startingWeight),
              0,
            )
            const isExpanded = expandedIds.has(workout._id)

            return (
              <Card key={workout._id}>
                <CardHeader className='cursor-pointer' onClick={() => toggleExpand(workout._id)}>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      <div className='rounded-lg bg-primary/10 p-2'>
                        <Dumbbell className='size-5 text-primary' />
                      </div>
                      <div>
                        <h3 className='text-lg font-semibold'>{workout.title}</h3>
                        <p className='text-xs text-muted-foreground'>
                          {workout.exercises.length} exercises &middot; {workout.weightUnit}
                        </p>
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      <div className='flex items-center gap-1 sm:gap-2' onClick={(e) => e.stopPropagation()}>
                        <EditWorkoutForm
                          workoutId={workout._id}
                          initialData={{
                            title: workout.title,
                            selectedDays: workout.selectedDays,
                            weightUnit: workout.weightUnit,
                            exercises: workout.exercises,
                          }}
                        />
                        <DeleteWorkoutDialog workoutId={workout._id} />
                      </div>
                      <ChevronDown
                        className={`size-4 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    </div>
                  </div>
                </CardHeader>

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
                          <li
                            key={exercise.exerciseTitle}
                            className='flex items-center justify-between rounded-lg border border-border/50 px-2.5 py-2 sm:px-3 sm:py-2.5'
                          >
                            <h4 className='text-sm font-medium truncate min-w-0'>{exercise.exerciseTitle}</h4>
                            <div className='flex items-center gap-2 text-sm shrink-0'>
                              <span className='rounded-md bg-primary/10 px-2 py-0.5 font-semibold text-primary'>
                                {exercise.weight} {workout.weightUnit}
                              </span>
                              <span className='hidden sm:inline text-muted-foreground'>
                                {exercise.minReps}-{exercise.maxReps} reps
                              </span>
                            </div>
                          </li>
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
    </div>
  )
}
