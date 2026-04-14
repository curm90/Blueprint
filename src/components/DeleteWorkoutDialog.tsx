import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { Trash } from 'lucide-react'
import { useConvexMutation } from '@convex-dev/react-query'
import { api } from 'convex/_generated/api'
import type { Id } from 'convex/_generated/dataModel'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'

export default function DeleteWorkoutDialog({ workoutId }: { workoutId: Id<'workouts'> }) {
  const [isOpen, setIsOpen] = useState(false)

  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.workouts.deleteWorkoutById),
  })

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DialogTrigger asChild>
        <Button variant='outline' size='icon-sm' className='sm:size-8'>
          <Trash />
        </Button>
      </DialogTrigger>
      <DialogContent className='flex flex-col gap-1'>
        <DialogTitle className='text-lg font-semibold'>Delete Workout</DialogTitle>
        <p className='text-sm text-muted-foreground'>
          Are you sure you want to delete this workout?
        </p>
        <div className='flex items-center justify-end gap-2 mt-6'>
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
