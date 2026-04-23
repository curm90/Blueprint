type WorkoutId = import('../../convex/_generated/dataModel').Id<'workouts'>

type WorkoutData = {
  title: string
  selectedDays: string[]
  weightUnit: string
  exercises: Exercise[]
}

type WorkoutWithId = WorkoutData & { _id: WorkoutId }

type WorkoutCardModel = {
  workout: WorkoutWithId
  isCompleted: boolean
  lastCompleted: number | null
  completionCount: number
  totalWeightProgress: number
  workoutMetricData: WorkoutMetrics[]
}

type WorkoutCardListProps = {
  workoutCards: WorkoutCardModel[]
}

type TrackWorkoutCardProps = {
  variant: 'track'
  model: WorkoutCardModel
}

type ManageWorkoutCardProps = {
  variant: 'manage'
  model: WorkoutCardModel
  isExpanded: boolean
  onToggleExpand: () => void
}

type WorkoutCardProps = TrackWorkoutCardProps | ManageWorkoutCardProps

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
