import { type ColumnDef } from '@tanstack/react-table'
import { fireEvent, render, screen } from '@testing-library/react'
import ProgressTable from '~/components/ProgressTable'

function SortableHeader({ column, label }: { column: any; label: string }) {
  const sorted = column.getIsSorted()
  return (
    <button onClick={() => column.toggleSorting(sorted === 'asc')}>
      {label}
      {sorted === 'asc' && <span aria-label='sorted ascending' />}
      {sorted === 'desc' && <span aria-label='sorted descending' />}
      {!sorted && <span aria-label='not sorted' />}
    </button>
  )
}

const columns: ColumnDef<ExerciseProgress, string>[] = [
  {
    accessorKey: 'exerciseTitle',
    header: ({ column }) => <SortableHeader column={column} label='Exercise' />,
  },
  { accessorKey: 'workoutTitle', header: 'Workout' },
]

const data: ExerciseProgress[] = [
  {
    exerciseTitle: 'Bench Press',
    workoutTitle: 'Push Day',
    currentWeight: 100,
    startingWeight: 80,
    weightUnit: 'kg',
    progressPercentage: 25,
    progressWeight: 20,
  },
  {
    exerciseTitle: 'Squat',
    workoutTitle: 'Leg Day',
    currentWeight: 100,
    startingWeight: 80,
    weightUnit: 'kg',
    progressPercentage: 25,
    progressWeight: 20,
  },
]

describe('ProgressTable', () => {
  it('should render a search input with correct placeholder', () => {
    render(<ProgressTable columns={columns} data={data} />)

    const searchInput = screen.getByPlaceholderText(/search by exercise/i)
    expect(searchInput).toBeInTheDocument()
  })

  it('should render a table row for each exercise progress entry', () => {
    render(<ProgressTable columns={columns} data={data} />)

    const rows = screen.getAllByRole('row')
    // 1 header row + 2 data rows
    expect(rows).toHaveLength(3)
  })

  it('should render the correct column headers', () => {
    render(<ProgressTable columns={columns} data={data} />)

    expect(screen.getByRole('columnheader', { name: /exercise/i })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /workout/i })).toBeInTheDocument()
  })

  it('should render the "No results" message when there is no data to show', () => {
    render(<ProgressTable columns={columns} data={[]} />)

    expect(screen.getByText(/no results/i)).toBeInTheDocument()
  })

  it('should filter and display the correct rows when searching by exercise title', () => {
    render(<ProgressTable columns={columns} data={data} />)

    const searchInput = screen.getByPlaceholderText(/search by exercise/i)
    fireEvent.change(searchInput, { target: { value: 'bench' } })

    expect(screen.getByText(/bench press/i)).toBeInTheDocument()
    expect(screen.queryByText(/squat/i)).not.toBeInTheDocument()
  })

  it('should show all results when search input is cleared', () => {
    render(<ProgressTable columns={columns} data={data} />)

    const searchInput = screen.getByPlaceholderText(/search by exercise/i)
    fireEvent.change(searchInput, { target: { value: 'bench' } })
    fireEvent.change(searchInput, { target: { value: '' } })

    expect(screen.getByText(/bench press/i)).toBeInTheDocument()
    expect(screen.getByText(/squat/i)).toBeInTheDocument()
  })

  it('cycles sort icon through not sorted → ascending → descending on repeated clicks', () => {
    render(<ProgressTable columns={columns} data={data} />)

    // Initially unsorted
    expect(screen.getByLabelText('not sorted')).toBeInTheDocument()

    const sortButton = screen.getByRole('button', { name: /exercise/i })

    // First click → ascending
    fireEvent.click(sortButton)
    expect(screen.getByLabelText('sorted ascending')).toBeInTheDocument()

    // Second click → descending
    fireEvent.click(sortButton)
    expect(screen.getByLabelText('sorted descending')).toBeInTheDocument()
  })

  it('sorts rows ascending on first click, descending on second click', () => {
    render(<ProgressTable columns={columns} data={data} />)

    const sortButton = screen.getByRole('button', { name: /exercise/i })

    // First click → A-Z
    fireEvent.click(sortButton)
    let rows = screen.getAllByRole('row')
    expect(rows[1]).toHaveTextContent(/bench press/i)
    expect(rows[2]).toHaveTextContent(/squat/i)

    // Second click → Z-A
    fireEvent.click(sortButton)
    rows = screen.getAllByRole('row')
    expect(rows[1]).toHaveTextContent(/squat/i)
    expect(rows[2]).toHaveTextContent(/bench press/i)
  })
})
