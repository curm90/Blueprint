import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import type { WorkoutWithExercises } from '@/db/schema'
import { useAppForm } from '@/hooks/demo.form'
import { useUpdateWorkout } from '@/hooks/workouts.query'
import { useExercises } from '@/hooks/exercises.query'
import { workoutFormSchema } from '@/db/schema'

// Use the schema from the database file
const schema = workoutFormSchema

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

interface EditWorkoutFormProps {
  workout: WorkoutWithExercises
  onSave?: () => void
  asModal?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function EditWorkoutForm({
  workout,
  onSave,
  asModal = false,
  open = false,
  onOpenChange,
}: EditWorkoutFormProps) {
  const updateWorkoutMutation = useUpdateWorkout()
  const { data: exercises } = useExercises()
  const [selectedExercises, setSelectedExercises] = useState<number[]>(
    workout.workoutExercises.map((we) => we.exerciseId),
  )
  const [selectedDays, setSelectedDays] = useState<string[]>(
    workout.selectedDays.split(','),
  )

  const form = useAppForm({
    defaultValues: {
      name: workout.name,
      selectedDays: workout.selectedDays.split(','),
      exerciseIds: workout.workoutExercises.map((we) => we.exerciseId),
    },
    validators: {
      onChange: schema,
    },
    onSubmit: async ({ value }) => {
      // Prepare workout updates
      const workoutUpdates = {
        name: value.name,
        selectedDays: selectedDays,
        exerciseIds: selectedExercises,
      }

      console.log('Updating workout with data:', workoutUpdates)

      try {
        await updateWorkoutMutation.mutateAsync({
          id: workout.id,
          updates: workoutUpdates,
        })
        console.log('Workout updated successfully!')
      } catch (error) {
        console.error('Error updating workout:', error)
        return // Don't close form if there's an error
      }

      // Call onSave callback and close modal if used as modal
      onSave?.()
      if (asModal) {
        onOpenChange?.(false)
      }
    },
  })

  const toggleExercise = (exerciseId: number) => {
    setSelectedExercises((prev) => {
      const isSelected = prev.includes(exerciseId)
      const newSelection = isSelected
        ? prev.filter((id) => id !== exerciseId)
        : [...prev, exerciseId]

      // Update form field to sync with validation
      form.setFieldValue('exerciseIds', newSelection)
      return newSelection
    })
  }

  const toggleDay = (day: string) => {
    setSelectedDays((prev) => {
      const isSelected = prev.includes(day)
      const newSelection = isSelected
        ? prev.filter((d) => d !== day)
        : [...prev, day]

      // Update form field to sync with validation
      form.setFieldValue('selectedDays', newSelection)
      return newSelection
    })
  }

  const FormContent = () => (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className={
        asModal
          ? 'flex flex-col gap-4'
          : 'border rounded-md p-12 flex flex-col gap-4'
      }
    >
      {!asModal && <h1 className="text-2xl font-bold mb-4">Edit Workout</h1>}

      <form.AppField
        name="name"
        children={(field) => (
          <field.TextField
            label="Workout Name"
            placeholder="e.g., Upper Body, Leg Day"
          />
        )}
      />

      {/* Days Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">
          Select Days
        </label>

        <div className="grid grid-cols-7 gap-2">
          {DAYS_OF_WEEK.map((day) => (
            <label
              key={day.short}
              className={`
                flex flex-col items-center p-3 rounded-md border cursor-pointer transition-colors
                ${
                  selectedDays.includes(day.short)
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }
              `}
            >
              <input
                type="checkbox"
                checked={selectedDays.includes(day.short)}
                onChange={() => toggleDay(day.short)}
                className="sr-only"
              />
              <div className="font-medium text-sm">{day.short}</div>
              <div className="text-xs opacity-75">{day.full.slice(0, 3)}</div>
            </label>
          ))}
        </div>

        {selectedDays.length > 0 && (
          <div className="text-sm text-muted-foreground">
            {selectedDays.length} day{selectedDays.length !== 1 ? 's' : ''}{' '}
            selected
          </div>
        )}
      </div>

      {/* Exercise Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">
          Select Exercises
        </label>

        {!exercises || exercises.length === 0 ? (
          <div className="text-sm text-muted-foreground p-4 border border-border/30 rounded-md text-center">
            No exercises available. Create some exercises first.
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto border border-border/30 rounded-md p-3">
            {exercises.map((exercise) => (
              <label
                key={exercise.id}
                className="flex items-start gap-3 p-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <div className="shrink-0 pt-0.5">
                  <input
                    type="checkbox"
                    checked={selectedExercises.includes(exercise.id)}
                    onChange={() => toggleExercise(exercise.id)}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
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
              </label>
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

      <div className={`flex justify-end ${asModal ? '' : 'mt-4'}`}>
        <form.AppForm>
          <form.SubscribeButton
            label={
              updateWorkoutMutation.isPending ? 'Updating...' : 'Update Workout'
            }
          />
        </form.AppForm>
      </div>
    </form>
  )

  if (asModal) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Workout</DialogTitle>
            <DialogDescription>
              Update your workout details and exercises.
            </DialogDescription>
          </DialogHeader>
          <FormContent />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <div className="mx-auto mt-12 max-w-125">
      <FormContent />
    </div>
  )
}
