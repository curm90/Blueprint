import { CardHeader } from '../ui/card'
import { Dumbbell } from 'lucide-react'
import DoneBadge from '../DoneBadge'
import ManageOptions from './WorkoutCardHeaderOptions'

export default function WorkoutCardHeader(props: WorkoutCardHeaderProps) {
  const { title, exerciseCount, weightUnit, variant } = props
  return (
    <CardHeader
      className={variant === 'manage' ? 'cursor-pointer' : ''}
      onClick={variant === 'manage' ? props.onToggleExpand : undefined}
    >
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div
            className={`rounded-lg p-2 ${variant === 'track' && props.isCompleted ? 'bg-emerald-500/10' : 'bg-primary/10'}`}
          >
            <Dumbbell
              className={`size-5 ${variant === 'track' && props.isCompleted ? 'text-emerald-500' : 'text-primary'}`}
            />
          </div>
          <div>
            <h3 className='text-lg font-semibold'>{title}</h3>
            <p className='text-xs text-muted-foreground'>
              {exerciseCount} exercises &middot; {weightUnit}
            </p>
          </div>
        </div>
        {variant === 'track' && props.isCompleted && <DoneBadge />}
        {variant === 'manage' && (
          <ManageOptions
            workoutId={props.workoutId}
            title={title}
            weightUnit={weightUnit}
            isExpanded={props.isExpanded}
            selectedDays={props.selectedDays}
            exercises={props.exercises}
          />
        )}
      </div>
    </CardHeader>
  )
}
