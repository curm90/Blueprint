import { CheckCircle, Dumbbell } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from './ui/card'
import { Separator } from './ui/separator'
import MiniMetricsCardList from './MiniMetricsCardList'
import ExerciseListItem from './ExerciseListItem'
import TrackWorkoutForm from './TrackWorkoutForm'

export default function WorkoutCard({
  workout,
  isCompleted,
  lastCompleted,
  miniMetricData,
}: WorkoutCardProps) {
  return (
    <Card
      key={workout._id}
      className={`transition-all ${isCompleted ? 'opacity-60 ring-emerald-500/30' : ''}`}
    >
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div
              className={`rounded-lg p-2 ${isCompleted ? 'bg-emerald-500/10' : 'bg-primary/10'}`}
            >
              <Dumbbell className={`size-5 ${isCompleted ? 'text-emerald-500' : 'text-primary'}`} />
            </div>
            <div>
              <h3 className='text-lg font-semibold'>{workout.title}</h3>
              <p className='text-xs text-muted-foreground'>
                {workout.exercises.length} exercises &middot; {workout.weightUnit}
              </p>
            </div>
          </div>
          {isCompleted && (
            <div className='flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1'>
              <CheckCircle className='size-3.5 text-emerald-500' />
              <span className='text-xs font-medium text-emerald-500'>Done</span>
            </div>
          )}
        </div>
      </CardHeader>

      <Separator />

      <CardContent className='flex flex-col gap-4'>
        {/* Mini metrics row */}
        <MiniMetricsCardList data={miniMetricData} />

        {/* Exercise list */}
        <ul className='flex flex-col gap-2'>
          {workout.exercises.map((exercise) => (
            <ExerciseListItem
              key={exercise.exerciseTitle}
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
