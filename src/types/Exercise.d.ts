type Exercise = {
  id: string
  exerciseTitle: string
  startingWeight: number
  weight: number
  minReps: number
  maxReps: number
  sets: number
}

type ExerciseListItemProps = {
  title: string
  weight: number
  weightUnit: string
  sets: number
  minReps: number
  maxReps: number
}

type AddedExerciseProps = {
  exercise: Exercise
  removeExercise: (id: string) => void
  weightUnit: string
}

type AddedExerciseListProps = {
  exercises: Exercise[]
  removeExercise: (id: string) => void
  weightUnit: string
}

type EditWorkoutFormProps = {
  workoutId: WorkoutId
  initialData: WorkoutData
}

type FeedbackOption = 'too-easy' | 'just-right' | 'too-hard' | null

type ExerciseResult = {
  id: string
  exerciseTitle: string
  feedback: FeedbackOption
}

type TrackWorkoutFormProps = {
  workout: {
    _id: WorkoutId
    title: string
    weightUnit: string
    exercises: Exercise[]
  }
}

type MiniMetricData = {
  title: string
  value: number
}
