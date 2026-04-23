import { useSuspenseQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { convexQuery } from '@convex-dev/react-query'
import { api } from 'convex/_generated/api'
import { CreateWorkoutForm } from '~/components/CreateWorkoutForm'
import EmptyUI from '~/components/EmptyUI'
import PageTitle from '~/components/PageTitle'
import { Card, CardContent } from '~/components/ui/card'
import WorkoutCard from '~/components/WorkoutCard/WorkoutCard'
import { buildWorkoutCardModels } from '~/lib/workout-card-models'

export default function WorkoutsPage() {
  const { data: workouts } = useSuspenseQuery(convexQuery(api.workouts.listWorkouts, {}))
  const { data: stats } = useSuspenseQuery(convexQuery(api.workoutCompletions.getWorkoutStats, {}))
  const [expandedIds, setExpandedIds] = useState<Set<WorkoutId>>(new Set())
  const workoutCards = buildWorkoutCardModels(workouts, stats)

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
          {workoutCards.map((model) => {
            const workoutId = model.workout._id
            const isExpanded = expandedIds.has(workoutId)

            return (
              <WorkoutCard
                key={workoutId}
                variant='manage'
                model={model}
                isExpanded={isExpanded}
                onToggleExpand={() => toggleExpand(workoutId)}
              />
            )
          })}
        </div>
      )}
    </>
  )
}
