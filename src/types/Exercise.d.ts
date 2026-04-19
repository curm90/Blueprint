type workoutId = import('../../convex/_generated/dataModel').Id<'workouts'>

type Exercise = {
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
  workoutId: workoutId
  initialData: WorkoutData
}

type FeedbackOption = 'too-easy' | 'just-right' | 'too-hard' | null

type ExerciseResult = {
  exerciseTitle: string
  feedback: FeedbackOption
}

type TrackWorkoutFormProps = {
  workout: {
    _id: workoutId
    title: string
    weightUnit: string
    exercises: Exercise[]
  }
}

type MiniMetricData = {
  title: string
  value: number
}
