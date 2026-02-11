import { createFileRoute, useRouter } from '@tanstack/react-router'
import Home from '@/components/Home'
import { getExercisesServer } from '@/utils/exercises.server'

export const Route = createFileRoute('/')({
  component: App,
  loader: () => getExercisesServer(),
})

function App() {
  const exercises = Route.useLoaderData()
  const router = useRouter()

  const refreshExercises = () => {
    router.invalidate() // This re-runs the loader
  }

  return <Home exercises={exercises} onRefresh={refreshExercises} />
}
