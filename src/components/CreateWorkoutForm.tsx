import { useForm } from '@tanstack/react-form'
import { api } from 'convex/_generated/api'
import { useMutation } from 'convex/react'
import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '~/components/ui/field'
import { Input } from '~/components/ui/input'
import { Checkbox } from '~/components/ui/checkbox'
import { exerciseSchema, formSchema } from '~/lib/schemas'
import { DAYS_OF_WEEK } from '~/lib/constants'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { Plus } from 'lucide-react'

export function CreateWorkoutForm() {
  const createWorkout = useMutation(api.workouts.addWorkout)
  const [exercises, setExercises] = useState<Exercise[]>([])

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

      console.log({ value, exercises })
      await createWorkout({
        title: value.title,
        selectedDays: value.selectedDays,
        weightUnit: value.weightUnit,
        exercises: exercises,
      })

      // Reset form and exercises
      form.reset()
      setExercises([])
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

  return (
    <Dialog>
      <form
        id='workout-form'
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <DialogTrigger asChild>
          <Button>
            <Plus />
            Create Workout
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Workout</DialogTitle>
            <DialogDescription>
              Fill out the form to create a new workout with multiple exercises.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className='space-y-6'>
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

            {/* Selected Days */}
            <form.Field
              name='selectedDays'
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel>Selected Days</FieldLabel>
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-2 mt-2'>
                      {DAYS_OF_WEEK.map((day) => (
                        <Checkbox
                          key={day.value}
                          label={day.label}
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

            {/* Weight Unit */}
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

            {/* Exercise Section */}
            <div className='border-t pt-6'>
              <h3 className='text-lg font-medium mb-4'>Add Exercise</h3>

              {/* Exercise Title (Full width) */}
              <form.Field
                name='exerciseTitle'
                children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid} className='mb-4'>
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

              {/* Two column layout for weight and reps */}
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
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

              <Button type='button' onClick={addExercise} className='mt-4' variant='outline'>
                + Add Exercise
              </Button>
            </div>

            {/* Exercise List */}
            {exercises.length > 0 && (
              <div className='border-t pt-6'>
                <h3 className='text-lg font-medium mb-4'>Added Exercises ({exercises.length})</h3>
                <div className='space-y-3'>
                  {exercises.map((exercise, index) => (
                    <div
                      key={index}
                      className='flex items-center justify-between p-3 border rounded-md bg-gray-50'
                    >
                      <div>
                        <p className='font-medium'>{exercise.exerciseTitle}</p>
                        <p className='text-sm text-gray-600'>
                          {exercise.weight} {form.getFieldValue('weightUnit')} • {exercise.minReps}-
                          {exercise.maxReps} reps
                        </p>
                      </div>
                      <Button
                        type='button'
                        onClick={() => removeExercise(index)}
                        variant='outline'
                        size='sm'
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </FieldGroup>

          <DialogFooter>
            <Field orientation='horizontal'>
              <Button
                type='button'
                variant='outline'
                onClick={() => {
                  form.reset()
                  setExercises([])
                }}
              >
                Reset
              </Button>
              <Button type='submit' form='workout-form' disabled={exercises.length === 0}>
                Create Workout ({exercises.length} exercise{exercises.length !== 1 ? 's' : ''})
              </Button>
            </Field>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
