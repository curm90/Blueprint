export default function ExerciseCard() {
  const exercise = {
    name: 'Bench Press',
    targetWeight: 100,
    unit: 'lbs',
    targetReps: [8, 12],
  }
  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-bold">{exercise.name}</h3>
      <p>
        {exercise.targetWeight}
        {exercise.unit} × {exercise.targetReps[0]}-{exercise.targetReps[1]} reps
      </p>
    </div>
  )
}
