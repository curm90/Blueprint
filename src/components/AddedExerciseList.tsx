import AddedExercise from './AddedExercise'

export default function AddedExerciseList({
  exercises,
  removeExercise,
  weightUnit,
}: AddedExerciseListProps) {
  return (
    <div className='space-y-2 max-h-48 overflow-y-auto'>
      {exercises.map((exercise) => (
        <AddedExercise
          key={exercise.id}
          exercise={exercise}
          removeExercise={removeExercise}
          weightUnit={weightUnit}
        />
      ))}
    </div>
  )
}
