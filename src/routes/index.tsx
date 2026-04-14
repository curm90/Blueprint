import { convexQuery } from '@convex-dev/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { api } from 'convex/_generated/api'
import Homepage from '~/views/Homepage'

export const Route = createFileRoute('/')({
  component: Home,
  loader: async ({ context }) => {
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)

    await Promise.all([
      context.queryClient.ensureQueryData(convexQuery(api.workouts.listWorkouts, {})),
      context.queryClient.ensureQueryData(convexQuery(api.workoutCompletions.getWorkoutStats, {})),
      context.queryClient.ensureQueryData(
        convexQuery(api.workoutCompletions.getTodaysCompletions, {
          startOfDay: startOfDay.getTime(),
        }),
      ),
    ])
  },
})

function Home() {
  return (
    <main className='p-4 pb-24 sm:p-8 sm:pb-8 flex flex-col gap-16 min-h-[calc(100vh-66px)] max-w-250 mx-auto'>
      <Homepage />
    </main>
  )
}
