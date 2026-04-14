import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { useConvexMutation } from '@convex-dev/react-query'
import { Plus, Edit } from 'lucide-react'
import { z } from 'zod'
import { api } from 'convex/_generated/api'
import { Button } from '~/components/ui/button'
import { Field, FieldError, FieldLabel } from '~/components/ui/field'
import { Input } from '~/components/ui/input'
import { Checkbox } from '~/components/ui/checkbox'
import AddedExerciseList from './AddedExerciseList'
import { exerciseSchema } from '~/lib/schemas'
import { DAYS_OF_WEEK } from '~/lib/constants'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'

export function WorkoutForm({ mode, workoutId, initialData, children }: WorkoutFormProps) {
  const { mutate: createWorkout } = useMutation({
    mutationFn: useConvexMutation(api.workouts.addWorkout),
  })
  const { mutate: updateWorkout } = useMutation({
    mutationFn: useConvexMutation(api.workouts.editWorkoutById),
  })

  const [exercises, setExercises] = useState<Exercise[]>(initialData?.exercises || [])
  const [isOpen, setIsOpen] = useState(false)
  const [exerciseFormErrors, setExerciseFormErrors] = useState<{
    exerciseTitle?: string[]
    weight?: string[]
    minReps?: string[]
    maxReps?: string[]
  }>({})

  const isEditMode = mode === 'edit'

  // Helper function for field validation
  function validateField(schema: any, value: any) {
    const result = schema.safeParse(value)
    return result.success ? undefined : result.error.issues[0]?.message
  }

  const form = useForm({
    defaultValues: {
      title: initialData?.title || '',
      selectedDays: initialData?.selectedDays || ([] as string[]),
      weightUnit: initialData?.weightUnit || 'kg',
      exerciseTitle: '',
      weight: '',
      minReps: '',
      maxReps: '',
    },
    validators: {
      onSubmit: () => {
        // Only validate that at least one exercise is added (form-level validation)
        if (exercises.length === 0) {
          return {
            form: `Please add at least one exercise before ${isEditMode ? 'updating' : 'creating'} the workout.`,
          }
        }
        return undefined
      },
    },
    onSubmit: ({ value }) => {
      if (isEditMode && workoutId) {
        updateWorkout({
          id: workoutId,
          updates: {
            title: value.title,
            selectedDays: value.selectedDays,
            weightUnit: value.weightUnit,
            exercises,
          },
        })
      } else {
        createWorkout({
          title: value.title,
          selectedDays: value.selectedDays,
          weightUnit: value.weightUnit,
          exercises,
        })
      }

      // Reset form and exercises
      form.reset()
      setExercises(initialData?.exercises || [])
      setExerciseFormErrors({})
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
    const validation = exerciseSchema.safeParse(exerciseValues)

    if (!validation.success) {
      // Set field-specific errors
      const errorsByField = validation.error.format()
      setExerciseFormErrors({
        exerciseTitle: errorsByField.exerciseTitle?._errors,
        weight: errorsByField.weight?._errors,
        minReps: errorsByField.minReps?._errors,
        maxReps: errorsByField.maxReps?._errors,
      })
      return
    }

    // Clear any previous errors
    setExerciseFormErrors({})

    const newExercise: Exercise = {
      exerciseTitle: exerciseValues.exerciseTitle,
      weight: parseFloat(exerciseValues.weight),
      startingWeight: parseFloat(exerciseValues.weight),
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

  function removeExercise(index: number) {
    setExercises(exercises.filter((_, i) => i !== index))
  }

  function handleDialogClose() {
    form.reset()
    setExercises(initialData?.exercises || [])
    setExerciseFormErrors({})
  }

  function handleDialogOpenChange(open: boolean) {
    setIsOpen(open)
    if (!open) {
      handleDialogClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='w-full p-6 sm:max-w-xl max-h-[90vh] overflow-y-auto'>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <DialogHeader className='flex flex-col gap-0'>
            <DialogTitle className='text-xl'>
              {isEditMode ? 'Edit Workout' : 'Create New Workout'}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? 'Update your workout details and exercises'
                : 'Enter your workout details and add exercises'}
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-6 mt-6'>
            {/* Basic Workout Info - 2 per row layout */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <form.Field
                name='title'
                validators={{
                  onSubmit: ({ value }) =>
                    validateField(
                      z
                        .string()
                        .min(5, 'Workout title must be at least 5 characters.')
                        .max(50, 'Workout title must be at most 50 characters.'),
                      value,
                    ),
                }}
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
                      {isInvalid && field.state.meta.errors && (
                        <FieldError errors={[{ message: field.state.meta.errors[0] }]} />
                      )}
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
                        className='flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 pr-8 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring dark:bg-input/30 appearance-none bg-[url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23888%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E")] bg-[length:16px] bg-[right_8px_center] bg-no-repeat'
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
              validators={{
                onSubmit: ({ value }) =>
                  validateField(z.array(z.string()).min(1, 'Select at least one day'), value),
              }}
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
                    {isInvalid && field.state.meta.errors && (
                      <FieldError errors={[{ message: field.state.meta.errors[0] }]} />
                    )}
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
                    const hasError =
                      exerciseFormErrors.exerciseTitle &&
                      exerciseFormErrors.exerciseTitle.length > 0
                    return (
                      <Field data-invalid={hasError}>
                        <FieldLabel htmlFor={field.name}>Exercise Name</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => {
                            field.handleChange(e.target.value)
                            // Clear error when user starts typing
                            if (exerciseFormErrors.exerciseTitle) {
                              setExerciseFormErrors((prev) => ({
                                ...prev,
                                exerciseTitle: undefined,
                              }))
                            }
                          }}
                          aria-invalid={hasError}
                          placeholder='E.g. Bench Press'
                          autoComplete='off'
                        />
                        {hasError && (
                          <FieldError
                            errors={exerciseFormErrors.exerciseTitle?.map((err) => ({
                              message: err,
                            }))}
                          />
                        )}
                      </Field>
                    )
                  }}
                />
                <form.Field
                  name='weight'
                  children={(field) => {
                    const hasError =
                      exerciseFormErrors.weight && exerciseFormErrors.weight.length > 0
                    return (
                      <Field data-invalid={hasError}>
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
                          onChange={(e) => {
                            field.handleChange(e.target.value)
                            // Clear error when user starts typing
                            if (exerciseFormErrors.weight) {
                              setExerciseFormErrors((prev) => ({ ...prev, weight: undefined }))
                            }
                          }}
                          aria-invalid={hasError}
                          placeholder='E.g. 60'
                          autoComplete='off'
                        />
                        {hasError && (
                          <FieldError
                            errors={exerciseFormErrors.weight?.map((err) => ({ message: err }))}
                          />
                        )}
                      </Field>
                    )
                  }}
                />
                <form.Field
                  name='minReps'
                  children={(field) => {
                    const hasError =
                      exerciseFormErrors.minReps && exerciseFormErrors.minReps.length > 0
                    return (
                      <Field data-invalid={hasError}>
                        <FieldLabel htmlFor={field.name}>Min Reps</FieldLabel>
                        <Input
                          type='number'
                          min='1'
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => {
                            field.handleChange(e.target.value)
                            // Clear error when user starts typing
                            if (exerciseFormErrors.minReps) {
                              setExerciseFormErrors((prev) => ({ ...prev, minReps: undefined }))
                            }
                          }}
                          aria-invalid={hasError}
                          placeholder='E.g. 8'
                          autoComplete='off'
                        />
                        {hasError && (
                          <FieldError
                            errors={exerciseFormErrors.minReps?.map((err) => ({ message: err }))}
                          />
                        )}
                      </Field>
                    )
                  }}
                />
                <form.Field
                  name='maxReps'
                  children={(field) => {
                    const hasError =
                      exerciseFormErrors.maxReps && exerciseFormErrors.maxReps.length > 0
                    return (
                      <Field data-invalid={hasError}>
                        <FieldLabel htmlFor={field.name}>Max Reps</FieldLabel>
                        <Input
                          type='number'
                          min='1'
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => {
                            field.handleChange(e.target.value)
                            // Clear error when user starts typing
                            if (exerciseFormErrors.maxReps) {
                              setExerciseFormErrors((prev) => ({ ...prev, maxReps: undefined }))
                            }
                          }}
                          aria-invalid={hasError}
                          placeholder='E.g. 12'
                          autoComplete='off'
                        />
                        {hasError && (
                          <FieldError
                            errors={exerciseFormErrors.maxReps?.map((err) => ({ message: err }))}
                          />
                        )}
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
                  <h4 className='text-sm font-medium mb-3 text-muted-foreground'>
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
          {/* Form-level error for missing exercises */}
          <form.Subscribe
            selector={(state) => [state.errors]}
            children={([errors]) => {
              const formError = errors?.find(
                (error) => typeof error === 'object' && 'form' in error,
              )
              return formError && 'form' in formError ? (
                <div className='mt-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md'>
                  {formError.form as string}
                </div>
              ) : null
            }}
          />
          <Button type='submit' disabled={exercises.length === 0} className='w-full mt-6'>
            {isEditMode ? 'Update' : 'Create'} Workout ({exercises.length} exercise
            {exercises.length !== 1 ? 's' : ''})
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Backward compatibility wrapper for create mode
export function CreateWorkoutForm({ compact = true }: { compact?: boolean }) {
  return (
    <WorkoutForm mode='create'>
      {compact ? (
        <Button size='icon' className='sm:h-8 sm:w-auto sm:gap-1.5 sm:px-2.5'>
          <Plus />
          <span className='hidden sm:inline'>Create Workout</span>
        </Button>
      ) : (
        <Button>
          <Plus />
          Create Workout
        </Button>
      )}
    </WorkoutForm>
  )
}

export function EditWorkoutForm({ workoutId, initialData }: EditWorkoutFormProps) {
  return (
    <WorkoutForm mode='edit' workoutId={workoutId} initialData={initialData}>
      <Button variant='outline' size='icon-sm' className='sm:size-8'>
        <Edit />
      </Button>
    </WorkoutForm>
  )
}
