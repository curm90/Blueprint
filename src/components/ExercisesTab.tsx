import { useState } from 'react'
import { PlusIcon } from 'lucide-react'
import ExerciseCard from './ExerciseCard'
import AddExerciseForm from './AddExerciseForm'
import EmptyOutline from './Empty'
import { Button } from './ui/button'
import type { Exercise } from '@/db/schema'
import { useDeleteExercise } from '@/hooks/exercises.query'

interface ExercisesTabProps {
  exercises: Exercise[]
}

export default function ExercisesTab({ exercises }: ExercisesTabProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const deleteExerciseMutation = useDeleteExercise()

  const handleDeleteExercise = async (exercise: Exercise) => {
    try {
      console.log('Delete exercise:', exercise)
      await deleteExerciseMutation.mutateAsync(exercise.id)
    } catch (error) {
      console.error('Failed to delete exercise:', error)
    }
  }

  if (exercises.length === 0) {
    return (
      <div className="flex flex-col items-center gap-6 py-12">
        <EmptyOutline />
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No exercises yet
          </h3>
          <p className="text-muted-foreground mb-4">
            Create your first exercise to get started
          </p>
        </div>
        <Button
          size="lg"
          className="flex items-center gap-2"
          onClick={() => setIsAddModalOpen(true)}
        >
          <PlusIcon className="h-5 w-5" />
          Add Your First Exercise
        </Button>

        <AddExerciseForm
          asModal={true}
          open={isAddModalOpen}
          onOpenChange={setIsAddModalOpen}
          onSave={() => setIsAddModalOpen(false)}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Your Exercises
          </h2>
          <p className="text-muted-foreground text-sm">
            {exercises.length} exercise{exercises.length !== 1 ? 's' : ''} ready
            to log
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
        {exercises.map((exercise: Exercise, index: number) => (
          <ExerciseCard
            key={exercise.id || index}
            exercise={exercise}
            onDelete={handleDeleteExercise}
          />
        ))}
      </div>

      {/* Add Exercise Modal */}
      <AddExerciseForm
        asModal={true}
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSave={() => setIsAddModalOpen(false)}
      />
    </div>
  )
}
