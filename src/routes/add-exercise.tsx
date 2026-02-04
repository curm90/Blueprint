import { createFileRoute } from '@tanstack/react-router'
import AddExerciseForm from '@/components/AddExerciseForm'

export const Route = createFileRoute('/add-exercise')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AddExerciseForm />
}
