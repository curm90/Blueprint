import type { Exercise, WorkoutWithExercises } from '@/db/schema'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

type DeleteAlertDialogProps = {
  showDeleteDialog: boolean
  setShowDeleteDialog: (open: boolean) => void
  handleDelete: () => void
  exercise?: Exercise
  workout?: WorkoutWithExercises
}

export default function DeleteAlertDialog({
  showDeleteDialog,
  setShowDeleteDialog,
  exercise,
  workout,
  handleDelete,
}: DeleteAlertDialogProps) {
  const itemName = exercise?.name || workout?.name || 'item'
  const itemType = exercise ? 'Exercise' : workout ? 'Workout' : 'Item'

  const getDescription = () => {
    if (workout) {
      const exerciseCount = workout.workoutExercises.length || 0
      return `Are you sure you want to delete "${workout.name}"? This workout contains ${exerciseCount} exercise${exerciseCount !== 1 ? 's' : ''} and this action cannot be undone.`
    }
    return `Are you sure you want to delete "${itemName}"? This action cannot be undone.`
  }

  return (
    <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {itemType}</AlertDialogTitle>
          <AlertDialogDescription>{getDescription()}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="hover:bg-destructive hover:text-destructive-foreground"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
