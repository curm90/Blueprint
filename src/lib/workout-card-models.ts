function getWorkoutMetricData(workout: WorkoutWithId, completionCount: number): WorkoutMetrics[] {
  return [
    {
      title: 'Total Sets',
      value: workout.exercises.reduce((sum, exercise) => sum + (exercise.sets ?? 0), 0),
    },
    {
      title: 'Times Done',
      value: completionCount,
    },
    {
      title: 'Progress',
      value: workout.exercises.reduce(
        (sum, exercise) => sum + (exercise.weight - exercise.startingWeight),
        0,
      ),
    },
  ]
}

export function buildWorkoutCardModel(
  workout: WorkoutWithId,
  stats?: StatsData,
  completedWorkoutIds: Set<WorkoutId> = new Set(),
): WorkoutCardModel {
  const workoutId = workout._id as string
  const completionCount = stats?.completionsByWorkout[workoutId] ?? 0
  const lastCompleted = stats?.lastCompletedByWorkout[workoutId] ?? null
  const totalWeightProgress = workout.exercises.reduce(
    (sum, exercise) => sum + (exercise.weight - exercise.startingWeight),
    0,
  )

  return {
    workout,
    isCompleted: completedWorkoutIds.has(workout._id),
    completionCount,
    lastCompleted,
    totalWeightProgress,
    workoutMetricData: getWorkoutMetricData(workout, completionCount),
  }
}

export function buildWorkoutCardModels(
  workouts: WorkoutWithId[],
  stats?: StatsData,
  completedWorkoutIds: Set<WorkoutId> = new Set(),
): WorkoutCardModel[] {
  return workouts.map((workout) => buildWorkoutCardModel(workout, stats, completedWorkoutIds))
}
