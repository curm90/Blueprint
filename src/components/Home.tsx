import EmptyOutline from './Empty'
import ExerciseCard from './ExerciseCard'

export default function Home() {
  const exercises = JSON.parse(localStorage.getItem('exercises') || 'null')

  return (
    <div className="mx-auto mt-10 max-w-220 px-10">
      {exercises ? (
        <div>
          <h1 className="text-2xl font-bold mb-4">Today's Workout</h1>
          <div className="grid grid-cols-1 gap-4">
            {exercises.map((exercise: any, index: number) => (
              <ExerciseCard key={index} exercise={exercise} />
            ))}
          </div>
        </div>
      ) : (
        <EmptyOutline />
      )}
    </div>
  )
}
