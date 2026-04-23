import { ChevronDown } from 'lucide-react'
import { EditWorkoutForm } from '../CreateWorkoutForm'
import DeleteWorkoutDialog from '../DeleteWorkoutDialog'

export default function WorkoutCardHeaderOptions({
  workoutId,
  title,
  weightUnit,
  isExpanded,
  selectedDays,
  exercises,
}: WorkoutCardHeaderOptions) {
  return (
    <div className='flex items-center gap-2'>
      <div className='flex items-center gap-1 sm:gap-2' onClick={(e) => e.stopPropagation()}>
        <EditWorkoutForm
          workoutId={workoutId}
          initialData={{
            title,
            selectedDays,
            weightUnit,
            exercises,
          }}
        />
        <DeleteWorkoutDialog workoutId={workoutId} />
      </div>
      <ChevronDown
        className={`size-4 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`}
      />
    </div>
  )
}
