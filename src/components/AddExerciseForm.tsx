import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { useAppForm } from '@/hooks/demo.form'
import { useAddExercise } from '@/hooks/exercises.query'
import { exerciseFormSchema } from '@/db/schema'

// Use the schema from the database file
const schema = exerciseFormSchema

interface AddExerciseFormProps {
  onSave?: () => void
  asModal?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function AddExerciseForm({
  onSave,
  asModal = false,
  open = false,
  onOpenChange,
}: AddExerciseFormProps) {
  const addExerciseMutation = useAddExercise()

  const form = useAppForm({
    defaultValues: {
      name: '',
      currentWeight: '',
      unit: 'kg',
      minReps: '',
      maxReps: '',
    },
    validators: {
      onChange: schema,
    },
    onSubmit: async ({ value }) => {
      // Convert string values to integers for database
      const exerciseData = {
        name: value.name,
        currentWeight: parseInt(value.currentWeight, 10),
        startingWeight: parseInt(value.currentWeight, 10), // Use current weight as starting weight
        unit: value.unit as 'kg' | 'lbs', // Type assertion for enum
        minReps: parseInt(value.minReps, 10),
        maxReps: parseInt(value.maxReps, 10),
        // weightIncrement will use database default (2.5kg)
      }

      console.log('Processed exercise data:', exerciseData)

      try {
        await addExerciseMutation.mutateAsync(exerciseData)
        console.log('Exercise added successfully!')
      } catch (error) {
        console.error('Error adding exercise:', error)
        return // Don't reset form if there's an error
      }

      // Reset form after successful submission
      form.reset()

      // Call onSave callback and close modal if used as modal
      onSave?.()
      if (asModal) {
        onOpenChange?.(false)
      }
    },
  })

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
      {!asModal && <h1 className="text-2xl font-bold mb-4">Add Exercise</h1>}

      <form.AppField
        name="name"
        children={(field) => <field.TextField label="Exercise Name" />}
      />

      <div className="grid grid-cols-2 items-end gap-4">
        <form.AppField
          name="currentWeight"
          children={(field) => <field.TextField label="Current weight" />}
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

      <div className={`flex justify-end ${asModal ? '' : 'mt-4'}`}>
        <form.AppForm>
          <form.SubscribeButton
            label={
              addExerciseMutation.isPending ? 'Adding...' : 'Save Exercise'
            }
          />
        </form.AppForm>
      </div>
    </form>
  )

  if (asModal) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Exercise</DialogTitle>
            <DialogDescription>
              Add a new exercise to your workout routine.
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
