import AddedExercise from './AddedExercise'

export default function AddedExerciseList({
  exercises,
  removeExercise,
  weightUnit,
}: AddedExerciseListProps) {
  return (
    <div className='space-y-2 max-h-48 overflow-y-auto'>
      {exercises.map((exercise, index) => (
        <AddedExercise
          key={index}
          exercise={exercise}
          index={index}
          removeExercise={removeExercise}
          weightUnit={weightUnit}
        />
      ))}
    </div>
  )
}
