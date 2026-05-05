import { render, screen } from '@testing-library/react'
import StatsCardsList from '~/components/StatsCardsList'

vi.mock('~/components/StatsCard', () => ({
  default: ({
    label,
    value,
    suffix,
  }: {
    label: string
    value: string | number
    suffix: string
  }) => (
    <div>
      <span>{label}</span>
      <span data-testid='value'>{value}</span>
      <span>{suffix}</span>
    </div>
  ),
}))

function makeStats(overrides: Partial<StatsData> = {}): StatsData {
  return {
    streak: 3,
    thisWeekCompletions: 2,
    totalCompletions: 10,
    completionsByWorkout: {},
    lastCompletedByWorkout: {},
    ...overrides,
  }
}

function makeProps(overrides: Partial<StatsCardsListProps> = {}): StatsCardsListProps {
  return {
    stats: makeStats(),
    todaysWorkouts: [],
    completedWorkoutIds: new Set(),
    ...overrides,
  }
}

describe('StatsCardsList', () => {
  it('renders all 4 stat card labels', () => {
    render(<StatsCardsList {...makeProps()} />)

    expect(screen.getByText(/streak/i)).toBeInTheDocument()
    expect(screen.getByText(/week/i)).toBeInTheDocument()
    expect(screen.getByText(/completions/i)).toBeInTheDocument()
    expect(screen.getByText(/progress/i)).toBeInTheDocument()
  })

  it('falls back to 0 when streak, thisWeekCompletions, and totalCompletions are undefined', () => {
    render(
      <StatsCardsList
        {...makeProps({
          stats: makeStats({
            streak: undefined,
            thisWeekCompletions: undefined,
            totalCompletions: undefined,
          }),
        })}
      />,
    )

    const values = screen.getAllByTestId('value')
    expect(values[0]).toHaveTextContent('0') // Current Streak
    expect(values[1]).toHaveTextContent('0') // This Week
    expect(values[2]).toHaveTextContent('0') // Total Completions
  })

  it('renders "day" suffix when streak is 1', () => {
    render(<StatsCardsList {...makeProps({ stats: makeStats({ streak: 1 }) })} />)

    expect(screen.getByText('day')).toBeInTheDocument()
  })

  it('renders "days" suffix when streak is not 1', () => {
    render(<StatsCardsList {...makeProps({ stats: makeStats({ streak: 5 }) })} />)

    expect(screen.getByText('days')).toBeInTheDocument()
  })

  it('renders "0/0" for today\'s progress when todaysWorkouts is undefined', () => {
    render(<StatsCardsList {...makeProps({ todaysWorkouts: undefined })} />)

    const values = screen.getAllByTestId('value')
    expect(values[3]).toHaveTextContent('0/0') // Today's Progress
  })

  it("renders correct today's progress when some workouts are completed", () => {
    const workouts = [{ _id: 'w1' }, { _id: 'w2' }, { _id: 'w3' }] as WorkoutWithId[]
    const completedWorkoutIds = new Set(['w1', 'w2'] as unknown as WorkoutId[])

    render(<StatsCardsList {...makeProps({ todaysWorkouts: workouts, completedWorkoutIds })} />)

    const values = screen.getAllByTestId('value')
    expect(values[3]).toHaveTextContent('2/3')
  })

  it("renders correct today's progress when all workouts are completed", () => {
    const workouts = [{ _id: 'w1' }, { _id: 'w2' }] as WorkoutWithId[]
    const completedWorkoutIds = new Set(['w1', 'w2'] as unknown as WorkoutId[])

    render(<StatsCardsList {...makeProps({ todaysWorkouts: workouts, completedWorkoutIds })} />)

    const values = screen.getAllByTestId('value')
    expect(values[3]).toHaveTextContent('2/2')
  })
})
