import WorkoutsTab from './WorkoutsTab'
import { useWorkouts } from '@/hooks/workouts.query'

export default function Home() {
  const { data: workouts, isLoading: workoutsLoading } = useWorkouts()

  if (workoutsLoading) {
    return (
      <div className="mx-auto my-10 max-w-6xl px-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">Loading workouts...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto my-10 max-w-6xl px-6">
      <div className="flex flex-col gap-8">
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Your Fitness Dashboard
          </h1>
          <p className="text-muted-foreground">
            Track exercises and manage workout routines
          </p>
        </div>

        {/* Workouts Section */}
        <WorkoutsTab workouts={workouts || []} />
      </div>
    </div>
  )
}
