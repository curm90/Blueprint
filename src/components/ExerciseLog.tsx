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
import type { Exercise } from '@/db/schema'
import { useAppForm } from '@/hooks/demo.form'
import { addSessionLogServer } from '@/utils/exercise-log.server'
import {
  applyWeightProgressionServer,
  calculateWeightProgressionServer,
} from '@/utils/weight-progression.server'

// Create a form-specific schema that matches our form structure exactly
const sessionLogFormSchema = z.object({
  difficulty: z.enum(['easy', 'right', 'hard']),
  notes: z.string(), // Required string for form compatibility
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
  exercise: Exercise
  open: boolean
  onOpenChange: (open: boolean) => void
  onProgressionApplied?: () => void // Callback when weight is updated
}

export default function ExerciseLog({
  exercise,
  open,
  onOpenChange,
  onProgressionApplied,
}: ExerciseLogProps) {
  const [progressionResult, setProgressionResult] = useState<any>(null)
  const [showProgression, setShowProgression] = useState(false)
  const form = useAppForm({
    defaultValues: {
      difficulty: 'right' as 'easy' | 'right' | 'hard',
      notes: '',
    },
    validators: {
      onChange: sessionLogFormSchema, // Use onChange instead of onSubmit to avoid strict type checking
    },
    onSubmit: async ({ value }) => {
      console.log('Form submitted with:', value)

      // Transform form data to match server expectations
      const data = {
        exerciseId: exercise.id,
        difficulty: value.difficulty,
        notes: value.notes || undefined, // Convert empty string to undefined for optional field
      }

      // Log the session
      await addSessionLogServer({ data })

      // Close the log form immediately after saving
      onOpenChange(false)

      // Calculate weight progression based on this session
      const progression = await calculateWeightProgressionServer({
        data: { exerciseId: exercise.id },
      })

      // Show progression suggestion to user
      setProgressionResult(progression)
      setShowProgression(true)

      // Reset form
      form.reset()
    },
  })

  const handleApplyProgression = async () => {
    if (progressionResult) {
      await applyWeightProgressionServer({
        data: { exerciseId: exercise.id },
      })
      onProgressionApplied?.() // Notify parent to refresh data
    }

    // Close progression modal
    setShowProgression(false)
    setProgressionResult(null)
  }

  const handleDismissProgression = () => {
    // Close progression modal
    setShowProgression(false)
    setProgressionResult(null)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{exercise.name}</DialogTitle>
            <DialogDescription>
              Target: {exercise.currentWeight}
              {exercise.unit} × {exercise.minReps}-{exercise.maxReps} reps
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
          >
            <div className="flex flex-col gap-4">
              <p className="font-medium">How did it go?</p>

              <form.AppField
                name="difficulty"
                children={(field) => (
                  <field.DifficultySelector options={options} />
                )}
              />

              <form.AppField
                name="notes"
                children={(field) => (
                  <field.TextArea label="Notes (Optional)" />
                )}
              />

              <form.AppForm>
                <form.SubscribeButton label="Save Log" />
              </form.AppForm>
            </div>
          </form>
        </DialogContent>
      </Dialog>

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
