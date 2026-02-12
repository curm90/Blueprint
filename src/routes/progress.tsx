import { createFileRoute } from '@tanstack/react-router'
import ProgressList from '@/components/ProgressList'
import { useExercisesWithProgress } from '@/hooks/exercises.query'
import { ProgressLoadingSkeleton } from '@/components/ui/skeleton'

export const Route = createFileRoute('/progress')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: exercises, isLoading, error } = useExercisesWithProgress()

  if (isLoading) {
    return <ProgressLoadingSkeleton />
  }

  if (error) {
    throw error
  }

  return <ProgressList exercises={exercises} />
}
