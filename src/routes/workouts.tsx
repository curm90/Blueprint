import { createFileRoute } from '@tanstack/react-router'
import { CreateWorkoutForm } from '~/components/CreateWorkoutForm'

export const Route = createFileRoute('/workouts')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <CreateWorkoutForm />
    </div>
  )
}
