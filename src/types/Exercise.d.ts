type Exercise = {
  exerciseTitle: string
  weight: number
  minReps: number
  maxReps: number
}

type AddedExerciseProps = {
  exercise: Exercise
  index: number
  removeExercise: (index: number) => void
  weightUnit: string
}

type AddedExerciseListProps = {
  exercises: Exercise[]
  removeExercise: (index: number) => void
  weightUnit: string
}
