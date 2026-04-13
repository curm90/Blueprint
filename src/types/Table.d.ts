type ExerciseProgress = {
  exerciseTitle: string
  workoutTitle: string
  currentWeight: number
  startingWeight: number
  weightUnit: string
  progressPercentage: number
  progressWeight: number
}

type DataTableProps<TData, TValue> = {
  columns: import('@tanstack/react-table').ColumnDef<TData, TValue>[]
  data: TData[]
}
