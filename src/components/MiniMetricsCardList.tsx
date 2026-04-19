import MiniMetricCard from './MiniMetricCard'

type MiniMetricsDataProps = {
  data: {
    title: string
    value: number
  }[]
}

export default function MiniMetricsCardList({ data }: MiniMetricsDataProps) {
  return (
    <div className='grid grid-cols-3 gap-3'>
      {data.map((metric) => (
        <MiniMetricCard key={metric.title} title={metric.title} value={metric.value} />
      ))}
    </div>
  )
}
