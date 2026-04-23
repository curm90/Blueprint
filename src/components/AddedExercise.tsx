import { X } from 'lucide-react'
import { Button } from './ui/button'

export default function AddedExercise({
  exercise,
  removeExercise,
  weightUnit,
}: AddedExerciseProps) {
  return (
    <div className='flex items-center justify-between p-3 border rounded-md bg-muted'>
      <div className='flex-1'>
        <p className='font-medium text-sm'>{exercise.exerciseTitle}</p>
        <p className='text-xs text-muted-foreground'>
          {exercise.weight} {weightUnit} • {exercise.minReps}-{exercise.maxReps} reps •{' '}
          {`${exercise.sets} sets`}
        </p>
      </div>
      <Button type='button' onClick={() => removeExercise(exercise.id)} variant='outline' size='sm'>
        <X className='w-4 h-4' />
      </Button>
    </div>
  )
}
