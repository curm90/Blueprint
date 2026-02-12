import { createFileRoute } from '@tanstack/react-router'
import ProgressList from '@/components/ProgressList'
import { getExercisesServer } from '@/utils/exercises.server'

export const Route = createFileRoute('/progress')({
  component: RouteComponent,
  loader: async () => getExercisesServer(),
})

function RouteComponent() {
  const exercises = Route.useLoaderData() ?? []

  return <ProgressList exercises={exercises} />
}
