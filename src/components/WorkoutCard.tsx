import { Card, CardContent, CardFooter } from './ui/card'
import { Separator } from './ui/separator'
import MiniMetricsCardList from './MiniMetricsCardList'
import ExerciseListItem from './ExerciseListItem'
import TrackWorkoutForm from './TrackWorkoutForm'
import WorkoutCardHeader from './WorkoutCard/WorkoutCardHeader'

export default function WorkoutCard({
  workout,
  isCompleted,
  lastCompleted,
  miniMetricData,
}: WorkoutCardProps) {
  return (
    <Card className={`transition-all ${isCompleted ? 'opacity-60 ring-emerald-500/30' : ''}`}>
      <WorkoutCardHeader
        variant='track'
        isCompleted={isCompleted}
        title={workout.title}
        exerciseCount={workout.exercises.length}
        weightUnit={workout.weightUnit}
      />

      <Separator />

      <CardContent className='flex flex-col gap-4'>
        {/* Mini metrics row */}
        <MiniMetricsCardList data={miniMetricData} />

        {/* Exercise list */}
        <ul className='flex flex-col gap-2'>
          {workout.exercises.map((exercise) => (
            <ExerciseListItem
              key={exercise.id}
              title={exercise.exerciseTitle}
              weight={exercise.weight}
              weightUnit={workout.weightUnit}
              sets={exercise.sets}
              minReps={exercise.minReps}
              maxReps={exercise.maxReps}
            />
          ))}
        </ul>

        {!isCompleted && <TrackWorkoutForm workout={workout} />}
      </CardContent>

      {lastCompleted && (
        <CardFooter>
          <span className='text-xs text-muted-foreground'>
            Last completed{' '}
            {new Date(lastCompleted).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </CardFooter>
      )}
    </Card>
  )
}
