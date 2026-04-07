import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { Trash } from 'lucide-react'
import { useConvexMutation } from '@convex-dev/react-query'
import { api } from 'convex/_generated/api'
import type { Id } from 'convex/_generated/dataModel'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'

export default function DeleteWorkoutDialog({ workoutId }: { workoutId: Id<'workouts'> }) {
  const [isOpen, setIsOpen] = useState(false)

  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.workouts.deleteWorkoutById),
  })

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DialogTrigger>
        <Button variant='outline'>
          <Trash />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <h2 className='text-lg font-semibold'>Delete Workout</h2>
        <p className='text-sm text-muted-foreground mt-2'>
          Are you sure you want to delete this workout?
        </p>
        <div className='flex items-center justify-end gap-4 mt-6'>
          <Button variant='outline' onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant='destructive' onClick={() => mutate({ id: workoutId })}>
            {isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
