import { z } from 'zod'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Button } from './ui/button'
import type { WorkoutExercise } from '@/db/schema'
import { useAppForm } from '@/hooks/demo.form'
import { addSessionLogServer } from '@/utils/exercise-log.server'

// Create a form-specific schema that matches our form structure exactly
const sessionLogFormSchema = z.object({
  weight: z.string().min(1, 'Weight is required'),
  reps: z.string().min(1, 'Reps is required'),
  difficulty: z.enum(['easy', 'right', 'hard']),
  notes: z.string(),
})

const options = [
  {
    label: 'Too Easy',
    value: 'easy',
    description: 'Increase weight next time',
    color: 'bg-green-500',
    selectedBg: 'bg-green-50 border-green-500',
  },
  {
    label: 'Just Right',
    value: 'right',
    description: 'Keep the same weight next time',
    color: 'bg-yellow-500',
    selectedBg: 'bg-yellow-50 border-yellow-500',
  },
  {
    label: 'Too Hard',
    value: 'hard',
    description: 'Decrease weight next time',
    color: 'bg-red-500',
    selectedBg: 'bg-red-50 border-red-500',
  },
]

interface ExerciseLogProps {
  exercise: WorkoutExercise
  open: boolean
  onOpenChange: (open: boolean) => void
  onProgressionApplied?: (exerciseId: number) => void // Callback when weight is updated, pass exercise ID
  asInline?: boolean // If true, render inline instead of in a dialog
  workoutLogId?: number | null // Workout log ID for session logging
}

