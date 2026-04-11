import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { Check, ChevronRight, TrendingDown, TrendingUp } from 'lucide-react'
import { useConvexMutation } from '@convex-dev/react-query'
import { api } from 'convex/_generated/api'
import { cn } from '~/lib/utils'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'

export default function TrackWorkoutForm({ workout }: TrackWorkoutFormProps) {
  const [open, setOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedOption, setSelectedOption] = useState<FeedbackOption>(null)
  const [results, setResults] = useState<ExerciseResult[]>([])

  const { mutate: trackWorkout } = useMutation({
    mutationFn: useConvexMutation(api.workoutCompletions.trackWorkout),
  })

  const totalExercises = workout.exercises.length
  const currentExercise = workout.exercises[currentStep]
  const isLastExercise = currentStep === totalExercises - 1

  function handleNext() {
    if (!selectedOption || !currentExercise) return

    const result: ExerciseResult = {
      exerciseTitle: currentExercise.exerciseTitle,
      feedback: selectedOption,
    }

    const updatedResults = [...results, result]

    if (!isLastExercise) {
      setResults(updatedResults)
      setCurrentStep((prev) => prev + 1)
      setSelectedOption(null)
    } else {
      trackWorkout({ workoutId: workout._id, results: updatedResults })
      handleReset()
    }
  }

  function handleReset() {
    setCurrentStep(0)
    setSelectedOption(null)
    setResults([])
    setOpen(false)
  }

  const progressPercent = ((currentStep + 1) / totalExercises) * 100

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? setOpen(true) : handleReset())}>
      <DialogTrigger asChild>
        <Button className='w-full'>Track Workout</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>{workout.title}</DialogTitle>
          {/* Progress */}
          <div className='flex flex-col gap-1.5 pt-1'>
            <div className='flex items-center justify-between text-xs text-muted-foreground'>
              <span>Progress</span>
              <span className='font-medium'>
                {currentStep + 1}/{totalExercises}
              </span>
            </div>
            <div className='h-2 w-full rounded-full bg-muted'>
              <div
                className='h-full rounded-full bg-primary transition-all duration-300'
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </DialogHeader>

        {/* Current exercise */}
        {currentExercise && (
          <div className='flex flex-col gap-4'>
            <div className='rounded-lg border bg-muted/40 p-4'>
              <h4 className='text-base font-semibold'>{currentExercise.exerciseTitle}</h4>
              <p className='mt-1 text-sm text-muted-foreground'>
                {currentExercise.weight}
                {workout.weightUnit} · {currentExercise.minReps}-{currentExercise.maxReps} reps
              </p>
            </div>

            {/* Question */}
            <p className='text-sm font-medium'>
              Did you hit your target of {currentExercise.minReps}-{currentExercise.maxReps} reps at{' '}
              {currentExercise.weight}
              {workout.weightUnit}?
            </p>

            {/* Feedback options */}
            <div className='flex flex-col gap-2'>
              <button
                type='button'
                onClick={() => setSelectedOption('too-easy')}
                className={cn(
                  'flex items-center gap-3 rounded-lg border p-3 text-left text-sm transition-colors',
                  selectedOption === 'too-easy'
                    ? 'border-green-500 bg-green-500/10 text-green-700 dark:text-green-400'
                    : 'hover:bg-muted',
                )}
              >
                <TrendingUp className='size-4 shrink-0 text-green-500' />
                <div>
                  <span className='font-medium'>Too Easy</span>
                  <p className='text-xs text-muted-foreground'>
                    Add 2.5{workout.weightUnit} next workout
                  </p>
                </div>
                {selectedOption === 'too-easy' && (
                  <Check className='ml-auto size-4 text-green-500' />
                )}
              </button>

              <button
                type='button'
                onClick={() => setSelectedOption('just-right')}
                className={cn(
                  'flex items-center gap-3 rounded-lg border p-3 text-left text-sm transition-colors',
                  selectedOption === 'just-right'
                    ? 'border-orange-500 bg-orange-500/10 text-orange-700 dark:text-orange-400'
                    : 'hover:bg-muted',
                )}
              >
                <Check className='size-4 shrink-0 text-orange-500' />
                <div>
                  <span className='font-medium'>Just Right</span>
                  <p className='text-xs text-muted-foreground'>3× in a row → increase weight</p>
                </div>
                {selectedOption === 'just-right' && (
                  <Check className='ml-auto size-4 text-orange-500' />
                )}
              </button>

              <button
                type='button'
                onClick={() => setSelectedOption('too-hard')}
                className={cn(
                  'flex items-center gap-3 rounded-lg border p-3 text-left text-sm transition-colors',
                  selectedOption === 'too-hard'
                    ? 'border-red-500 bg-red-500/10 text-red-700 dark:text-red-400'
                    : 'hover:bg-muted',
                )}
              >
                <TrendingDown className='size-4 shrink-0 text-red-500' />
                <div>
                  <span className='font-medium'>Too Hard</span>
                  <p className='text-xs text-muted-foreground'>
                    Decrease by 2.5{workout.weightUnit} next workout
                  </p>
                </div>
                {selectedOption === 'too-hard' && <Check className='ml-auto size-4 text-red-500' />}
              </button>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button onClick={handleNext} disabled={!selectedOption} className='w-full sm:w-auto'>
            {isLastExercise ? 'Finish Workout' : 'Next Exercise'}
            <ChevronRight className='size-4' />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
