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

type ManageOptionsProps = {
  workoutId: WorkoutId
  title: string
  weightUnit: string
  isExpanded: boolean
  selectedDays: string[]
  exercises: Exercise[]
}
