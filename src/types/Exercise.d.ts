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
  workoutId?: import('../../convex/_generated/dataModel').Id<'workouts'>
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
  workoutId: import('../../convex/_generated/dataModel').Id<'workouts'>
  initialData: WorkoutData
}

type FeedbackOption = 'too-easy' | 'just-right' | 'too-hard' | null

type ExerciseResult = {
  exerciseTitle: string
  feedback: FeedbackOption
  weightAdjustment: number
}

type TrackWorkoutFormProps = {
  workout: {
    title: string
    weightUnit: string
    exercises: Exercise[]
  }
}
