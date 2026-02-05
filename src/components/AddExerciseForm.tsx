import z from 'zod'
import { useAppForm } from '@/hooks/demo.form'

const schema = z.object({
  name: z.string().min(1, 'Exercise name is required'),
  targetWeight: z.string().min(1, 'Target weight must be at least 1'),
  unit: z.string().min(1, 'Unit is required'),
  maxReps: z.string().min(1, 'Maximum reps must be at least 1'),
  minReps: z.string().min(1, 'Minimum reps must be at least 1'),
})

export default function AddExerciseForm() {
  const form = useAppForm({
    defaultValues: {
      name: '',
      targetWeight: '',
      unit: '',
      minReps: '',
      maxReps: '',
    },
    validators: {
      onChange: schema,
    },
    onSubmit: ({ value }) => {
      console.log(value)

      // Get existing exercises from localStorage or initialize empty array
      const existingExercises = JSON.parse(
        localStorage.getItem('exercises') || '[]',
      )

      // Add new exercise to the array
      const updatedExercises = [...existingExercises, value]

      // Save updated array back to localStorage
      localStorage.setItem('exercises', JSON.stringify(updatedExercises))

      console.log('All exercises:', updatedExercises)

      // Reset form after successful submission
      form.reset()
    },
  })
  return (
    <div className=" mx-auto mt-12 max-w-125">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
        className="border rounded-md p-12 flex flex-col gap-4"
      >
        <h1 className="text-2xl font-bold mb-4">Add Exercise</h1>
        <form.AppField
          name="name"
          children={(field) => <field.TextField label="Exercise Name" />}
        />
        <div className="grid grid-cols-2 items-end gap-4">
          <form.AppField
            name="targetWeight"
            children={(field) => <field.TextField label="Target weight" />}
          />
          <form.AppField
            name="unit"
            children={(field) => (
              <field.Select
                values={[
                  { value: 'kg', label: 'kg' },
                  { value: 'lbs', label: 'lbs' },
                ]}
                label="Unit"
                placeholder="Please select a unit"
              />
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4 items-end">
          <form.AppField
            name="minReps"
            children={(field) => <field.TextField label="Minimum Reps" />}
          />
          <form.AppField
            name="maxReps"
            children={(field) => <field.TextField label="Maximum Reps" />}
          />
        </div>
        <div className="flex justify-end mt-4">
          <form.AppForm>
            <form.SubscribeButton label="Save Exercise" />
          </form.AppForm>
        </div>
      </form>
    </div>
  )
}
