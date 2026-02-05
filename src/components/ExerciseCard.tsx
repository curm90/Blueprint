import { Button } from './ui/button'

export default function ExerciseCard({ exercise }: any) {
  console.log({ exercise })

  return (
    <div className="border rounded-lg p-4 w-full flex flex-col items-start">
      <h3 className="font-bold text-lg">{exercise.name}</h3>
      <p>
        {exercise.targetWeight}
        {exercise.unit} × {exercise.minReps}-{exercise.maxReps} reps
      </p>
      <Button className="mt-6">Log Today's Session</Button>
    </div>
  )
}
