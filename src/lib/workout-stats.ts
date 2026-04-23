export function getWorkoutCompletionCount(
  stats: StatsData | undefined,
  workoutId: WorkoutId,
): number {
  return stats?.completionsByWorkout[workoutId] ?? 0
}

export function getWorkoutLastCompleted(
  stats: StatsData | undefined,
  workoutId: WorkoutId,
): number | null {
  return stats?.lastCompletedByWorkout[workoutId] ?? null
}
