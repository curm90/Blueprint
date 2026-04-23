type StatsCardProps = {
  label: string
  value: string | number
  suffix: string
  icon: React.ReactNode
  color: string
  bg: string
}

type WorkoutCountById = Record<string, number>
type WorkoutLastCompletedById = Record<string, number>

type StatsData = {
  totalCompletions: number
  completionsByWorkout: WorkoutCountById
  lastCompletedByWorkout: WorkoutLastCompletedById
  streak: number
  thisWeekCompletions: number
}

type StatsCardsListProps = {
  stats: StatsData
  todaysWorkouts?: WorkoutWithId[]
  completedWorkoutIds: Set<WorkoutId>
}
