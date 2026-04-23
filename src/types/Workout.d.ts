type WorkoutId = import('../../convex/_generated/dataModel').Id<'workouts'>

type WorkoutData = {
  title: string
  selectedDays: string[]
  weightUnit: string
  exercises: Exercise[]
}

type WorkoutWithId = WorkoutData & { _id: WorkoutId }

type TrackedWorkout = {
  workout: WorkoutWithId
}

type WorkoutCardVariant = 'track' | 'manage'

type WorkoutCardProps = {
  workout: WorkoutWithId
  isCompleted: boolean
  lastCompleted: number | null
  workoutMetricData: WorkoutMetrics[]
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

type TrackWorkoutOptionBtnProps = {
  id: Exclude<FeedbackOption, null>
  title: string
  onSelect: (option: Exclude<FeedbackOption, null>) => void
  isSelected: boolean
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  buttonClassName: string
  iconColor: string
  description: string
}

type TrackWorkoutOption = {
  id: Exclude<FeedbackOption, null>
  title: string
  description: string
  buttonClassName: string
  iconColor: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}
