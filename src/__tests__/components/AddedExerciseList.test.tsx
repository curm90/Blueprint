import { render, screen } from '@testing-library/react'
import AddedExerciseList from '~/components/AddedExerciseList'

const mockExercises = [
  {
    id: 'exercise1',
    exerciseTitle: 'Bench Press',
    startingWeight: 100,
    weight: 110,
    minReps: 8,
    maxReps: 12,
    sets: 3,
  },
  {
    id: 'exercise2',
    exerciseTitle: 'Lat Pulldown',
    startingWeight: 60,
    weight: 70,
    minReps: 8,
    maxReps: 12,
    sets: 3,
  },
]

vi.mock('~/components/AddedExercise', () => ({
  default: ({ exercise, weightUnit }: { exercise: Exercise; weightUnit: string }) => (
    <div data-testid='added-exercise'>
      <span>{exercise.exerciseTitle}</span>
      <span>{weightUnit}</span>
      <button>Remove</button>
    </div>
  ),
}))

describe('AddedExerciseList', () => {
  it('should render and AddedExercise component for each exercise in the exercises prop', () => {
    render(
      <AddedExerciseList exercises={mockExercises} removeExercise={() => {}} weightUnit='kg' />,
    )

    const exerciseElements = screen.getAllByTestId('added-exercise')
    expect(exerciseElements).toHaveLength(mockExercises.length)
  })

  it('should not render any AddedExercise components when the exercises prop is an empty array', () => {
    render(<AddedExerciseList exercises={[]} removeExercise={() => {}} weightUnit='kg' />)

    const exerciseElements = screen.queryAllByTestId('added-exercise')
    expect(exerciseElements).toHaveLength(0)
  })

  it('should show the correct weight unit for each exercise', () => {
    render(
      <AddedExerciseList exercises={mockExercises} removeExercise={() => {}} weightUnit='kg' />,
    )

    const exerciseElements = screen.getAllByTestId('added-exercise')
    exerciseElements.forEach((element) => {
      expect(element).toHaveTextContent('kg')
    })
  })
})
