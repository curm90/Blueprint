import { useSuspenseQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { api } from 'convex/_generated/api'
import { Card, CardContent } from '../ui/card'
import { Separator } from '../ui/separator'
import TrackWorkoutForm from '../TrackWorkoutForm'
import WorkoutCardHeader from './WorkoutCardHeader'
import WorkoutExerciseList from './WorkoutExerciseList'
import WorkoutMetricsCardList from './WorkoutMetricsCardList'
import WorkoutCardFooter from './WorkoutCardFooter'

export default function WorkoutCard({
  workout,
  isCompleted,
  lastCompleted,
  workoutMetricData,
}: WorkoutCardProps) {
  const { data: stats } = useSuspenseQuery(convexQuery(api.workoutCompletions.getWorkoutStats, {}))

  const completionCount = stats?.completionsByWorkout[workout._id as string] ?? 0
  const totalWeightProgress = workout.exercises.reduce(
    (sum, ex) => sum + (ex.weight - ex.startingWeight),
    0,
  )

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
        <WorkoutMetricsCardList data={workoutMetricData} />
        <WorkoutExerciseList workout={workout} />
        {!isCompleted && <TrackWorkoutForm workout={workout} />}
      </CardContent>

      <WorkoutCardFooter
        lastCompleted={lastCompleted}
        completionCount={completionCount}
        totalWeightProgress={totalWeightProgress}
        weightUnit={workout.weightUnit}
      />
    </Card>
  )
}
