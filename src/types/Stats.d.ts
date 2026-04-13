type StatsCardProps = {
  label: string
  value: string | number
  suffix: string
  icon: React.ReactNode
  color: string
  bg: string
}

type StatsCardsListProps = {
  stats: {
    isLoading: boolean
    data:
      | {
          totalCompletions: number
          completionsByWorkout: Record<string, number>
          lastCompletedByWorkout: Record<string, number>
          streak: number
          thisWeekCompletions: number
        }
      | undefined
  }
  todaysWorkouts?: Workout[]
  completedWorkoutIds: Set<string>
}
