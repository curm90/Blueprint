type StatsCardProps = {
  label: string
  value: string | number
  suffix: string
  icon: React.ReactNode
  color: string
  bg: string
}

type StatsData = {
  totalCompletions: number
  completionsByWorkout: Record<string, number>
  lastCompletedByWorkout: Record<string, number>
  streak: number
  thisWeekCompletions: number
}

type StatsCardsListProps = {
  stats: StatsData
  todaysWorkouts?: WorkoutWithId[]
  completedWorkoutIds: Set<WorkoutId>
}
