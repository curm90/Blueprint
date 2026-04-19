import { convexQuery } from '@convex-dev/react-query'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, TrendingDown, TrendingUp } from 'lucide-react'
import { api } from 'convex/_generated/api'
import PageTitle from '~/components/PageTitle'
import ProgressTable from '~/views/ProgressTable'
import { Button } from '~/components/ui/button'

export const Route = createFileRoute('/progress')({
  component: RouteComponent,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(convexQuery(api.exercises.listExerciseProgress, {}))
  },
})

const columnHelper = createColumnHelper<ExerciseProgress>()

const columns: ColumnDef<ExerciseProgress, any>[] = [
  columnHelper.accessor('exerciseTitle', {
    header: ({ column }) => (
      <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Exercise
        <ArrowUpDown className='h-4 w-4' />
      </Button>
    ),
    cell: (info) => <span className='font-medium'>{info.getValue()}</span>,
  }),
  columnHelper.accessor('workoutTitle', {
    header: ({ column }) => (
      <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Workout
        <ArrowUpDown className='h-4 w-4' />
      </Button>
    ),
    cell: (info) => <span className='text-muted-foreground'>{info.getValue()}</span>,
  }),
  columnHelper.accessor('startingWeight', {
    header: ({ column }) => (
      <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Start
        <ArrowUpDown className='h-4 w-4' />
      </Button>
    ),
    cell: (info) => (
      <span>
        {info.getValue()} {info.row.original.weightUnit}
      </span>
    ),
  }),
  columnHelper.accessor('currentWeight', {
    header: ({ column }) => (
      <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Current
        <ArrowUpDown className='h-4 w-4' />
      </Button>
    ),
    cell: (info) => (
      <span className='font-semibold'>
        {info.getValue()} {info.row.original.weightUnit}
      </span>
    ),
  }),
  columnHelper.accessor('progressWeight', {
    header: ({ column }) => (
      <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Change
        <ArrowUpDown className='h-4 w-4' />
      </Button>
    ),
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
            <TrendingDown className='size-3' />
            {value} {unit}
          </span>
        )
      }
      return <span className='text-muted-foreground text-xs'>—</span>
    },
  }),
  columnHelper.accessor('progressPercentage', {
    header: ({ column }) => (
      <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        %
        <ArrowUpDown className='h-4 w-4' />
      </Button>
    ),
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
  const { data: exercises } = useSuspenseQuery(convexQuery(api.exercises.listExerciseProgress, {}))

  return (
    <>
      <PageTitle title='Progress' subtitle='Track your workout history and progress over time.' />
      <ProgressTable columns={columns} data={exercises ?? []} />
    </>
  )
}
