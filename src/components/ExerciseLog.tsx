import z from 'zod'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { useAppForm } from '@/hooks/demo.form'

const difficulties = ['easy', 'right', 'hard'] as const

const schema = z.object({
  difficulty: z.string().refine((v) => difficulties.includes(v as any), {
    message: 'Please select a difficulty',
  }),
  notes: z.string().max(200, {
    message: 'Notes must be less than 200 characters',
  }),
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

interface Exercise {
  name: string
  minReps: number
  maxReps: number
  targetWeight: number
  unit: string
}

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
      difficulty: '',
      notes: '',
    },
    validators: {
      onSubmit: schema,
    },
    onSubmit: ({ value }) => {
      console.log('Form submitted with:', value)
      onOpenChange(false)
    },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{exercise.name}</DialogTitle>
          <DialogDescription>
            Target: {exercise.targetWeight}
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
