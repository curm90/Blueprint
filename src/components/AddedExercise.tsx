import { X } from 'lucide-react'
import { Button } from './ui/button'

export default function AddedExercise({
  exercise,
  index,
  removeExercise,
  weightUnit,
}: AddedExerciseProps) {
  return (
    <div className='flex items-center justify-between p-3 border rounded-md bg-gray-50'>
      <div className='flex-1'>
        <p className='font-medium text-sm'>{exercise.exerciseTitle}</p>
        <p className='text-xs text-gray-600'>
          {exercise.weight} {weightUnit} • {exercise.minReps}-{exercise.maxReps} reps
        </p>
      </div>
      <Button type='button' onClick={() => removeExercise(index)} variant='outline' size='sm'>
        <X className='w-4 h-4' />
      </Button>
    </div>
  )
}
