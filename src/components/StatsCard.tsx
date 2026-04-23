import { Card, CardContent } from './ui/card'

export default function StatsCard({ label, value, suffix, icon, color, bg }: StatsCardProps) {
  return (
    <Card size='sm'>
      <CardContent className='flex flex-col gap-1'>
        <div className='flex items-center gap-2'>
          <div className={`rounded-md p-1.5 ${bg}`}>
            <span className={color}>{icon}</span>
          </div>
          <span className='text-xs text-muted-foreground'>{label}</span>
        </div>
        <div className='flex items-baseline gap-1.5 pl-0.5'>
          <span className='text-2xl font-bold tracking-tight'>{value}</span>
          <span className='text-xs text-muted-foreground'>{suffix}</span>
        </div>
      </CardContent>
    </Card>
  )
}
