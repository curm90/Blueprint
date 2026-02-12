import { createFileRoute } from '@tanstack/react-router'
import ProgressList from '@/components/ProgressList'
import { getExercisesWithProgressServer } from '@/utils/exercises.server'

export const Route = createFileRoute('/progress')({
  component: RouteComponent,
  loader: async () => getExercisesWithProgressServer(),
})

function RouteComponent() {
  const exercises = Route.useLoaderData()

  return <ProgressList exercises={exercises} />
}
