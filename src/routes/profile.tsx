import { convexQuery } from '@convex-dev/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { api } from 'convex/_generated/api'
import ProfilePage from '~/views/ProfilePage'

export const Route = createFileRoute('/profile')({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(convexQuery(api.auth.getCurrentUser, {}))
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <ProfilePage />
}