export default function ExerciseLog({
  exercise,
  open,
  onOpenChange,
  onProgressionApplied,
  asInline = false,
  workoutLogId,
}: ExerciseLogProps) {
  const [progressionResult, setProgressionResult] = useState<any>(null)
  const [showProgression, setShowProgression] = useState(false)
  const form = useAppForm({
    defaultValues: {
      weight: exercise.currentWeight.toString() || '',
      reps: exercise.minReps.toString() || '',
      difficulty: 'right' as 'easy' | 'right' | 'hard',
      notes: '',
    },
    validators: {
      onChange: sessionLogFormSchema, // Use onChange instead of onSubmit to avoid strict type checking
    },
    onSubmit: async ({ value }) => {
      try {
        // Save session data if we have a workoutLogId
        if (workoutLogId) {
          console.log('🟡 About to save session log with:', {
            workoutExerciseId: exercise.id,
            workoutLogId: workoutLogId,
            weight: parseInt(value.weight),
            reps: parseInt(value.reps),
            difficulty: value.difficulty,
            notes: value.notes || undefined,
          })

          await addSessionLogServer({
            data: {
              workoutExerciseId: exercise.id,
              workoutLogId: workoutLogId,
              weight: parseInt(value.weight),
              reps: parseInt(value.reps),
              difficulty: value.difficulty,
              notes: value.notes || undefined,
            },
          })
          console.log('🟢 Session logged successfully')
        } else {
          console.log('🔴 No workoutLogId - session not logged:', {
            workoutExerciseId: exercise.id,
            weight: parseInt(value.weight),
            reps: parseInt(value.reps),
            difficulty: value.difficulty,
            notes: value.notes,
          })
        }

        // Close the log form immediately after saving (unless inline)
        if (!asInline) {
          onOpenChange(false)
        }

        // Check for weight progression after logging
        // Note: This checks if we should suggest weight changes after session logging
        const shouldShowProgression =
          value.difficulty === 'easy' ||
          (value.difficulty === 'right' && Math.random() < 0.3) || // Show occasionally for 'right'
          value.difficulty === 'hard'

        if (shouldShowProgression) {
          // TODO: Calculate actual progression based on session history
          const mockProgression = {
            currentWeight: parseInt(value.weight),
            suggestedWeight:
              value.difficulty === 'easy'
                ? parseInt(value.weight) + 2.5
                : value.difficulty === 'hard'
                  ? Math.max(
                      parseInt(value.weight) - 2.5,
                      exercise.startingWeight || 0,
                    )
                  : parseInt(value.weight),
            reason:
              value.difficulty === 'easy'
                ? 'Session felt easy - consider increasing weight'
                : value.difficulty === 'hard'
                  ? 'Session felt hard - consider decreasing weight'
                  : 'Keep building consistency at this weight',
          }
          setProgressionResult(mockProgression)
          setShowProgression(true)
        }

        // Call the progression applied callback to mark exercise complete
        onProgressionApplied?.(exercise.id)

        // Reset form
        form.reset()
      } catch (error) {
        console.error('Failed to save session log:', error)
        // Still mark as complete even if logging fails
        onProgressionApplied?.(exercise.id)
      }
    },
  })

  const handleApplyProgression = async () => {
    // Close progression modal and mark as applied
    setShowProgression(false)
    setProgressionResult(null)

    // TODO: In the future, actually apply the weight change to the workoutExercise
    // For now, just close the modal
  }

  const handleDismissProgression = () => {
    // Close progression modal
    setShowProgression(false)
    setProgressionResult(null)
  }

  const FormContent = () => (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <div className="flex flex-col gap-3">
        {!asInline && <p className="font-medium">How did it go?</p>}
        {asInline && (
          <div className="mb-2">
            <h3 className="font-bold text-base">{exercise.name}</h3>
            <p className="text-xs text-muted-foreground">
              Target: {exercise.currentWeight}
              {exercise.unit} × {exercise.minReps}-{exercise.maxReps} reps
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <form.AppField
            name="weight"
            children={(field) => <field.TextField label="Weight Used" />}
          />

          <form.AppField
            name="reps"
            children={(field) => <field.TextField label="Reps Completed" />}
          />
        </div>

        <form.AppField
          name="difficulty"
          children={(field) => <field.DifficultySelector options={options} />}
        />

        <form.AppField
          name="notes"
          children={(field) => <field.TextArea label="Notes (Optional)" />}
        />

        <form.AppForm>
          <form.SubscribeButton label="Save Log" />
        </form.AppForm>
      </div>
    </form>
  )

  return (
    <>
      {asInline ? (
        <FormContent />
      ) : (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{exercise.name}</DialogTitle>
              <DialogDescription>
                Target: {exercise.currentWeight}
                {exercise.unit} × {exercise.minReps}-{exercise.maxReps} reps
              </DialogDescription>
            </DialogHeader>
            <FormContent />
          </DialogContent>
        </Dialog>
      )}

      {/* Separate progression dialog */}
      <Dialog
        open={showProgression}
        onOpenChange={() => setShowProgression(false)}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Weight Progression Suggestion</DialogTitle>
            <DialogDescription>
              Based on your session feedback, here's our suggestion:
            </DialogDescription>
          </DialogHeader>

          {progressionResult && (
            <>
              <div className="py-6">
                <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Current Weight:
                    </span>
                    <span className="font-semibold">
                      {exercise.currentWeight}
                      {exercise.unit}
                    </span>
                  </div>

                  {progressionResult.shouldUpdate ? (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Suggested Weight:
                      </span>
                      <span className="font-semibold text-blue-600">
                        {progressionResult.newWeight}
                        {exercise.unit}
                      </span>
                    </div>
                  ) : null}

                  <div className="pt-2 border-t border-border/50">
                    <p className="text-sm text-foreground">
                      {progressionResult.reason}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                {progressionResult.shouldUpdate ? (
                  <Button onClick={handleApplyProgression} className="flex-1">
                    Apply Suggestion
                  </Button>
                ) : null}
                <Button
                  variant="outline"
                  onClick={handleDismissProgression}
                  className="flex-1"
                >
                  {progressionResult.shouldUpdate
                    ? 'Keep Current Weight'
                    : 'Got It'}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
