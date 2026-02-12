import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import type { Exercise } from '@/db/schema'
import { useAppForm } from '@/hooks/demo.form'
import { addSessionLogServer } from '@/utils/exercise-log.server'

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
}

export default function ExerciseLog({
  exercise,
  open,
  onOpenChange,
}: ExerciseLogProps) {
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

      await addSessionLogServer({ data })
      onOpenChange(false)
    },
  })

  return (
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
              children={(field) => <field.TextArea label="Notes (Optional)" />}
            />

            <form.AppForm>
              <form.SubscribeButton label="Save Log" />
            </form.AppForm>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
