import WorkoutCard from './WorkoutCard/WorkoutCard'

export default function WorkoutCardList({
  todaysWorkouts,
  completedWorkoutIds,
  stats,
}: WorkoutCardListProps) {
  return (
    <div className='flex flex-col gap-4'>
      {todaysWorkouts.map((workout) => {
        const isCompleted = completedWorkoutIds.has(workout._id)
        const lastCompleted = stats?.lastCompletedByWorkout[workout._id]

        const workoutMetricData = [
          {
            title: 'Total Sets',
            value: workout.exercises.reduce((sum, ex) => sum + (ex.sets ?? 0), 0),
          },
          {
            title: 'Times Done',
            value: stats?.completionsByWorkout[workout._id] ?? 0,
          },
          {
            title: 'Progress',
            value: workout.exercises.reduce((sum, ex) => sum + (ex.weight - ex.startingWeight), 0),
          },
        ]

        return (
          <WorkoutCard
            key={workout._id}
            workout={workout}
            isCompleted={isCompleted}
            lastCompleted={lastCompleted}
            workoutMetricData={workoutMetricData}
          />
        )
      })}
    </div>
  )
}
