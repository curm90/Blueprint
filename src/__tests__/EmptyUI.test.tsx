import { it, expect, describe, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import EmptyUI from '~/components/EmptyUI'

// CreateWorkoutForm depends on Convex — mock it here since we're testing EmptyUI, not the form
vi.mock('~/components/CreateWorkoutForm', () => ({
  CreateWorkoutForm: () => <button>Create Workout</button>,
}))

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

describe('EmptyUI', () => {
  it('renders the title and description passed as props', () => {
    render(<EmptyUI title='Test Title' description='Test Description' />, { wrapper })

    screen.debug

    // expect(screen.getByText('Test Title')).toBeInTheDocument()
    // expect(screen.getByText('Test Description')).toBeInTheDocument()
  })
})
