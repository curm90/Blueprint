import { createFileRoute } from '@tanstack/react-router'
import ProgressList from '@/components/ProgressList'

export const Route = createFileRoute('/progress')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ProgressList />
}
