type WorkoutData = {
  title: string
  selectedDays: string[]
  weightUnit: string
  exercises: Exercise[]
}

type WorkoutWithId = WorkoutData & { _id: workoutId }

type WorkoutCardProps = {
  workout: WorkoutWithId
  isCompleted: boolean
  lastCompleted: number | null
  miniMetricData: MiniMetricData[]
}

type WorkoutCardListProps = {
  todaysWorkouts: WorkoutWithId[]
  completedWorkoutIds: Set<workoutId>
  stats: {
    completionsByWorkout: Record<string, number>
    lastCompletedByWorkout: Record<string, number>
  }
}

type WorkoutFormProps = {
  mode: 'create' | 'edit'
  workoutId?: workoutId
  initialData?: WorkoutData
  children: React.ReactNode
}
