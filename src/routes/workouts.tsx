import { createFileRoute } from '@tanstack/react-router'
import { CreateWorkoutForm } from '~/components/CreateWorkoutForm'

export const Route = createFileRoute('/workouts')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className='p-8 flex flex-col gap-16 min-h-[calc(100vh-66px)] max-w-250 mx-auto'>
      <CreateWorkoutForm />
    </div>
  )
}
