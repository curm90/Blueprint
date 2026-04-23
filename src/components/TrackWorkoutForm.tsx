import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { ChevronRight, LoaderCircle } from 'lucide-react'
import { useConvexMutation } from '@convex-dev/react-query'
import { toast } from 'sonner'
import { api } from 'convex/_generated/api'
import options from './TrackWorkoutOptionData'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import TrackWorkoutOptionBtn from './TrackWorkoutOptionBtn'

export default function TrackWorkoutForm({ workout }: TrackWorkoutFormProps) {
  const [open, setOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedOption, setSelectedOption] = useState<FeedbackOption>(null)
  const [results, setResults] = useState<ExerciseResult[]>([])

  const trackWorkout = useMutation({
    mutationFn: useConvexMutation(api.workoutCompletions.trackWorkout),
  })

  const totalExercises = workout.exercises.length
  const currentExercise = workout.exercises[currentStep]
  const isLastExercise = currentStep === totalExercises - 1

  async function handleNext() {
    if (!selectedOption || !currentExercise) return

    const result: ExerciseResult = {
      id: currentExercise.id,
      exerciseTitle: currentExercise.exerciseTitle,
      feedback: selectedOption,
    }

    const updatedResults = [...results, result]

    if (!isLastExercise) {
      setResults(updatedResults)
      setCurrentStep((prev) => prev + 1)
      setSelectedOption(null)
    } else {
      try {
        await trackWorkout.mutateAsync({ workoutId: workout._id, results: updatedResults })
        toast.success('Workout tracked successfully!')
        handleReset()
      } catch (error) {
        toast.error('Failed to track workout. Please try again.')
      }
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
        <Button className='w-fit flex justify-self-end mt-4'>Track Workout</Button>
      </DialogTrigger>
      <DialogContent className='max-w-[calc(100%-4rem)] sm:max-w-md'>
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
              {options.map((option) => (
                <TrackWorkoutOptionBtn
                  key={option.id}
                  id={option.id}
                  title={option.title}
                  description={option.description}
                  onSelect={setSelectedOption}
                  isSelected={selectedOption === option.id}
                  icon={option.icon}
                  buttonClassName={option.buttonClassName}
                  iconColor={option.iconColor}
                />
              ))}
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            onClick={handleNext}
            disabled={!selectedOption || trackWorkout.isPending}
            className='w-full sm:w-auto'
          >
            {trackWorkout.isPending && <LoaderCircle className='h-4 w-4 animate-spin' />}
            {isLastExercise ? 'Finish Workout' : 'Next Exercise'}
            <ChevronRight className='size-4' />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
