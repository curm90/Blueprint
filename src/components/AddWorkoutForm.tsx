import { useCallback, useState } from 'react'
import { MoveIcon, PlusIcon, XIcon } from 'lucide-react'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Button } from './ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import type { ExerciseTemplate, WorkoutExerciseForm } from '@/db/schema'
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

// Default exercise values
const createDefaultExercise = (): WorkoutExerciseForm => ({
  name: '',
  currentWeight: '',
  unit: 'kg',
  minReps: '8',
  maxReps: '12',
  weightIncrement: '2.5',
})

// Exercise form component
function ExerciseForm({
  exercise,
  index,
  onUpdate,
  onRemove,
  templates,
  exerciseCount,
}: {
  exercise: WorkoutExerciseForm
  index: number
  onUpdate: (index: number, exercise: WorkoutExerciseForm) => void
  onRemove: (index: number) => void
  templates: ExerciseTemplate[]
  exerciseCount: number
}) {
  const handleTemplateSelect = (templateName: string) => {
    const template = templates.find((t) => t.name === templateName)
    if (template) {
      onUpdate(index, {
        name: template.name,
        currentWeight: template.currentWeight.toString(),
        unit: template.unit as 'kg' | 'lbs',
        minReps: template.minReps.toString(),
        maxReps: template.maxReps.toString(),
        weightIncrement: template.weightIncrement.toString() || '2.5',
      })
    }
  }

  return (
    <div className="border rounded-md p-4 space-y-4 bg-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MoveIcon className="h-4 w-4 text-muted-foreground cursor-move" />
          <h4 className="text-sm font-medium">
            Exercise {exerciseCount - index}
          </h4>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onRemove(index)}
          className="text-destructive hover:text-destructive"
        >
          <XIcon className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 md:col-span-2">
          <Label>Exercise Name</Label>
          <div className="flex gap-2">
            <Input
              value={exercise.name}
              onChange={(e) =>
                onUpdate(index, { ...exercise, name: e.target.value })
              }
              placeholder="e.g., Bench Press, Squat"
              className="flex-1"
            />
            {templates.length > 0 && (
              <Select
                key={`template-${index}`}
                value=""
                onValueChange={handleTemplateSelect}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Use template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem
                      key={`${template.name}-${template.unit}`}
                      value={template.name}
                    >
                      {template.name} ({template.currentWeight}
                      {template.unit})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Current Weight</Label>
          <div className="flex gap-2">
            <Input
              value={exercise.currentWeight}
              onChange={(e) =>
                onUpdate(index, { ...exercise, currentWeight: e.target.value })
              }
              placeholder="50"
              type="number"
              className="flex-1"
            />
            <Select
              value={exercise.unit}
              onValueChange={(value) =>
                onUpdate(index, { ...exercise, unit: value as 'kg' | 'lbs' })
              }
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kg">kg</SelectItem>
                <SelectItem value="lbs">lbs</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Weight Increment</Label>
          <Input
            value={exercise.weightIncrement}
            onChange={(e) =>
              onUpdate(index, { ...exercise, weightIncrement: e.target.value })
            }
            placeholder="2.5"
            type="number"
            step="0.5"
          />
        </div>

        <div className="space-y-2">
          <Label>Min Reps</Label>
          <Input
            value={exercise.minReps}
            onChange={(e) =>
              onUpdate(index, { ...exercise, minReps: e.target.value })
            }
            placeholder="8"
            type="number"
          />
        </div>

        <div className="space-y-2">
          <Label>Max Reps</Label>
          <Input
            value={exercise.maxReps}
            onChange={(e) =>
              onUpdate(index, { ...exercise, maxReps: e.target.value })
            }
            placeholder="12"
            type="number"
          />
        </div>
      </div>
    </div>
  )
}

// Main form component
function FormContent({
  exercises,
  workoutName,
  selectedDays,
  addWorkoutMutation,
  updateExercise,
  addExercise,
  removeExercise,
  toggleDay,
  setWorkoutName,
  onSubmit,
  asModal,
  templates,
}: {
  exercises: WorkoutExerciseForm[]
  workoutName: string
  selectedDays: string[]
  addWorkoutMutation: any
  updateExercise: (index: number, exercise: WorkoutExerciseForm) => void
  addExercise: () => void
  removeExercise: (index: number) => void
  toggleDay: (day: string) => void
  setWorkoutName: (name: string) => void
  onSubmit: (e: React.FormEvent) => void
  asModal: boolean
  templates: ExerciseTemplate[]
}) {
  return (
    <div
      className={
        asModal
          ? 'flex flex-col gap-6 max-h-[80vh] overflow-y-auto'
          : 'border rounded-md p-12 flex flex-col gap-6'
      }
    >
      {!asModal && <h1 className="text-2xl font-bold mb-4">Create Workout</h1>}

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Workout Name */}
        <div className="space-y-2">
          <Label htmlFor="workout-name">Workout Name</Label>
          <Input
            id="workout-name"
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
            placeholder="e.g., Upper Body, Push Day, Full Body"
            required
          />
        </div>

        {/* Days Selection */}
        <div className="space-y-3">
          <Label>Workout Days</Label>
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

        {/* Exercises */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Exercises</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addExercise}
              className="flex items-center gap-2"
            >
              <PlusIcon className="h-4 w-4" />
              Add Exercise
            </Button>
          </div>

          {exercises.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-border rounded-lg">
              <p className="text-sm">No exercises added yet.</p>
              <p className="text-xs">Click "Add Exercise" to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {exercises.map((exercise, index) => (
                <ExerciseForm
                  key={index}
                  exercise={exercise}
                  index={index}
                  onUpdate={updateExercise}
                  onRemove={removeExercise}
                  templates={templates}
                  exerciseCount={exercises.length}
                />
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={
              addWorkoutMutation.isPending ||
              !workoutName.trim() ||
              selectedDays.length === 0 ||
              exercises.length === 0 ||
              exercises.some(
                (ex) => !ex.name.trim() || !ex.currentWeight.trim(),
              )
            }
            className="min-w-35"
          >
            {addWorkoutMutation.isPending ? 'Creating...' : 'Create Workout'}
          </Button>
        </div>
      </form>
    </div>
  )
}

type AddWorkoutFormProps = {
  onSave?: () => void
  asModal?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function AddWorkoutForm({
  onSave,
  asModal = false,
  open = false,
  onOpenChange,
}: AddWorkoutFormProps) {
  const addWorkoutMutation = useAddWorkout()
  const { data: templates = [] } = useExercises()

  const [workoutName, setWorkoutName] = useState('')
  const [exercises, setExercises] = useState<WorkoutExerciseForm[]>([
    createDefaultExercise(),
  ])
  const [selectedDays, setSelectedDays] = useState<string[]>([])

  const updateExercise = useCallback(
    (index: number, exercise: WorkoutExerciseForm) => {
      setExercises((prev) => prev.map((ex, i) => (i === index ? exercise : ex)))
    },
    [],
  )

  const addExercise = useCallback(() => {
    setExercises((prev) => [createDefaultExercise(), ...prev])
  }, [])

  const removeExercise = useCallback((index: number) => {
    setExercises((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const toggleDay = useCallback((day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    )
  }, [])

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      try {
        const exerciseData = exercises.map((exercise, index) => ({
          name: exercise.name,
          currentWeight: parseFloat(exercise.currentWeight),
          startingWeight: parseFloat(exercise.currentWeight),
          minReps: parseInt(exercise.minReps),
          maxReps: parseInt(exercise.maxReps),
          weightIncrement: parseFloat(exercise.weightIncrement || '2.5'),
          unit: exercise.unit,
          order: index + 1,
        }))

        await addWorkoutMutation.mutateAsync({
          name: workoutName,
          selectedDays,
          exercises: exerciseData,
        })

        // Reset form
        setWorkoutName('')
        setExercises([createDefaultExercise()])
        setSelectedDays([])

        onSave?.()
        if (asModal) {
          onOpenChange?.(false)
        }
      } catch (error) {
        console.error('Error creating workout:', error)
      }
    },
    [
      workoutName,
      selectedDays,
      exercises,
      addWorkoutMutation,
      onSave,
      asModal,
      onOpenChange,
    ],
  )

  if (asModal) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader className="shrink-0">
            <DialogTitle>Create New Workout</DialogTitle>
            <DialogDescription>
              Create a custom workout with your exercises and schedule.
            </DialogDescription>
          </DialogHeader>
          <FormContent
            exercises={exercises}
            workoutName={workoutName}
            selectedDays={selectedDays}
            addWorkoutMutation={addWorkoutMutation}
            updateExercise={updateExercise}
            addExercise={addExercise}
            removeExercise={removeExercise}
            toggleDay={toggleDay}
            setWorkoutName={setWorkoutName}
            onSubmit={onSubmit}
            asModal={asModal}
            templates={templates}
          />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <FormContent
      exercises={exercises}
      workoutName={workoutName}
      selectedDays={selectedDays}
      addWorkoutMutation={addWorkoutMutation}
      updateExercise={updateExercise}
      addExercise={addExercise}
      removeExercise={removeExercise}
      toggleDay={toggleDay}
      setWorkoutName={setWorkoutName}
      onSubmit={onSubmit}
      asModal={asModal}
      templates={templates}
    />
  )
}
