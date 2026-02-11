import { useState } from 'react'
import { Edit, MoreVertical, Trash2 } from 'lucide-react'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import ExerciseLog from './ExerciseLog'
import type { Exercise } from '@/db/schema'

export default function ExerciseCard({
  exercise,
  onEdit,
  onDelete,
}: {
  exercise: Exercise
  onEdit?: (exercise: Exercise) => void
  onDelete?: (exercise: Exercise) => void
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border border-border/50 rounded-lg p-6 bg-card shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full">
      {/* Header with title and actions */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-bold text-xl text-foreground leading-tight flex-1">
          {exercise.name}
        </h3>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="h-8 w-8 opacity-60 hover:opacity-100"
            >
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => onEdit?.(exercise)}
              className="cursor-pointer"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete?.(exercise)}
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex-1">
        <div className="space-y-2 mb-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground font-medium">
              Current Weight
            </span>
            <span className="font-semibold text-foreground">
              {exercise.currentWeight}
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
