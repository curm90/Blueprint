import { useForm } from '@tanstack/react-form'
import { api } from 'convex/_generated/api'
import { useMutation } from 'convex/react'
import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { Field, FieldError, FieldLabel } from '~/components/ui/field'
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
import { Plus, ArrowLeft, ArrowRight } from 'lucide-react'

export function CreateWorkoutForm() {
  const createWorkout = useMutation(api.workouts.addWorkout)
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [currentStage, setCurrentStage] = useState<'basic' | 'exercises'>('basic')
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
      console.log('Form submission triggered with:', { value, exercises })

      if (exercises.length === 0) {
        alert('Please add at least one exercise')
        return
      }

      console.log('Creating workout with:', { value, exercises })
      await createWorkout({
        title: value.title,
        selectedDays: value.selectedDays,
        weightUnit: value.weightUnit,
        exercises: exercises,
      })

      // Reset form and exercises
      form.reset()
      setExercises([])
      setCurrentStage('basic')
      setIsOpen(false) // Close the dialog
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

  const validateBasicInfo = () => {
    const title = form.getFieldValue('title')
    const selectedDays = form.getFieldValue('selectedDays')

    if (!title.trim()) {
      alert('Please enter a workout title')
      return false
    }

    if (selectedDays.length === 0) {
      alert('Please select at least one day')
      return false
    }

    return true
  }

  const goToNextStage = () => {
    if (validateBasicInfo()) {
      setCurrentStage('exercises')
    }
  }

  const goToPreviousStage = () => {
    setCurrentStage('basic')
  }

  const handleDialogClose = () => {
    setCurrentStage('basic')
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
      <DialogContent className='w-full p-6 sm:max-w-120'>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <DialogHeader>
            <DialogTitle>
              {currentStage === 'basic' ? 'Workout Details' : 'Add Exercises'}
            </DialogTitle>
            <DialogDescription>
              {currentStage === 'basic'
                ? 'Enter your workout details to get started'
                : `Add exercises to "${form.getFieldValue('title')}"`}
            </DialogDescription>
          </DialogHeader>
          {currentStage === 'basic' ? (
            <div className='space-y-6'>
              {/* Stage 1: Basic Info */}
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
            </div>
          ) : (
            <div className='space-y-6'>
              {/* Stage 2: Exercises */}
              <div className='space-y-4'>
                <h3 className='text-lg font-medium'>Add Exercise</h3>

                {/* Exercise Title */}
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

                {/* Exercise Details Grid */}
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

                <Button type='button' onClick={addExercise} className='w-full' variant='outline'>
                  <Plus className='w-4 h-4 mr-2' />
                  Add Exercise
                </Button>
              </div>

              {/* Exercise List */}
              {exercises.length > 0 && (
                <div className='border-t pt-4'>
                  <h4 className='text-sm font-medium mb-3 text-gray-600'>
                    Added Exercises ({exercises.length})
                  </h4>
                  <div className='space-y-2 max-h-48 overflow-y-auto'>
                    {exercises.map((exercise, index) => (
                      <div
                        key={index}
                        className='flex items-center justify-between p-3 border rounded-md bg-gray-50'
                      >
                        <div className='flex-1'>
                          <p className='font-medium text-sm'>{exercise.exerciseTitle}</p>
                          <p className='text-xs text-gray-600'>
                            {exercise.weight} {form.getFieldValue('weightUnit')} •{' '}
                            {exercise.minReps}-{exercise.maxReps} reps
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
            </div>
          )}

          <DialogFooter className='flex-row gap-2 mt-4'>
            {currentStage === 'basic' ? (
              <Button type='button' onClick={goToNextStage} className='flex-1'>
                Next: Add Exercises
                <ArrowRight className='w-4 h-4 ml-2' />
              </Button>
            ) : (
              <>
                <Button
                  type='button'
                  variant='outline'
                  onClick={goToPreviousStage}
                  className='flex-1'
                >
                  <ArrowLeft className='w-4 h-4 mr-2' />
                  Back
                </Button>
                <Button type='submit' disabled={exercises.length === 0} className='flex-1'>
                  Create Workout ({exercises.length} exercise{exercises.length !== 1 ? 's' : ''})
                </Button>
              </>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
