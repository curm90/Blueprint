import { useSuspenseQuery } from '@tanstack/react-query'
import { Folder } from 'lucide-react'
import { convexQuery } from '@convex-dev/react-query'
import { api } from 'convex/_generated/api'
import { Card, CardContent } from '~/components/ui/card'
import EmptyUI from '~/components/EmptyUI'
import PageTitle from '~/components/PageTitle'
import StatsCardsList from '~/components/StatsCardsList'
import WorkoutCardList from '~/components/WorkoutCard/WorkoutCardList'
import RestDayCard from '~/components/RestDayCard'
import { buildWorkoutCardModels } from '~/lib/workout-card-models'

export default function Homepage() {
  const { data: allWorkouts } = useSuspenseQuery(convexQuery(api.workouts.listWorkouts, {}))
  const { data: stats } = useSuspenseQuery(convexQuery(api.workoutCompletions.getWorkoutStats, {}))

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
  const todaysWorkouts = allWorkouts?.filter((w) => w.selectedDays.includes(today))

  const startOfDay = new Date()
  startOfDay.setHours(0, 0, 0, 0)
  const { data: todaysCompletions } = useSuspenseQuery(
    convexQuery(api.workoutCompletions.getTodaysCompletions, {
      startOfDay: startOfDay.getTime(),
    }),
  )

  const completedWorkoutIds = new Set(todaysCompletions?.map((c) => c.workoutId) ?? [])
  const workoutCards = buildWorkoutCardModels(todaysWorkouts ?? [], stats, completedWorkoutIds)

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
      {todaysWorkouts && todaysWorkouts.length > 0 ? (
        <WorkoutCardList workoutCards={workoutCards} />
      ) : allWorkouts && allWorkouts.length === 0 ? (
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
        <RestDayCard />
      )}
    </div>
  )
}
