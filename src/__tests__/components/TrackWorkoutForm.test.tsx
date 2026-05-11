import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import TrackWorkoutForm from '~/components/TrackWorkoutForm'

const mockMutateAsync = vi.hoisted(() => vi.fn().mockResolvedValue(undefined))
const mockToastSuccess = vi.hoisted(() => vi.fn())
const mockToastError = vi.hoisted(() => vi.fn())

const workout: WorkoutWithId = {
  _id: { __tableName: 'workouts' } as any,
  title: 'Test Workout',
  selectedDays: ['Monday', 'Wednesday'],
  weightUnit: 'kg',
  exercises: [
    {
      id: 'exercise1',
      exerciseTitle: 'Squat',
      startingWeight: 100,
      weight: 100,
      minReps: 5,
      maxReps: 10,
      sets: 3,
    },
    {
      id: 'exercise2',
      exerciseTitle: 'Bench Press',
      startingWeight: 80,
      weight: 80,
      minReps: 5,
      maxReps: 10,
      sets: 3,
    },
  ],
}

vi.mock('convex/_generated/api', () => ({
  api: {
    workoutCompletions: {
      trackWorkout: vi.fn(),
    },
  },
}))

vi.mock('@convex-dev/react-query', () => ({
  useConvexMutation: () => mockMutateAsync,
}))

vi.mock('@tanstack/react-query', () => ({
  useMutation: ({ mutationFn }: { mutationFn: any }) => ({
    mutateAsync: mutationFn,
  }),
}))

vi.mock('sonner', () => ({
  toast: {
    success: mockToastSuccess,
    error: mockToastError,
  },
}))

describe('TrackWorkoutForm', () => {
  it('should render the dialog trigger button and dialog should not be visible initially', () => {
    render(<TrackWorkoutForm workout={workout} />)

    const triggerBtn = screen.getByRole('button', { name: /track workout/i })
    expect(triggerBtn).toBeInTheDocument()

    const dialog = screen.queryByRole('dialog')
    expect(dialog).not.toBeInTheDocument()
  })

  it('should open the dialog when trigger button is clicked', async () => {
    render(<TrackWorkoutForm workout={workout} />)

    const triggerBtn = screen.getByRole('button', { name: /track workout/i })
    await userEvent.click(triggerBtn)

    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
  })

  it('should display the correct content in the dialog on initial render', async () => {
    render(<TrackWorkoutForm workout={workout} />)

    const triggerBtn = screen.getByRole('button', { name: /track workout/i })
    await userEvent.click(triggerBtn)

    const dialogTitle = screen.getByRole('heading', { name: /test workout/i })
    expect(dialogTitle).toBeInTheDocument()
    const exerciseTitle = screen.getByText(/squat/i)
    expect(exerciseTitle).toBeInTheDocument()
  })

  it('should render "next exercise" button as disabled when no option is selected', async () => {
    render(<TrackWorkoutForm workout={workout} />)

    const triggerBtn = screen.getByRole('button', { name: /track workout/i })
    await userEvent.click(triggerBtn)

    const nextBtn = screen.getByRole('button', { name: /next exercise/i })
    expect(nextBtn).toBeDisabled()
  })

  it('should enable "next exercise" button when an option is selected', async () => {
    render(<TrackWorkoutForm workout={workout} />)

    const triggerBtn = screen.getByRole('button', { name: /track workout/i })
    await userEvent.click(triggerBtn)

    const optionBtn = screen.getByRole('button', { name: /just right/i })
    await userEvent.click(optionBtn)

    const nextBtn = screen.getByRole('button', { name: /next exercise/i })
    expect(nextBtn).toBeEnabled()
  })

  it('should update progress bar correctly when progressing through exercises and render finish workout btn', async () => {
    render(<TrackWorkoutForm workout={workout} />)

    const triggerBtn = screen.getByRole('button', { name: /track workout/i })
    await userEvent.click(triggerBtn)

    const optionBtn = screen.getByRole('button', { name: /just right/i })
    const nextBtn = screen.getByRole('button', { name: /next exercise/i })

    let progressBar = screen.getByTestId('progress-bar')
    expect(progressBar).toHaveStyle({ width: '50%' }) // initial progress for first exercise

    await userEvent.click(optionBtn)
    await userEvent.click(nextBtn)

    progressBar = screen.getByTestId('progress-bar')
    expect(progressBar).toHaveStyle({ width: '100%' }) // progress after completing first exercise

    const finishBtn = screen.getByRole('button', { name: /finish workout/i })
    expect(finishBtn).toBeInTheDocument()
  })

  it('should call mutateAsync with the correct payload on finish', async () => {
    render(<TrackWorkoutForm workout={workout} />)

    await userEvent.click(screen.getByRole('button', { name: /track workout/i }))

    // Complete first exercise
    await userEvent.click(screen.getByRole('button', { name: /just right/i }))
    await userEvent.click(screen.getByRole('button', { name: /next exercise/i }))

    // Complete second exercise and submit
    await userEvent.click(screen.getByRole('button', { name: /too easy/i }))
    await userEvent.click(screen.getByRole('button', { name: /finish workout/i }))

    expect(mockMutateAsync).toHaveBeenCalledWith({
      workoutId: workout._id,
      results: [
        { id: 'exercise1', exerciseTitle: 'Squat', feedback: 'just-right' },
        { id: 'exercise2', exerciseTitle: 'Bench Press', feedback: 'too-easy' },
      ],
    })
  })

  it('should show success toast and reset form on successful submission', async () => {
    render(<TrackWorkoutForm workout={workout} />)

    await userEvent.click(screen.getByRole('button', { name: /track workout/i }))

    // Complete first exercise
    await userEvent.click(screen.getByRole('button', { name: /just right/i }))
    await userEvent.click(screen.getByRole('button', { name: /next exercise/i }))

    // Complete second exercise and submit
    await userEvent.click(screen.getByRole('button', { name: /too easy/i }))
    await userEvent.click(screen.getByRole('button', { name: /finish workout/i }))

    expect(mockToastSuccess).toHaveBeenCalledWith('Workout tracked successfully!')

    // Check if form is reset (dialog should be closed)
    const dialog = screen.queryByRole('dialog')
    expect(dialog).not.toBeInTheDocument()
  })

  it('should show error toast on submission failure', async () => {
    mockMutateAsync.mockRejectedValueOnce(new Error('Submission failed'))

    render(<TrackWorkoutForm workout={workout} />)

    await userEvent.click(screen.getByRole('button', { name: /track workout/i }))

    // Complete first exercise
    await userEvent.click(screen.getByRole('button', { name: /just right/i }))
    await userEvent.click(screen.getByRole('button', { name: /next exercise/i }))

    // Complete second exercise and submit
    await userEvent.click(screen.getByRole('button', { name: /too easy/i }))
    await userEvent.click(screen.getByRole('button', { name: /finish workout/i }))

    expect(mockToastError).toHaveBeenCalledWith('Failed to track workout. Please try again.')
  })
})
