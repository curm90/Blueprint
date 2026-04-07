import { useForm } from '@tanstack/react-form'
import { api } from 'convex/_generated/api'
import { useMutation } from 'convex/react'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Field, FieldError, FieldLabel } from '~/components/ui/field'
import { Input } from '~/components/ui/input'
import { Checkbox } from '~/components/ui/checkbox'
import AddedExerciseList from './AddedExerciseList'
import { exerciseSchema, formSchema } from '~/lib/schemas'
import { DAYS_OF_WEEK } from '~/lib/constants'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'

export function CreateWorkoutForm() {
  const createWorkout = useMutation(api.workouts.addWorkout)
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const form = useForm({
    defaultValues: {
      title: '',
      selectedDays: [] as string[],
      weightUnit: 'kg',
      exerciseTitle: '',
      weight: '',
      minReps: '',
      maxReps: '',
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      if (exercises.length === 0) {
        alert('Please add at least one exercise')
        return
      }

      await createWorkout({
        title: value.title,
        selectedDays: value.selectedDays,
        weightUnit: value.weightUnit,
        exercises,
      })

      // Reset form and exercises
      form.reset()
      setExercises([])
      setIsOpen(false)
    },
  })

  const addExercise = () => {
    const exerciseValues = {
      exerciseTitle: form.getFieldValue('exerciseTitle'),
      weight: form.getFieldValue('weight'),
      minReps: form.getFieldValue('minReps'),
      maxReps: form.getFieldValue('maxReps'),
    }

    // Validate exercise data
    const validation = exerciseSchema.safeParse({
      ...exerciseValues,
    })

    if (!validation.success) {
      alert('Please fill in all exercise fields correctly')
      return
    }

    const newExercise: Exercise = {
      exerciseTitle: exerciseValues.exerciseTitle,
      weight: parseFloat(exerciseValues.weight),
      minReps: parseInt(exerciseValues.minReps),
      maxReps: parseInt(exerciseValues.maxReps),
    }

    setExercises([...exercises, newExercise])

    // Clear exercise form fields
    form.setFieldValue('exerciseTitle', '')
    form.setFieldValue('weight', '')
    form.setFieldValue('minReps', '')
    form.setFieldValue('maxReps', '')
  }

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index))
  }

  const handleDialogClose = () => {
    form.reset()
    setExercises([])
  }

  const handleDialogOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      handleDialogClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)}>
          <Plus />
          Create Workout
        </Button>
      </DialogTrigger>
      <DialogContent className='w-full p-6 sm:max-w-xl max-h-[90vh] overflow-y-auto'>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <DialogHeader className='flex flex-col gap-0'>
            <DialogTitle className='text-xl'>Create New Workout</DialogTitle>
            <DialogDescription>Enter your workout details and add exercises</DialogDescription>
          </DialogHeader>
          <div className='space-y-6 mt-6'>
            {/* Basic Workout Info - 2 per row layout */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <form.Field
                name='title'
                children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Workout Title</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder='E.g. Upper Body Push Day'
                        autoComplete='off'
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  )
                }}
              />
              <form.Field
                name='weightUnit'
                children={(field) => {
                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Weight Unit</FieldLabel>
                      <select
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className='flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
                      >
                        <option value='kg'>Kilograms (kg)</option>
                        <option value='lbs'>Pounds (lbs)</option>
                      </select>
                    </Field>
                  )
                }}
              />
            </div>
            {/* Selected Days */}
            <form.Field
              name='selectedDays'
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel>Selected Days</FieldLabel>
                    <div className='grid grid-cols-4 md:grid-cols-7 gap-2 mt-2'>
                      {DAYS_OF_WEEK.map((day) => (
                        <Checkbox
                          key={day.value}
                          label={day.shortLabel}
                          checked={field.state.value.includes(day.value)}
                          onChange={(e) => {
                            const isChecked = e.target.checked
                            const currentDays = field.state.value
                            if (isChecked) {
                              field.handleChange([...currentDays, day.value])
                            } else {
                              field.handleChange(currentDays.filter((d) => d !== day.value))
                            }
                          }}
                        />
                      ))}
                    </div>
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            />
            {/* Add Exercise Section */}
            <div className='border-t pt-6'>
              <h3 className='text-lg font-semibold mb-4'>Add Exercises</h3>
              <div className='grid grid-cols-2 gap-4'>
                <form.Field
                  name='exerciseTitle'
                  children={(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Exercise Name</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder='E.g. Bench Press'
                          autoComplete='off'
                        />
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </Field>
                    )
                  }}
                />
                <form.Field
                  name='weight'
                  children={(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Weight ({form.getFieldValue('weightUnit')})
                        </FieldLabel>
                        <Input
                          type='number'
                          step='0.5'
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder='E.g. 60'
                          autoComplete='off'
                        />
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </Field>
                    )
                  }}
                />
                <form.Field
                  name='minReps'
                  children={(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Min Reps</FieldLabel>
                        <Input
                          type='number'
                          min='1'
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder='E.g. 8'
                          autoComplete='off'
                        />
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </Field>
                    )
                  }}
                />
                <form.Field
                  name='maxReps'
                  children={(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Max Reps</FieldLabel>
                        <Input
                          type='number'
                          min='1'
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder='E.g. 12'
                          autoComplete='off'
                        />
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </Field>
                    )
                  }}
                />
              </div>
              <Button type='button' onClick={addExercise} className='w-full mt-4' variant='outline'>
                <Plus className='w-4 h-4 mr-2' />
                Add Exercise
              </Button>
              {/* Exercise List */}
              {exercises.length > 0 && (
                <div className='mt-6'>
                  <h4 className='text-sm font-medium mb-3 text-gray-600'>
                    Added Exercises ({exercises.length})
                  </h4>
                  <AddedExerciseList
                    exercises={exercises}
                    removeExercise={removeExercise}
                    weightUnit={form.getFieldValue('weightUnit')}
                  />
                </div>
              )}
            </div>
          </div>
          <Button type='submit' disabled={exercises.length === 0} className='w-full mt-6'>
            Create Workout ({exercises.length} exercise{exercises.length !== 1 ? 's' : ''})
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
