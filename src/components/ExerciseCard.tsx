import { useState } from 'react'
import { Button } from './ui/button'
import ExerciseLog from './ExerciseLog'

export default function ExerciseCard({ exercise }: any) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border rounded-lg p-4 w-full flex flex-col items-start">
      <h3 className="font-bold text-lg">{exercise.name}</h3>
      <p>
        {exercise.targetWeight}
        {exercise.unit} × {exercise.minReps}-{exercise.maxReps} reps
      </p>
      <Button className="mt-6" onClick={() => setIsOpen(true)}>
        Log Today's Session
      </Button>

      <ExerciseLog exercise={exercise} open={isOpen} onOpenChange={setIsOpen} />
    </div>
  )
}
