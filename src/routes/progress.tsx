import { convexQuery } from '@convex-dev/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { api } from 'convex/_generated/api'
import ProgressPage from '~/views/ProgressPage'

export const Route = createFileRoute('/progress')({
  component: RouteComponent,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(convexQuery(api.exercises.listExerciseProgress, {}))
  },
})

function RouteComponent() {
  return <ProgressPage />
}
