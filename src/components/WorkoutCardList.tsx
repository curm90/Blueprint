import WorkoutCard from './WorkoutCard'

export default function WorkoutCardList({
  todaysWorkouts,
  completedWorkoutIds,
  stats,
}: WorkoutCardListProps) {
  return (
    <div className='flex flex-col gap-4'>
      {todaysWorkouts.map((workout) => {
        const isCompleted = completedWorkoutIds.has(workout._id)
        const lastCompleted = stats?.lastCompletedByWorkout[workout._id as string]

        const miniMetricData = [
          {
            title: 'Total Sets',
            value: workout.exercises.reduce((sum, ex) => sum + (ex.sets ?? 0), 0),
          },
          {
            title: 'Times Done',
            value: stats?.completionsByWorkout[workout._id as string] ?? 0,
          },
          {
            title: 'Progress',
            value: workout.exercises.reduce((sum, ex) => sum + (ex.weight - ex.startingWeight), 0),
          },
        ]

        return (
          <WorkoutCard
            workout={workout}
            isCompleted={isCompleted}
            lastCompleted={lastCompleted}
            miniMetricData={miniMetricData}
          />
        )
      })}
    </div>
  )
}
