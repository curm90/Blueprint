import { render, screen } from '@testing-library/react'
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import EmptyUI from '~/components/EmptyUI'

// CreateWorkoutForm depends on Convex — mock it here since we're testing EmptyUI, not the form
vi.mock('~/components/CreateWorkoutForm', () => ({
  CreateWorkoutForm: () => <button>Create Workout</button>,
}))

vi.mock('lucide-react', () => ({
  Dumbbell: () => <div data-testid='dumbbell-icon'>Dumbbell Icon</div>,
}))

// function wrapper({ children }: { children: React.ReactNode }) {
//   const queryClient = new QueryClient({
//     defaultOptions: { queries: { retry: false } },
//   })
//   return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
// }

describe('EmptyUI', () => {
  it('renders the title and description passed as props', () => {
    render(<EmptyUI title='Test Title' description='Test Description' />)

    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
  })
  it('renders the correct icon when passed as a prop', () => {
    const TestIcon = () => <div data-testid='test-icon'>Test Icon</div>

    render(<EmptyUI title='Test Title' description='Test Description' icon={<TestIcon />} />)

    expect(screen.getByTestId('test-icon')).toBeInTheDocument()
    expect(screen.queryByTestId('dumbbell-icon')).not.toBeInTheDocument()
  })
  it('renders the default dumbbell icon when no icon prop is provided', () => {
    render(<EmptyUI title='Test Title' description='Test Description' />)
    expect(screen.getByTestId('dumbbell-icon')).toBeInTheDocument()
  })
})
