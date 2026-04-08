type Exercise = {
  exerciseTitle: string
  weight: number
  minReps: number
  maxReps: number
}

type WorkoutData = {
  title: string
  selectedDays: string[]
  weightUnit: string
  exercises: Exercise[]
}

type WorkoutFormProps = {
  mode: 'create' | 'edit'
  workoutId?: Id<'workouts'>
  initialData?: WorkoutData
  children: React.ReactNode
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

type EditWorkoutFormProps = {
  workoutId: Id<'workouts'>
  initialData: WorkoutData
}
