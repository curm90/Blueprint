import type { Exercise } from '@/db/schema'
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

export default function DeleteAlertDialog({
  showDeleteDialog,
  setShowDeleteDialog,
  exercise,
  handleDelete,
}: {
  showDeleteDialog: boolean
  setShowDeleteDialog: (open: boolean) => void
  exercise: Exercise
  handleDelete: () => void
}) {
  return (
    <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Exercise</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{exercise.name}"? This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
