export default function WorkoutMetricCard({ title, value }: WorkoutMetrics) {
  return (
    <div className='flex flex-col gap-0.5 rounded-lg bg-muted/50 px-3 py-2'>
      <span className='text-[11px] font-medium text-muted-foreground uppercase tracking-wider'>
        {title}
      </span>
      <span className='text-sm font-semibold'>{value}</span>
    </div>
  )
}
