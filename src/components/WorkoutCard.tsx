import { useState } from 'react'
import {
  Calendar,
  CheckCircle,
  Edit,
  MoreVertical,
  Play,
  Trash2,
} from 'lucide-react'
import DeleteAlertDialog from './DeleteAlertDialog'
import EditWorkoutForm from './EditWorkoutForm'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import WorkoutLog from './WorkoutLog'
import type { WorkoutWithExercises } from '@/db/schema'
import { useIsWorkoutCompletedToday } from '@/hooks/workouts.query'

interface WorkoutCardProps {
  workout: WorkoutWithExercises
  onDelete?: (workout: WorkoutWithExercises) => void
  onRefresh?: () => void
}

export default function WorkoutCard({
  workout,
  onDelete,
  onRefresh,
}: WorkoutCardProps) {
  const [showWorkoutLog, setShowWorkoutLog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // Check if this workout was completed today
  const { data: isCompletedToday = false } = useIsWorkoutCompletedToday(
    workout.id,
  )

  const handleDelete = () => {
    onDelete?.(workout)
    setShowDeleteDialog(false)
  }

  const handleWorkoutComplete = () => {
    onRefresh?.()
    setShowWorkoutLog(false)
  }

  const handleEditSave = () => {
    onRefresh?.()
    setIsEditModalOpen(false)
  }

  const isCompleted = workout.workoutExercises.length > 0
  const selectedDays = workout.selectedDays.split(',')

  // Check if this workout is scheduled for today
  const today = new Date().toLocaleDateString('en-US', { weekday: 'short' })
  const isToday = selectedDays.includes(today)

  return (
    <div className="border border-border/50 rounded-lg p-6 bg-card shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full">
      {/* Header with title and actions */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-bold text-xl text-foreground leading-tight">
              {workout.name}
            </h3>
            {isCompleted && <CheckCircle className="h-5 w-5 text-green-500" />}
            {isCompletedToday && (
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Completed Today
              </span>
            )}
            {isToday && !isCompletedToday && (
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                Today
              </span>
            )}
          </div>

          {/* Days display */}
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div className="flex gap-1">
              {selectedDays.map((day, index) => (
                <span
                  key={day}
                  className={`text-xs px-2 py-1 rounded ${
                    day === today
                      ? 'bg-blue-100 text-blue-800 font-medium'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {day}
                  {index < selectedDays.length - 1 && ''}
                </span>
              ))}
            </div>
          </div>
        </div>

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
              onClick={() => setIsEditModalOpen(true)}
              className="cursor-pointer"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setShowDeleteDialog(true)}
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Exercise List */}
      <div className="flex-1 mb-6">
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-muted-foreground mb-3">
            Exercises ({workout.workoutExercises.length})
          </h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {workout.workoutExercises.map((workoutExercise) => (
              <div
                key={workoutExercise.id}
                className="flex items-center justify-between text-sm border border-border/30 rounded-md px-3 py-2 bg-muted/30"
              >
                <span className="font-medium text-foreground">
                  {workoutExercise.name}
                </span>
                <div className="text-muted-foreground text-xs">
                  {workoutExercise.currentWeight}
                  {workoutExercise.unit} • {workoutExercise.minReps}-
                  {workoutExercise.maxReps} reps
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <Button
        className="w-full"
        onClick={() => setShowWorkoutLog(true)}
        size="lg"
        variant={isCompletedToday ? 'outline' : 'default'}
        disabled={workout.workoutExercises.length === 0 || isCompletedToday}
      >
        <Play className="h-4 w-4 mr-2" />
        {isCompletedToday
          ? 'Completed Today'
          : isCompleted
            ? 'Start Workout'
            : 'Start Workout'}
      </Button>

      {/* Modals */}
      <WorkoutLog
        workout={workout}
        open={showWorkoutLog}
        onOpenChange={setShowWorkoutLog}
        onWorkoutComplete={handleWorkoutComplete}
      />

      <DeleteAlertDialog
        showDeleteDialog={showDeleteDialog}
        setShowDeleteDialog={setShowDeleteDialog}
        workout={workout}
        handleDelete={handleDelete}
      />

      <EditWorkoutForm
        asModal={true}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        workout={workout}
        onSave={handleEditSave}
      />
    </div>
  )
}
