import z from 'zod'
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

export default function ExerciseLog() {
  const mockExercise = {
    name: 'Chest fly',
    minReps: 4,
    maxReps: 10,
    targetWeight: 55,
    unit: 'kg',
  }

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
    },
  })

  return (
    <div className="border p-6 rounded-lg shadow-md flex flex-col gap-4 max-w-130 mx-auto">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <div className="flex flex-col gap-4">
          <h1 className="font-bold text-lg">{mockExercise.name}</h1>
          <p>
            Target: {mockExercise.targetWeight}
            {mockExercise.unit} × {mockExercise.minReps}-{mockExercise.maxReps}{' '}
            reps
          </p>
          <p className="font-medium">How did it go?</p>

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
    </div>
  )
}
