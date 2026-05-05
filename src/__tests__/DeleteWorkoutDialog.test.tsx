import { fireEvent, render, screen } from '@testing-library/react'
import DeleteWorkoutDialog from '~/components/DeleteWorkoutDialog'

const mockMutate = vi.hoisted(() => vi.fn())
let mockIsPending = false

vi.mock('@tanstack/react-query', () => ({
  useMutation: () => ({
    mutate: mockMutate,
    get isPending() {
      return mockIsPending
    },
  }),
}))

vi.mock('@convex-dev/react-query', () => ({
  useConvexMutation: (fn: any) => fn,
}))

beforeEach(() => {
  mockIsPending = false
  mockMutate.mockClear()
})

describe('DeleteWorkoutDialog', () => {
  it('renders the Trigger button', () => {
    render(<DeleteWorkoutDialog workoutId={{ __tableName: 'workouts' } as any} />)

    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('opens the dialog when the trigger button is clicked', () => {
    render(<DeleteWorkoutDialog workoutId={{ __tableName: 'workouts' } as any} />)

    const triggerButton = screen.getByRole('button')
    fireEvent.click(triggerButton)

    expect(screen.getByRole('heading', { name: /delete workout/i })).toBeInTheDocument()
    expect(screen.getByText(/Are you sure you want to delete this workout\?/i)).toBeInTheDocument()
  })

  it('renders the Cancel and confirm delete buttons when the dialog is open', () => {
    render(<DeleteWorkoutDialog workoutId={{ __tableName: 'workouts' } as any} />)

    const triggerButton = screen.getByRole('button')
    fireEvent.click(triggerButton)

    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
  })

  it('should close the diaglog when the cancel button is clicked', () => {
    render(<DeleteWorkoutDialog workoutId={{ __tableName: 'workouts' } as any} />)

    const triggerButton = screen.getByRole('button')
    fireEvent.click(triggerButton)

    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    fireEvent.click(cancelButton)

    expect(screen.queryByRole('heading', { name: /delete workout/i })).not.toBeInTheDocument()
  })

  it('should call the delete mutation when the delete button is clicked', () => {
    const workoutId = 'workouts:123' as any
    render(<DeleteWorkoutDialog workoutId={workoutId} />)

    const triggerButton = screen.getByRole('button')
    fireEvent.click(triggerButton)

    const deleteButton = screen.getByRole('button', { name: /delete/i })
    fireEvent.click(deleteButton)

    expect(mockMutate).toHaveBeenCalledWith({ id: workoutId })
  })

  it('should show "Deleting..." when the mutation is pending', () => {
    mockIsPending = true
    render(<DeleteWorkoutDialog workoutId={{ __tableName: 'workouts' } as any} />)

    const triggerButton = screen.getByRole('button')
    fireEvent.click(triggerButton)

    const deleteButton = screen.getByRole('button', { name: /deleting\.\.\./i })
    expect(deleteButton).toBeInTheDocument()
  })
})
