import { convexQuery } from '@convex-dev/react-query'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table'
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
  columnHelper.accessor('currentWeight', {
    header: 'Current Weight',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('startingWeight', {
    header: 'Starting Weight',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('weightUnit', {
    header: 'Weight Unit',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('progressPercentage', {
    header: 'Progress %',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('progressWeight', {
    header: 'Progress Weight',
    cell: (info) => info.getValue(),
  }),
]

function RouteComponent() {
  const { data: workouts } = useQuery(convexQuery(api.workouts.listWorkouts))

  console.log({ workouts })

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
            progressPercentage: `${Math.round(
              ((exercise.weight - exercise.startingWeight) / exercise.startingWeight) * 100,
            )}% ${exercise.weight > exercise.startingWeight ? 'increase' : 'decrease'}`,
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
