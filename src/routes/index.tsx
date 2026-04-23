import { convexQuery } from '@convex-dev/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { api } from 'convex/_generated/api'
import HomePage from '~/views/Homepage'

export const Route = createFileRoute('/')({
  component: Home,
  loader: async ({ context }) => {
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)

    await Promise.all([
      context.queryClient.ensureQueryData(convexQuery(api.workouts.listWorkouts, {})),
      context.queryClient.ensureQueryData(convexQuery(api.workoutCompletions.getWorkoutStats, {})),
      context.queryClient.ensureQueryData(
        convexQuery(api.workoutCompletions.getTodaysCompletions, {
          startOfDay: startOfDay.getTime(),
        }),
      ),
    ])
  },
})

function Home() {
  return <HomePage />
}
