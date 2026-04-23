import WorkoutCard from './WorkoutCard'

export default function WorkoutCardList({ workoutCards }: WorkoutCardListProps) {
  return (
    <div className='flex flex-col gap-4'>
      {workoutCards.map((model) => {
        return <WorkoutCard key={model.workout._id} variant='track' model={model} />
      })}
    </div>
  )
}
