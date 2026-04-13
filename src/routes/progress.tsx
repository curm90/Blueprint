import { convexQuery } from '@convex-dev/react-query'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { api } from 'convex/_generated/api'
import PageTitle from '~/components/PageTitle'
import ProgressTable from '~/components/ProgressTable'

export const Route = createFileRoute('/progress')({
  component: RouteComponent,
})

const columnHelper = createColumnHelper<ExerciseProgress>()
const columns: ColumnDef<ExerciseProgress, any>[] = [
  columnHelper.accessor('exerciseTitle', {
    header: 'Exercise',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('workoutTitle', {
    header: 'Workout',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('startingWeight', {
    header: 'Start',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('currentWeight', {
    header: 'Current',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('progressPercentage', {
    header: 'Change %',
    cell: (info) => {
      const value = info.getValue()
      if (value > 0) {
        return (
          <span className='flex items-center gap-1 text-emerald-600'>
            <TrendingUp className='size-4' />
            {value}%
          </span>
        )
      }
      if (value < 0) {
        return (
          <span className='flex items-center gap-1 text-red-500'>
            <TrendingDown className='size-4' />
            {Math.abs(value)}%
          </span>
        )
      }
      return <span>0%</span>
    },
  }),
  columnHelper.accessor('progressWeight', {
    header: 'Weight Change',
    cell: (info) => {
      const value = info.getValue()
      if (value > 0) {
        return (
          <span className='flex items-center gap-1 text-emerald-600'>
            <TrendingUp className='size-4' />
            {value}
          </span>
        )
      }
      if (value < 0) {
        return (
          <span className='flex items-center gap-1 text-red-500'>
            <TrendingDown className='size-4' />
            {Math.abs(value)}
          </span>
        )
      }
      return <span>0</span>
    },
  }),
  columnHelper.accessor('weightUnit', {
    header: 'Unit',
    cell: (info) => info.getValue(),
  }),
]

function RouteComponent() {
  const { data: workouts } = useQuery(convexQuery(api.workouts.listWorkouts))

  function structureData(workouts: any[]) {
    return workouts
      .map((workout) => {
        return workout.exercises.map((exercise: Exercise) => {
          return {
            exerciseTitle: exercise.exerciseTitle,
            workoutTitle: workout.title,
            weightUnit: workout.weightUnit,
            currentWeight: exercise.weight,
            startingWeight: exercise.startingWeight,
            progressWeight: exercise.weight - exercise.startingWeight,
            progressPercentage: Math.round(
              ((exercise.weight - exercise.startingWeight) / exercise.startingWeight) * 100,
            ),
          }
        })
      })
      .flat()
  }

  const structuredWorkouts = structureData(workouts ?? [])

  return (
    <div className='p-8 flex flex-col gap-10 min-h-[calc(100vh-66px)] max-w-250 mx-auto'>
      <PageTitle title='Progress' subtitle='Track your workout history and progress over time.' />

      <ProgressTable columns={columns} data={structuredWorkouts} />
    </div>
  )
}
