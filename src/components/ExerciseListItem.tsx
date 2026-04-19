export default function ExerciseListItem({
  title,
  weight,
  weightUnit,
  sets,
  minReps,
  maxReps,
}: ExerciseListItemProps) {
  return (
    <li
      key={title}
      className='flex items-center justify-between rounded-lg border border-border/50 px-3 py-2.5'
    >
      <h4 className='text-sm font-medium'>{title}</h4>
      <div className='flex items-center gap-2 text-sm'>
        <span className='rounded-md bg-primary/10 px-2 py-0.5 font-semibold text-primary'>
          {weight} {weightUnit}
        </span>
        <span className='text-muted-foreground'>{`${sets} sets`}</span>
        <span className='text-muted-foreground'>
          {minReps}-{maxReps} reps
        </span>
      </div>
    </li>
  )
}
