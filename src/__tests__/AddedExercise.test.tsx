import { fireEvent, render, screen } from '@testing-library/react'
import AddedExercise from '~/components/AddedExercise'

function makeExercise(overrides: Partial<Exercise> = {}): Exercise {
  return {
    id: '1',
    exerciseTitle: 'Bench Press',
    startingWeight: 100,
    weight: 120,
    minReps: 8,
    maxReps: 12,
    sets: 3,
    ...overrides,
  }
}

function makeProps(overrides: Partial<AddedExerciseProps> = {}): AddedExerciseProps {
  return {
    exercise: makeExercise(),
    weightUnit: 'kg',
    removeExercise: vi.fn(),
    ...overrides,
  }
}

describe('AddedExercise', () => {
  it('renders the exercise details correctly', () => {
    const props = makeProps()

    render(<AddedExercise {...props} />)
    const titleElement = screen.getByText('Bench Press')
    const detailsElement = screen.getByText('120 kg • 8-12 reps • 3 sets')

    expect(titleElement).toBeInTheDocument()
    expect(detailsElement).toBeInTheDocument()
  })

  it('should render the remove exercise button', () => {
    const props = makeProps()

    render(<AddedExercise {...props} />)
    const removeButton = screen.getByRole('button')

    expect(removeButton).toBeInTheDocument()
  })

  it('should call the remove exercise function when the remove button is clicked', () => {
    const props = makeProps()

    render(<AddedExercise {...props} />)
    const removeButton = screen.getByRole('button')
    fireEvent.click(removeButton)
    expect(props.removeExercise).toHaveBeenCalledTimes(1)
    expect(props.removeExercise).toHaveBeenCalledWith('1')
  })
})
