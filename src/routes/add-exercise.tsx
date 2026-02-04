import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/add-exercise')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/add-exercise"!</div>
}
