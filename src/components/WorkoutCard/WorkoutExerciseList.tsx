import WorkoutExerciseListItem from './WorkoutExerciseListItem'

type WorkoutExerciseListProps = {
  workout: WorkoutData
}

export default function WorkoutExerciseList({ workout }: WorkoutExerciseListProps) {
  return (
    <ul className='flex flex-col gap-2'>
      {workout.exercises.map((exercise) => (
        <WorkoutExerciseListItem
          key={exercise.id}
          title={exercise.exerciseTitle}
          weight={exercise.weight}
          weightUnit={workout.weightUnit}
          sets={exercise.sets}
          minReps={exercise.minReps}
          maxReps={exercise.maxReps}
        />
      ))}
    </ul>
  )
}
