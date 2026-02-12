import { useState } from 'react'
import { PlusIcon } from 'lucide-react'

import AddExerciseForm from './AddExerciseForm'
import EmptyOutline from './Empty'
import ExerciseCard from './ExerciseCard'
import { Button } from './ui/button'
import { useDeleteExercise } from '@/hooks/exercises.query'

export default function Home({ exercises }: { exercises: any }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const deleteExerciseMutation = useDeleteExercise()

  const handleDeleteExercise = async (exercise: any) => {
    try {
      console.log('Delete exercise:', exercise)
      await deleteExerciseMutation.mutateAsync(exercise.id)
    } catch (error) {
      console.error('Failed to delete exercise:', error)
      // Error will be shown via toast or error boundary
    }
  }

  return (
    <div className="mx-auto my-10 max-w-6xl px-6">
      {exercises ? (
        <div className="flex flex-col gap-8">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Today's Workout
              </h1>
              <p className="text-muted-foreground mt-1">
                {exercises.length} exercise{exercises.length !== 1 ? 's' : ''}{' '}
                ready to log
              </p>
            </div>
            <Button
              className="flex items-center gap-2"
              onClick={() => setIsAddModalOpen(true)}
            >
              <PlusIcon className="h-4 w-4" />
              Add Exercise
            </Button>
          </div>

          {/* Exercise Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exercises.map((exercise: any, index: number) => (
              <ExerciseCard
                key={exercise.id || index}
                exercise={exercise}
                onDelete={handleDeleteExercise}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6">
          <EmptyOutline />
          <Button
            size="lg"
            className="flex items-center gap-2"
            onClick={() => setIsAddModalOpen(true)}
          >
            <PlusIcon className="h-5 w-5" />
            Add Your First Exercise
          </Button>
        </div>
      )}

      {/* Add Exercise Modal */}
      <AddExerciseForm
        asModal={true}
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSave={() => {
          setIsAddModalOpen(false) // Just close modal - TanStack Query handles cache updates
        }}
      />
    </div>
  )
}
