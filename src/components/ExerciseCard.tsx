import { useState } from 'react'
import { Button } from './ui/button'
import ExerciseLog from './ExerciseLog'

export default function ExerciseCard({ exercise }: any) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border border-border/50 rounded-lg p-6 bg-card shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full">
      <div className="flex-1">
        <h3 className="font-bold text-xl text-foreground leading-tight mb-3">
          {exercise.name}
        </h3>

        <div className="space-y-2 mb-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground font-medium">
              Target Weight
            </span>
            <span className="font-semibold text-foreground">
              {exercise.targetWeight}
              {exercise.unit}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground font-medium">Rep Range</span>
            <span className="font-semibold text-foreground">
              {exercise.minReps}-{exercise.maxReps} reps
            </span>
          </div>
        </div>
      </div>

      <Button className="w-full" onClick={() => setIsOpen(true)} size="lg">
        Log Today's Session
      </Button>

      <ExerciseLog exercise={exercise} open={isOpen} onOpenChange={setIsOpen} />
    </div>
  )
}
