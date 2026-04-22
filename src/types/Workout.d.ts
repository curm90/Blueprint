type WorkoutId = import('../../convex/_generated/dataModel').Id<'workouts'>

type WorkoutData = {
  title: string
  selectedDays: string[]
  weightUnit: string
  exercises: Exercise[]
}

type TrackedWorkout = {
  workout: {
    _id: WorkoutId
    title: string
    weightUnit: string
    exercises: Exercise[]
  }
}

type WorkoutWithId = WorkoutData & { _id: WorkoutId }

type WorkoutCardProps = {
  workout: WorkoutWithId
  isCompleted: boolean
  lastCompleted: number | null
  miniMetricData: MiniMetricData[]
}

type WorkoutCardListProps = {
  todaysWorkouts: WorkoutWithId[]
  completedWorkoutIds: Set<WorkoutId>
  stats: {
    completionsByWorkout: Record<WorkoutId, number>
    lastCompletedByWorkout: Record<WorkoutId, number>
  }
}

type WorkoutFormProps = {
  mode: 'create' | 'edit'
  workoutId?: WorkoutId
  initialData?: WorkoutData
  children: React.ReactNode
}
