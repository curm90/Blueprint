import { createFileRoute } from '@tanstack/react-router'
import Home from '@/components/Home'
import { useExercises } from '@/hooks/exercises.query'
import { HomeLoadingSkeleton } from '@/components/ui/skeleton'

export const Route = createFileRoute('/')({
  component: App,
  // Remove loader - we'll use TanStack Query instead
})

function App() {
  const { data: exercises, isLoading, error } = useExercises()

  if (isLoading) {
    return <HomeLoadingSkeleton />
  }

  if (error) {
    throw error
  }

  return <Home exercises={exercises} />
}
