import WorkoutMetricCard from './WorkoutMetricCard'

export default function WorkoutMetricsCardList({ data }: { data: WorkoutMetrics[] }) {
  return (
    <div className='grid grid-cols-3 gap-3'>
      {data.map((metric) => (
        <WorkoutMetricCard key={metric.title} title={metric.title} value={metric.value} />
      ))}
    </div>
  )
}
