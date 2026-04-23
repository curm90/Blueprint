type WorkoutCardHeaderBase = {
  title: string
  exerciseCount: number
  weightUnit: string
}

type TrackVariant = WorkoutCardHeaderBase & {
  variant: 'track'
  isCompleted: boolean
}

type ManageVariant = WorkoutCardHeaderBase & {
  variant: 'manage'
  workoutId: WorkoutId
  isExpanded: boolean
  selectedDays: string[]
  exercises: Exercise[]
  onToggleExpand: () => void
}

type WorkoutCardHeaderProps = TrackVariant | ManageVariant

type WorkoutCardHeaderOptions = {
  workoutId: WorkoutId
  title: string
  weightUnit: string
  isExpanded: boolean
  selectedDays: string[]
  exercises: Exercise[]
}

type WorkoutCardFooterProps = {
  lastCompleted: number | null
  completionCount: number
  totalWeightProgress: number
  weightUnit: string
}
