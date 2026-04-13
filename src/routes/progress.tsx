import { convexQuery } from '@convex-dev/react-query'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { api } from 'convex/_generated/api'
import PageTitle from '~/components/PageTitle'
import ProgressTable from '~/components/ProgressTable'
import ProgressTableSkeleton from '~/components/ProgressTableSkeleton'

export const Route = createFileRoute('/progress')({
  component: RouteComponent,
})

const columnHelper = createColumnHelper<ExerciseProgress>()
const columns: ColumnDef<ExerciseProgress, any>[] = [
  columnHelper.accessor('exerciseTitle', {
    header: 'Exercise',
    cell: (info) => <span className='font-medium'>{info.getValue()}</span>,
  }),
  columnHelper.accessor('workoutTitle', {
    header: 'Workout',
    cell: (info) => (
      <span className='text-muted-foreground'>{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor('startingWeight', {
    header: 'Start',
    cell: (info) => (
      <span>
        {info.getValue()} {info.row.original.weightUnit}
      </span>
    ),
  }),
  columnHelper.accessor('currentWeight', {
    header: 'Current',
    cell: (info) => (
      <span className='font-semibold'>
        {info.getValue()} {info.row.original.weightUnit}
      </span>
    ),
  }),
  columnHelper.accessor('progressWeight', {
    header: 'Change',
    cell: (info) => {
      const value = info.getValue()
      const unit = info.row.original.weightUnit
      if (value > 0) {
        return (
          <span className='inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600'>
            <TrendingUp className='size-3' />+{value} {unit}
          </span>
        )
      }
      if (value < 0) {
        return (
          <span className='inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-500'>
            <TrendingDown className='size-3' />{value} {unit}
          </span>
        )
      }
      return <span className='text-muted-foreground text-xs'>—</span>
    },
  }),
  columnHelper.accessor('progressPercentage', {
    header: '%',
    cell: (info) => {
      const value = info.getValue()
      if (value > 0) {
        return <span className='text-xs font-medium text-emerald-600'>+{value}%</span>
      }
      if (value < 0) {
        return <span className='text-xs font-medium text-red-500'>{value}%</span>
      }
      return <span className='text-muted-foreground text-xs'>0%</span>
    },
  }),
]

function RouteComponent() {
  const { data: exercises, isPending } = useQuery(convexQuery(api.exercises.listExerciseProgress))

  return (
    <div className='p-8 flex flex-col gap-10 min-h-[calc(100vh-66px)] max-w-250 mx-auto'>
      <PageTitle title='Progress' subtitle='Track your workout history and progress over time.' />

      {isPending ? (
        <ProgressTableSkeleton />
      ) : (
        <ProgressTable columns={columns} data={exercises ?? []} />
      )}
    </div>
  )
}
