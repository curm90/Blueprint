import { Card, CardContent } from '../ui/card'
import { Separator } from '../ui/separator'
import TrackWorkoutForm from '../TrackWorkoutForm'
import WorkoutCardHeader from './WorkoutCardHeader'
import WorkoutSchedulePills from './WorkoutSchedulePills'
import WorkoutExerciseList from './WorkoutExerciseList'
import WorkoutMetricsCardList from './WorkoutMetricsCardList'
import WorkoutCardFooter from './WorkoutCardFooter'

export default function WorkoutCard(props: WorkoutCardProps) {
  const { variant, model } = props
  const { workout } = model
  const showDetails = variant === 'track' || props.isExpanded

  return (
    <Card
      className={`transition-all ${variant === 'track' && model.isCompleted ? 'opacity-60 ring-emerald-500/30' : ''}`}
    >
      {variant === 'track' ? (
        <WorkoutCardHeader
          variant='track'
          isCompleted={model.isCompleted}
          title={workout.title}
          exerciseCount={workout.exercises.length}
          weightUnit={workout.weightUnit}
        />
      ) : (
        <WorkoutCardHeader
          variant='manage'
          workoutId={workout._id}
          isExpanded={props.isExpanded}
          onToggleExpand={props.onToggleExpand}
          title={workout.title}
          exerciseCount={workout.exercises.length}
          weightUnit={workout.weightUnit}
          selectedDays={workout.selectedDays}
          exercises={workout.exercises}
        />
      )}

      {showDetails && (
        <>
          <Separator />

          <CardContent className='flex flex-col gap-4'>
            {variant === 'track' ? (
              <WorkoutMetricsCardList data={model.workoutMetricData} />
            ) : (
              <WorkoutSchedulePills selectedDays={workout.selectedDays} />
            )}
            <WorkoutExerciseList workout={workout} />
            {variant === 'track' && !model.isCompleted && <TrackWorkoutForm workout={workout} />}
          </CardContent>
        </>
      )}

      <WorkoutCardFooter
        lastCompleted={model.lastCompleted}
        completionCount={model.completionCount}
        totalWeightProgress={model.totalWeightProgress}
        weightUnit={workout.weightUnit}
      />
    </Card>
  )
}
