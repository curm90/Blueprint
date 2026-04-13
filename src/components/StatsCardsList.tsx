import { Calendar, Trophy, Flame, Target } from 'lucide-react'
import StatsRowSkeleton from './StatsRowSkeleton'
import StatsCard from './StatsCard'

export default function StatsCardsList({
  stats,
  todaysWorkouts,
  completedWorkoutIds,
}: StatsCardsListProps) {
  const statCards = [
    {
      label: 'Current Streak',
      value: stats.data?.streak ?? 0,
      suffix: stats.data?.streak === 1 ? 'day' : 'days',
      icon: <Flame className='size-4' />,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
    },
    {
      label: 'This Week',
      value: stats.data?.thisWeekCompletions ?? 0,
      suffix: 'sessions',
      icon: <Calendar className='size-4' />,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      label: 'Total Completions',
      value: stats.data?.totalCompletions ?? 0,
      suffix: 'all time',
      icon: <Trophy className='size-4' />,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
    },
    {
      label: "Today's Progress",
      value: todaysWorkouts ? `${completedWorkoutIds.size}/${todaysWorkouts.length}` : '0/0',
      suffix: 'workouts',
      icon: <Target className='size-4' />,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
  ]

  return stats.isLoading ? (
    <StatsRowSkeleton />
  ) : (
    <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
      {statCards.map((stat) => (
        <StatsCard key={stat.label} {...stat} />
      ))}
    </div>
  )
}
