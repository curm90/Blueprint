import { useState } from 'react'
import { PlusIcon } from 'lucide-react'

import AddExerciseForm from './AddExerciseForm'
import EmptyOutline from './Empty'
import ExerciseCard from './ExerciseCard'
import { Button } from './ui/button'
import { deleteExerciseServer } from '@/utils/exercises.server'

export default function Home({
  exercises,
  onRefresh,
}: {
  exercises: any
  onRefresh?: () => void
}) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const handleEditExercise = (exercise: any) => {
    console.log('Edit exercise:', exercise)
    // TODO: Implement edit functionality
  }

  const handleDeleteExercise = async (exercise: any) => {
    try {
      console.log('Delete exercise:', exercise)
      await deleteExerciseServer({ data: { id: exercise.id } })
      onRefresh?.() // This triggers the UI refresh!
    } catch (error) {
      console.error('Failed to delete exercise:', error)
      // TODO: Show user-friendly error message
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
                onEdit={handleEditExercise}
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
          onRefresh?.() // Refresh exercises list
          setIsAddModalOpen(false)
        }}
      />
    </div>
  )
}
