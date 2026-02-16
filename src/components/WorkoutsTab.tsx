import { useState } from 'react'
import { Calendar, PlusIcon } from 'lucide-react'
import WorkoutCard from './WorkoutCard'
import AddWorkoutForm from './AddWorkoutForm'
import EmptyOutline from './Empty'
import { Button } from './ui/button'
import type { WorkoutWithExercises } from '@/db/schema'
import { useDeleteWorkout, useTodaysWorkouts } from '@/hooks/workouts.query'

interface WorkoutsTabProps {
  workouts: WorkoutWithExercises[]
}

export default function WorkoutsTab({ workouts }: WorkoutsTabProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const deleteWorkoutMutation = useDeleteWorkout()
  const { data: todaysWorkouts } = useTodaysWorkouts()

  const handleDeleteWorkout = async (workout: WorkoutWithExercises) => {
    try {
      console.log('Delete workout:', workout)
      await deleteWorkoutMutation.mutateAsync(workout.id)
    } catch (error) {
      console.error('Failed to delete workout:', error)
    }
  }

  // Separate today's workouts from others
  const today = new Date().toLocaleDateString('en-US', { weekday: 'short' })
  const todaysWorkoutsList = workouts.filter((w) =>
    w.selectedDays.split(',').includes(today),
  )
  const otherWorkouts = workouts.filter(
    (w) => !w.selectedDays.split(',').includes(today),
  )

  function toggleAddModal() {
    setIsAddModalOpen((prev) => !prev)
  }

  if (workouts.length === 0) {
    return (
      <div className="flex flex-col items-center gap-6">
        <EmptyOutline
          title="No workouts yet"
          description="Create your first workout plan to get started."
          buttonText="Create Your First Workout"
          onClick={toggleAddModal}
        />
        <AddWorkoutForm
          asModal={true}
          open={isAddModalOpen}
          onOpenChange={setIsAddModalOpen}
          onSave={toggleAddModal}
        />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Your Workouts
          </h2>
          <p className="text-muted-foreground text-sm">
            {workouts.length} workout{workouts.length !== 1 ? 's' : ''}{' '}
            scheduled
          </p>
        </div>
        <Button className="flex items-center gap-2" onClick={toggleAddModal}>
          <PlusIcon className="h-4 w-4" />
          Create Workout
        </Button>
      </div>

      {/* Today's Workouts Section */}
      {todaysWorkoutsList.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-medium text-foreground">
              Today's Workouts
            </h3>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
              {todaysWorkoutsList.length}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {todaysWorkoutsList.map((workout: WorkoutWithExercises) => (
              <WorkoutCard
                key={workout.id}
                workout={workout}
                onDelete={handleDeleteWorkout}
              />
            ))}
          </div>
        </div>
      )}

      {/* Other Workouts Section */}
      {otherWorkouts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground">
            {todaysWorkoutsList.length > 0 ? 'Other Days' : 'All'} Workouts
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherWorkouts.map((workout: WorkoutWithExercises) => (
              <WorkoutCard
                key={workout.id}
                workout={workout}
                onDelete={handleDeleteWorkout}
              />
            ))}
          </div>
        </div>
      )}

      {/* Add Workout Modal */}
      <AddWorkoutForm
        asModal={true}
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSave={toggleAddModal}
      />
    </div>
  )
}
