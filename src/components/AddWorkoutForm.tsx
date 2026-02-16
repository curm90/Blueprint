import { useCallback, useState } from 'react'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Button } from './ui/button'
import { useAddWorkout } from '@/hooks/workouts.query'
import { useExercises } from '@/hooks/exercises.query'

// Days of the week
const DAYS_OF_WEEK = [
  { short: 'Mon', full: 'Monday' },
  { short: 'Tue', full: 'Tuesday' },
  { short: 'Wed', full: 'Wednesday' },
  { short: 'Thu', full: 'Thursday' },
  { short: 'Fri', full: 'Friday' },
  { short: 'Sat', full: 'Saturday' },
  { short: 'Sun', full: 'Sunday' },
]

// Extract FormContent as stable component OUTSIDE main component to prevent unmount/mount cycles
function FormContent({
  selectedExercises,
  selectedDays,
  toggleExercise,
  toggleDay,
  exercises,
  addWorkoutMutation,
  workoutName,
  setWorkoutName,
  onSubmit,
  asModal,
}: {
  selectedExercises: number[]
  selectedDays: string[]
  toggleExercise: (id: number) => void
  toggleDay: (day: string) => void
  exercises: any[]
  addWorkoutMutation: any
  workoutName: string
  setWorkoutName: (name: string) => void
  onSubmit: (e: React.FormEvent) => void
  asModal: boolean
}) {
  return (
    <div
      className={
        asModal
          ? 'flex flex-col gap-4 max-h-[80vh]'
          : 'border rounded-md p-12 flex flex-col gap-4'
      }
    >
      {!asModal && <h1 className="text-2xl font-bold mb-4">Add Workout</h1>}

      {/* Days Selection - OUTSIDE form */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">
          Select Days
        </label>

        <div className="grid grid-cols-7 gap-2">
          {DAYS_OF_WEEK.map((day) => (
            <button
              key={day.short}
              type="button"
              onClick={() => toggleDay(day.short)}
              className={`flex flex-col items-center p-3 rounded-md border transition-colors
                ${
                  selectedDays.includes(day.short)
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }
              `}
            >
              <div className="font-medium text-sm">{day.short}</div>
              <div className="text-xs opacity-75">{day.full.slice(0, 3)}</div>
            </button>
          ))}
        </div>

        {selectedDays.length > 0 && (
          <div className="text-sm text-muted-foreground">
            {selectedDays.length} day{selectedDays.length !== 1 ? 's' : ''}{' '}
            selected
          </div>
        )}
      </div>

      {/* Exercise Selection - OUTSIDE form */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">
          Select Exercises
        </label>

        {exercises.length === 0 ? (
          <div className="text-sm text-muted-foreground p-4 border border-border/30 rounded-md text-center">
            No exercises available.
          </div>
        ) : (
          <div className="space-y-2 border border-border/30 rounded-md p-3 max-h-64 overflow-y-auto">
            {exercises.map((exercise) => (
              <button
                key={exercise.id}
                type="button"
                onClick={() => toggleExercise(exercise.id)}
                className="flex items-start gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors w-full text-left"
              >
                <div className="shrink-0 pt-0.5">
                  <div
                    className={`h-4 w-4 rounded border-2 ${
                      selectedExercises.includes(exercise.id)
                        ? 'bg-primary border-primary'
                        : 'border-border'
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">
                    {exercise.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {exercise.currentWeight}
                    {exercise.unit} • {exercise.minReps}-{exercise.maxReps} reps
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {selectedExercises.length > 0 && (
          <div className="text-sm text-muted-foreground">
            {selectedExercises.length} exercise
            {selectedExercises.length !== 1 ? 's' : ''} selected
          </div>
        )}
      </div>

      {/* Actual form - ONLY contains form fields and submit */}
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="workout-name">Workout Name</Label>
          <Input
            id="workout-name"
            type="text"
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
            placeholder="e.g., Upper Body, Leg Day"
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={
              addWorkoutMutation.isPending ||
              !workoutName ||
              selectedDays.length === 0 ||
              selectedExercises.length === 0
            }
          >
            {addWorkoutMutation.isPending ? 'Creating...' : 'Create Workout'}
          </Button>
        </div>
      </form>
    </div>
  )
}

interface AddWorkoutFormProps {
  onSave?: () => void
  asModal?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function AddWorkoutForm({
  onSave,
  asModal = false,
  onOpenChange,
}: AddWorkoutFormProps) {
  const addWorkoutMutation = useAddWorkout()
  const { data: exercises = [] } = useExercises()

  const [workoutName, setWorkoutName] = useState('')
  const [selectedExercises, setSelectedExercises] = useState<number[]>([])
  const [selectedDays, setSelectedDays] = useState<string[]>([])

  const toggleExercise = useCallback((exerciseId: number) => {
    setSelectedExercises((prev) =>
      prev.includes(exerciseId)
        ? prev.filter((id) => id !== exerciseId)
        : [...prev, exerciseId],
    )
  }, [])

  const toggleDay = useCallback((day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    )
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !workoutName ||
      selectedDays.length === 0 ||
      selectedExercises.length === 0
    ) {
      return
    }

    try {
      await addWorkoutMutation.mutateAsync({
        name: workoutName,
        selectedDays,
        exerciseIds: selectedExercises,
      })

      setWorkoutName('')
      setSelectedExercises([])
      setSelectedDays([])

      onSave?.()
      if (asModal) {
        onOpenChange?.(false)
      }
    } catch (error) {
      console.error('Error adding workout:', error)
    }
  }

  const FormContentElement = (
    <FormContent
      selectedExercises={selectedExercises}
      selectedDays={selectedDays}
      toggleExercise={toggleExercise}
      toggleDay={toggleDay}
      exercises={exercises}
      addWorkoutMutation={addWorkoutMutation}
      workoutName={workoutName}
      setWorkoutName={setWorkoutName}
      onSubmit={handleSubmit}
      asModal={asModal}
    />
  )

  if (asModal) {
    return (
      <>
        {/* Custom modal backdrop */}
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onOpenChange?.(false)
            }
          }}
        >
          {/* Modal content */}
          <div className="bg-background rounded-lg shadow-lg max-w-lg w-full max-h-[80vh] overflow-hidden">
            {/* Modal header */}
            <div className="border-b px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Create New Workout</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add a new workout with exercises and schedule it.
                  </p>
                </div>
                <button
                  onClick={() => onOpenChange?.(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>
            </div>
            
            {/* Modal body - scrollable */}
            <div className="overflow-y-auto max-h-[calc(80vh-8rem)]">
              <div className="p-6">
                {FormContentElement}
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return <div className="mx-auto mt-12 max-w-125">{FormContentElement}</div>
}
