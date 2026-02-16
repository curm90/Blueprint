import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle, Target } from 'lucide-react'
import ExerciseLog from './ExerciseLog'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import type { WorkoutWithExercises } from '@/db/schema'
import {
  useCompleteWorkoutSession,
  useStartWorkoutSession,
} from '@/hooks/workouts.query'

interface WorkoutLogProps {
  workout: WorkoutWithExercises
  open: boolean
  onOpenChange: (open: boolean) => void
  onWorkoutComplete?: () => void
}

export default function WorkoutLog({
  workout,
  open,
  onOpenChange,
  onWorkoutComplete,
}: WorkoutLogProps) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [completedExercises, setCompletedExercises] = useState<number[]>([])
  const [isWorkoutComplete, setIsWorkoutComplete] = useState(false)
  const [workoutLogId, setWorkoutLogId] = useState<number | null>(null)

  const startWorkoutSessionMutation = useStartWorkoutSession()
  const completeWorkoutSessionMutation = useCompleteWorkoutSession()

  const exercises = workout.workoutExercises
  const currentExercise = exercises[currentExerciseIndex]
  const isLastExercise = currentExerciseIndex === exercises.length - 1
  const allExercisesCompleted = completedExercises.length === exercises.length

  // Start workout session when modal opens
  useEffect(() => {
    if (open && !workoutLogId) {
      console.log('🟡 Starting workout session for workout:', workout.id)
      startWorkoutSessionMutation
        .mutateAsync({
          workoutId: workout.id,
          notes: `Started ${workout.name} session`,
        })
        .then((result) => {
          console.log('🟢 Workout session started successfully:', result)
          setWorkoutLogId(result.id)
        })
        .catch((error) => {
          console.error('🔴 Failed to start workout session:', error)
        })
    }
  }, [open, workoutLogId, workout.id, workout.name])

  // Reset state when modal opens/closes
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset state when closing
      setCurrentExerciseIndex(0)
      setCompletedExercises([])
      setIsWorkoutComplete(false)
      setWorkoutLogId(null)
    }
    onOpenChange(newOpen)
  }

  const handleExerciseComplete = (exerciseId: number) => {
    if (!completedExercises.includes(exerciseId)) {
      const newCompletedExercises = [...completedExercises, exerciseId]
      setCompletedExercises(newCompletedExercises)

      // Check if all exercises are completed
      if (newCompletedExercises.length === exercises.length) {
        setIsWorkoutComplete(true)
      } else if (!isLastExercise) {
        // Move to next exercise automatically if not the last one
        setCurrentExerciseIndex((prev) => prev + 1)
      }
    }
  }

  const handleCompleteWorkout = async () => {
    try {
      if (workoutLogId) {
        await completeWorkoutSessionMutation.mutateAsync({
          workoutLogId,
          notes: `Completed workout: ${workout.name}`,
        })
      }
      onWorkoutComplete?.()
      handleOpenChange(false)
    } catch (error) {
      console.error('Failed to complete workout:', error)
    }
  }

  const goToPreviousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex((prev) => prev - 1)
    }
  }

  const goToNextExercise = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex((prev) => prev + 1)
    }
  }

  if (isWorkoutComplete) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
              Workout Complete!
            </DialogTitle>
            <DialogDescription>
              Great job finishing your workout: {workout.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-medium mb-2">Completed Exercises:</h4>
              <div className="space-y-1">
                {exercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    className="flex items-center gap-2 text-sm"
                  >
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>{exercise.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleCompleteWorkout}
                className="flex-1"
                disabled={completeWorkoutSessionMutation.isPending}
              >
                {completeWorkoutSessionMutation.isPending
                  ? 'Saving...'
                  : 'Save Workout'}
              </Button>
              <Button variant="outline" onClick={() => handleOpenChange(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            {workout.name}
          </DialogTitle>
          <DialogDescription>
            Workout for {workout.selectedDays.split(',').join(', ')}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="space-y-2 shrink-0">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              Exercise {currentExerciseIndex + 1} of {exercises.length}
            </span>
            <span className="text-muted-foreground">
              {completedExercises.length} completed
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(completedExercises.length / exercises.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Exercise Navigation */}
        <div className="overflow-x-auto py-2 shrink-0">
          <div className="flex items-center gap-2 min-w-max">
            {exercises.map((exercise, index) => (
              <button
                key={exercise.id}
                onClick={() => setCurrentExerciseIndex(index)}
                className={`
                  shrink-0 min-w-24 text-xs p-2 rounded-md border transition-all
                  ${
                    index === currentExerciseIndex
                      ? 'border-primary bg-primary/10 text-primary'
                      : completedExercises.includes(exercise.id)
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-border bg-muted/30 text-muted-foreground hover:border-primary/50'
                  }
                `}
              >
                {completedExercises.includes(exercise.id) && (
                  <CheckCircle className="h-3 w-3 mx-auto mb-1" />
                )}
                <div className="text-center truncate">{exercise.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Current Exercise Log - Scrollable */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="border border-border/50 rounded-lg p-3 bg-muted/20">
            <ExerciseLog
              exercise={currentExercise}
              open={true}
              onOpenChange={() => {}} // Don't allow closing individual exercise log
              onProgressionApplied={(exerciseId) =>
                handleExerciseComplete(exerciseId)
              }
              asInline={true}
              workoutLogId={workoutLogId}
            />
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-3 border-t shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousExercise}
            disabled={currentExerciseIndex === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex gap-2">
            {!isLastExercise ? (
              <Button
                size="sm"
                onClick={goToNextExercise}
                disabled={currentExerciseIndex >= exercises.length - 1}
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : allExercisesCompleted ? (
              <Button size="sm" onClick={() => setIsWorkoutComplete(true)}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Finish Workout
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled>
                Complete all exercises to finish
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
