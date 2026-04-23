import { convexQuery } from '@convex-dev/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { api } from 'convex/_generated/api'
import WorkoutsPage from '~/views/WorkoutsPage'

export const Route = createFileRoute('/workouts')({
  component: RouteComponent,
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(convexQuery(api.workouts.listWorkouts, {})),
      context.queryClient.ensureQueryData(convexQuery(api.workoutCompletions.getWorkoutStats, {})),
    ])
  },
})

function RouteComponent() {
  return <WorkoutsPage />
}
